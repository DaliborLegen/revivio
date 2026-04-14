import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Try with URL columns first, fallback to basic columns
  let { data, error } = await supabaseAdmin
    .from("restorations")
    .select("id, status, original_url, restored_url, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    // Columns might not exist yet — fallback
    const result = await supabaseAdmin
      .from("restorations")
      .select("id, status, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);
    data = (result.data || []).map((r) => ({ ...r, original_url: null, restored_url: null }));
  }

  return NextResponse.json(data || []);
}
