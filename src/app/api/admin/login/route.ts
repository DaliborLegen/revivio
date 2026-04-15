import { NextResponse } from "next/server";
import { checkCredentials, createSession } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email in geslo sta obvezna" }, { status: 400 });
  }

  const valid = await checkCredentials(email, password);

  if (!valid) {
    return NextResponse.json({ error: "Napacen email ali geslo" }, { status: 401 });
  }

  await createSession(email);

  return NextResponse.json({ success: true });
}
