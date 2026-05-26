// [persona-rating: temporary] — entire route is part of the removable rating system.
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as { id: string }).id;

  const { debateId, rating } = await req.json();

  if (typeof debateId !== "string" || !debateId) {
    return NextResponse.json({ error: "debateId required" }, { status: 400 });
  }
  if (typeof rating !== "number" || !Number.isInteger(rating) || rating < 1 || rating > 10) {
    return NextResponse.json({ error: "rating must be an integer 1-10" }, { status: 400 });
  }

  const debate = await prisma.debate.findFirst({
    where: { id: debateId, userId },
    select: { id: true, personaId: true, completed: true },
  });
  if (!debate) {
    return NextResponse.json({ error: "Debate not found" }, { status: 404 });
  }
  if (!debate.completed) {
    return NextResponse.json({ error: "Debate not completed" }, { status: 400 });
  }
  if (!debate.personaId) {
    return NextResponse.json({ error: "Debate has no persona to rate" }, { status: 400 });
  }

  await prisma.personaRating.upsert({
    where: { userId_debateId: { userId, debateId } },
    create: {
      userId,
      debateId,
      personaId: debate.personaId,
      rating,
    },
    update: {
      rating,
    },
  });

  return NextResponse.json({ ok: true });
}
