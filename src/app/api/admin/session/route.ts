import { NextResponse } from "next/server";
import { verifyAdmin, destroySession } from "@/lib/admin-auth";

export async function GET() {
  const email = await verifyAdmin();

  if (!email) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true, email });
}

export async function DELETE() {
  await destroySession();
  return NextResponse.json({ success: true });
}
