import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getAIOpening } from "@/lib/ai";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const { topic, category, difficulty, isDaily } = await req.json();

  const debate = await prisma.debate.create({
    data: {
      userId,
      topic,
      category: category || "General",
      difficulty: difficulty || "Friendly",
      isDaily: isDaily || false,
    },
  });

  const aiOpening = await getAIOpening(
    topic,
    difficulty || "Friendly",
    category || "General"
  );

  await prisma.message.create({
    data: {
      debateId: debate.id,
      role: "assistant",
      content: aiOpening,
    },
  });

  return NextResponse.json({
    id: debate.id,
    topic: debate.topic,
    difficulty: debate.difficulty,
    openingMessage: aiOpening,
  });
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const url = new URL(req.url);
  const debateId = url.searchParams.get("id");

  if (debateId) {
    const debate = await prisma.debate.findFirst({
      where: { id: debateId, userId },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });
    if (!debate) {
      return NextResponse.json({ error: "Debate not found" }, { status: 404 });
    }
    return NextResponse.json(debate);
  }

  const debates = await prisma.debate.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return NextResponse.json(debates);
}
