import { NextResponse } from "next/server";
import { getMobileSession } from "@/lib/mobileAuth";


import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getMobileSession(req);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const skillKey = searchParams.get("skillKey");
  if (!skillKey) return NextResponse.json({ error: "skillKey required" }, { status: 400 });

  const skillSession = await prisma.skillSession.findFirst({
    where: { userId, skillKey, completedAt: null },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ session: skillSession });
}

export async function POST(req: Request) {
  const session = await getMobileSession(req);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { skillKey?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { skillKey } = body;
  if (!skillKey) return NextResponse.json({ error: "skillKey required" }, { status: 400 });

  const existing = await prisma.skillSession.findFirst({
    where: { userId, skillKey, completedAt: null },
    orderBy: { createdAt: "desc" },
  });
  if (existing) return NextResponse.json({ session: existing });

  const skillSession = await prisma.skillSession.create({
    data: { userId, skillKey },
  });
  return NextResponse.json({ session: skillSession }, { status: 201 });
}
