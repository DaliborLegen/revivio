import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// One-time setup endpoint - creates admin tables and seeds first admin
// Access: GET /api/admin/setup?key=revivio-setup-2024
export async function GET(request: Request) {
  const url = new URL(request.url);
  if (url.searchParams.get("key") !== "revivio-setup-2024") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const results: string[] = [];

  // Check if admin_users exists
  const { error: checkErr } = await supabaseAdmin
    .from("admin_users")
    .select("email")
    .limit(1);

  if (checkErr) {
    results.push("admin_users table not found: " + checkErr.message);
    results.push("Please run this SQL in Supabase Dashboard > SQL Editor:");
    results.push("");
    results.push("CREATE TABLE public.admin_users (email text PRIMARY KEY, password_hash text NOT NULL, created_at timestamptz NOT NULL DEFAULT now());");
    results.push("CREATE TABLE public.admin_sessions (token text PRIMARY KEY, email text NOT NULL, expires_at timestamptz NOT NULL, created_at timestamptz NOT NULL DEFAULT now());");
    results.push("INSERT INTO public.admin_users (email, password_hash) VALUES ('dalibor.legen@gmail.com', 'fa8b3dbd1a8af4d73f01936b2872d99ad2784f4e05d84dd35124efeabbffcddf');");
  } else {
    // Table exists - try to seed admin
    const { error: insertErr } = await supabaseAdmin
      .from("admin_users")
      .upsert({
        email: "dalibor.legen@gmail.com",
        password_hash: "fa8b3dbd1a8af4d73f01936b2872d99ad2784f4e05d84dd35124efeabbffcddf",
      });

    if (insertErr) {
      results.push("Error seeding admin: " + insertErr.message);
    } else {
      results.push("Admin user dalibor.legen@gmail.com created/updated!");
    }

    // Check sessions table
    const { error: sessErr } = await supabaseAdmin
      .from("admin_sessions")
      .select("token")
      .limit(1);

    if (sessErr) {
      results.push("admin_sessions table missing. Run SQL above.");
    } else {
      results.push("admin_sessions table OK");
    }
  }

  return NextResponse.json({ results });
}
