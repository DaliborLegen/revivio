import { cookies } from "next/headers";

const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || "revivio-admin-secret-2024";

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "revivio-salt-2024");
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Admin credentials from env: ADMIN_USERS=email:hash,email2:hash2
function getAdminUsers(): Map<string, string> {
  const map = new Map<string, string>();
  const raw = process.env.ADMIN_USERS || "";
  if (!raw) return map;
  for (const entry of raw.split(",")) {
    const [email, hash] = entry.split(":");
    if (email && hash) map.set(email.trim().toLowerCase(), hash.trim());
  }
  return map;
}

export async function checkCredentials(email: string, password: string): Promise<boolean> {
  const admins = getAdminUsers();
  const hash = await hashPassword(password);
  const stored = admins.get(email.toLowerCase());
  return stored === hash;
}

export function getAdminEmails(): string[] {
  const admins = getAdminUsers();
  return Array.from(admins.keys());
}

// Session: HMAC-signed cookie with email + expiry
async function signToken(email: string): Promise<string> {
  const expires = Date.now() + 24 * 60 * 60 * 1000; // 24h
  const payload = `${email}|${expires}`;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  const sigHex = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${payload}|${sigHex}`;
}

async function verifyToken(token: string): Promise<string | null> {
  const parts = token.split("|");
  if (parts.length !== 3) return null;

  const [email, expiresStr, sigHex] = parts;
  const expires = parseInt(expiresStr);

  if (Date.now() > expires) return null;

  const payload = `${email}|${expiresStr}`;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );
  const sigBytes = new Uint8Array(
    sigHex.match(/.{2}/g)!.map((b) => parseInt(b, 16))
  );
  const valid = await crypto.subtle.verify("HMAC", key, sigBytes, encoder.encode(payload));

  return valid ? email : null;
}

export async function createSession(email: string): Promise<void> {
  const token = await signToken(email);
  const cookieStore = await cookies();
  cookieStore.set("admin_session", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 24 * 60 * 60,
  });
}

export async function verifyAdmin(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("admin_session", "", { maxAge: 0, path: "/" });
}
