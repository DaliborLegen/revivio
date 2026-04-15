import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { verifyAdmin } from "@/lib/admin-auth";

export async function GET() {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // 1. Get recent restorations
  const { data: restorations, error } = await supabaseAdmin
    .from("restorations")
    .select("id, user_id, status, original_size, mime_type, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!restorations || restorations.length === 0) {
    return NextResponse.json([]);
  }

  // 2. Get unique user_ids and fetch their emails from profiles
  const userIds = [...new Set(restorations.map((r) => r.user_id))];
  const { data: profiles } = await supabaseAdmin
    .from("profiles")
    .select("id, email")
    .in("id", userIds);

  const emailMap: Record<string, string> = {};
  if (profiles) {
    for (const p of profiles) {
      emailMap[p.id] = p.email;
    }
  }

  // 3. Merge and return
  const result = restorations.map((r) => ({
    id: r.id,
    user_email: emailMap[r.user_id] || "unknown",
    status: r.status,
    original_size: r.original_size,
    mime_type: r.mime_type,
    created_at: r.created_at,
  }));

  return NextResponse.json(result);
}
