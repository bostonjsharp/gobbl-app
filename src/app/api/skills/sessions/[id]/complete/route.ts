import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

const BASE_FEATHERS   = 40;
const PARDON_PER_SKILL = 1;

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { preCivility?: number; postCivility?: number };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const existing = await prisma.skillSession.findUnique({ where: { id: params.id } });
  if (!existing || existing.userId !== userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (existing.completedAt) {
    return NextResponse.json({ feathersEarned: existing.feathersEarned ?? BASE_FEATHERS });
  }

  const pre  = body.preCivility  ?? existing.preCivility  ?? 5;
  const post = body.postCivility ?? existing.postCivility ?? 5;

  const improvement    = Math.max(0, post - pre);
  const variableFeathers = Math.round(improvement * 12);
  const feathersEarned = BASE_FEATHERS + variableFeathers;

  const now = new Date();

  await prisma.$transaction([
    prisma.skillSession.update({
      where: { id: params.id },
      data: {
        preCivility:   pre,
        postCivility:  post,
        feathersEarned,
        completedAt:   now,
        stage:         "reward",
      },
    }),
    prisma.user.update({
      where: { id: userId },
      data: {
        featherBalance: { increment: feathersEarned },
        pardonPoints:   { increment: PARDON_PER_SKILL },
      },
    }),
  ]);

  return NextResponse.json({ feathersEarned, pardonPointsEarned: PARDON_PER_SKILL });
}
