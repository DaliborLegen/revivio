import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Query basic columns (always available)
  const { data: basicData } = await supabaseAdmin
    .from("restorations")
    .select("id, status, created_at, original_size, mime_type")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  // Try to get URL columns separately
  let urlMap: Record<string, { original_url: string | null; restored_url: string | null }> = {};
  try {
    const { data: urlData } = await supabaseAdmin
      .from("restorations")
      .select("id, original_url, restored_url")
      .eq("user_id", user.id);
    if (urlData) {
      for (const r of urlData) {
        urlMap[r.id] = { original_url: r.original_url, restored_url: r.restored_url };
      }
    }
  } catch {
    // URL columns don't exist yet — ignore
  }

  const data = (basicData || []).map((r) => ({
    ...r,
    original_url: urlMap[r.id]?.original_url || null,
    restored_url: urlMap[r.id]?.restored_url || null,
  }));

  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  // Verify ownership
  const { data: restoration } = await supabaseAdmin
    .from("restorations")
    .select("id, user_id, original_url, restored_url")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!restoration) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Delete images from storage if they exist
  if (restoration.original_url || restoration.restored_url) {
    const paths: string[] = [];
    const baseUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/restorations/`;
    if (restoration.original_url?.startsWith(baseUrl)) {
      paths.push(restoration.original_url.replace(baseUrl, ""));
    }
    if (restoration.restored_url?.startsWith(baseUrl)) {
      paths.push(restoration.restored_url.replace(baseUrl, ""));
    }
    if (paths.length > 0) {
      await supabaseAdmin.storage.from("restorations").remove(paths);
    }
  }

  // Delete database record
  await supabaseAdmin.from("restorations").delete().eq("id", id).eq("user_id", user.id);

  return NextResponse.json({ success: true });
}
