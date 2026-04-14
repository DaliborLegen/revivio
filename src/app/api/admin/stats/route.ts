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
  const totalCost = totalRestorations * 0.051;

  // This month's restorations
  const firstOfMonth = new Date();
  firstOfMonth.setDate(1);
  firstOfMonth.setHours(0, 0, 0, 0);

  const { count: monthlyRestorations } = await supabaseAdmin
    .from("restorations")
    .select("id", { count: "exact", head: true })
    .gte("created_at", firstOfMonth.toISOString());

  const monthlyCost = (monthlyRestorations || 0) * 0.051;

  return NextResponse.json({
    totalUsers,
    totalRestorations,
    activeSubscribers,
    estimatedCost: totalCost.toFixed(2),
    monthlyRestorations: monthlyRestorations || 0,
    monthlyCost: monthlyCost.toFixed(2),
  });
}
