import { NextResponse } from "next/server";
import { getMobileSession } from "@/lib/mobileAuth";


import { prisma } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const session = await getMobileSession(req);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const existing = await prisma.skillSession.findUnique({ where: { id: params.id } });
  if (!existing || existing.userId !== userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const allowed = [
    "stage", "preStressRating", "postStressRating",
    "preDebateId", "postDebateId",
    "preCivility", "postCivility",
    "prePostText", "postPostText",
    "statement1", "statement2",
    "feathersEarned", "completedAt",
  ];
  const data: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) data[key] = body[key];
  }

  const updated = await prisma.skillSession.update({ where: { id: params.id }, data });
  return NextResponse.json({ session: updated });
}
