import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== "dalibor.legen@gmail.com") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: profiles, error } = await supabaseAdmin
    .from("profiles")
    .select("id, email, plan, credits_remaining, credits_per_month, subscription_status, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Get restoration counts per user
  const { data: restorations } = await supabaseAdmin
    .from("restorations")
    .select("user_id");

  const countMap: Record<string, number> = {};
  if (restorations) {
    for (const r of restorations) {
      countMap[r.user_id] = (countMap[r.user_id] || 0) + 1;
    }
  }

  const data = (profiles || []).map((p) => ({
    email: p.email,
    plan: p.plan,
    credits_remaining: p.credits_remaining,
    credits_per_month: p.credits_per_month,
    subscription_status: p.subscription_status,
    created_at: p.created_at,
    total_restorations: countMap[p.id] || 0,
    estimated_cost: ((countMap[p.id] || 0) * 0.051).toFixed(2),
  }));

  return NextResponse.json(data);
}
