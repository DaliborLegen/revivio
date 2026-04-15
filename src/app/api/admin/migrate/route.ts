import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { verifyAdmin } from "@/lib/admin-auth";

export async function POST() {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const results: string[] = [];

  // Check if original_url column exists
  const { error: testErr } = await supabaseAdmin
    .from("restorations")
    .select("original_url")
    .limit(1);

  if (testErr) {
    results.push("original_url/restored_url columns missing — please run SQL manually");
    results.push("SQL: ALTER TABLE public.restorations ADD COLUMN IF NOT EXISTS original_url text;");
    results.push("SQL: ALTER TABLE public.restorations ADD COLUMN IF NOT EXISTS restored_url text;");
  } else {
    results.push("original_url column exists ✓");
  }

  // Check alerts table
  const { error: alertErr } = await supabaseAdmin
    .from("alerts")
    .select("id")
    .limit(1);

  if (alertErr) {
    // Try to work without it
    results.push("alerts table does not exist (optional)");
  } else {
    results.push("alerts table exists ✓");
  }

  return NextResponse.json({ results });
}
