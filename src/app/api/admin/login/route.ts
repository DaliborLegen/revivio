import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { cookies } from "next/headers";

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "revivio-salt-2024");
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function generateToken(): Promise<string> {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }

  // Check if admin_users table exists, if not create it with default admin
  const { data: adminUser, error } = await supabaseAdmin
    .from("admin_users")
    .select("email, password_hash")
    .eq("email", email.toLowerCase())
    .single();

  if (error && error.code === "PGRST116") {
    // No matching row
    return NextResponse.json({ error: "Napačen email ali geslo" }, { status: 401 });
  }

  if (error) {
    // Table might not exist — try to seed
    return NextResponse.json({ error: "Admin system not initialized. Run migration." }, { status: 500 });
  }

  const inputHash = await hashPassword(password);

  if (adminUser.password_hash !== inputHash) {
    return NextResponse.json({ error: "Napačen email ali geslo" }, { status: 401 });
  }

  // Generate session token
  const token = await generateToken();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24h

  // Store session
  await supabaseAdmin.from("admin_sessions").insert({
    token,
    email: email.toLowerCase(),
    expires_at: expiresAt,
  });

  // Set cookie
  const cookieStore = await cookies();
  cookieStore.set("admin_session", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 24 * 60 * 60, // 24h
  });

  return NextResponse.json({ success: true });
}
