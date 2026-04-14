import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== "dalibor.legen@gmail.com") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [profilesRes, restorationsRes, subscribersRes] = await Promise.all([
    supabaseAdmin.from("profiles").select("id", { count: "exact", head: true }),
    supabaseAdmin.from("restorations").select("id", { count: "exact", head: true }),
    supabaseAdmin.from("profiles").select("id", { count: "exact", head: true }).neq("plan", "free").eq("subscription_status", "active"),
  ]);

  const totalUsers = profilesRes.count || 0;
  const totalRestorations = restorationsRes.count || 0;
  const activeSubscribers = subscribersRes.count || 0;
  const estimatedCost = totalRestorations * 0.05 + totalRestorations * 0.001; // restoration + analysis

  return NextResponse.json({
    totalUsers,
    totalRestorations,
    activeSubscribers,
    estimatedCost: estimatedCost.toFixed(2),
  });
}
