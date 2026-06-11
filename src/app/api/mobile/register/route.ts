import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { signMobileToken } from "@/lib/mobileAuth";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (!username || username.length < 3 || username.length > 20) {
    return NextResponse.json({ error: "Username must be 3–20 characters" }, { status: 400 });
  }
  if (!password || password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    return NextResponse.json({ error: "Username already taken" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { username, passwordHash } });

  const token = await signMobileToken(user.id);
  return NextResponse.json({ token, userId: user.id, username: user.username }, { status: 201 });
}
