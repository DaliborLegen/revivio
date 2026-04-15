import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { verifyAdmin } from "@/lib/admin-auth";

export async function GET() {
  const admin = await verifyAdmin();
  if (!admin) {
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
