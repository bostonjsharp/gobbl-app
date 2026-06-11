import { NextResponse } from "next/server";
import { getMobileSession } from "@/lib/mobileAuth";


import { prisma } from "@/lib/db";
import { getAIOpening } from "@/lib/ai";
import { flipBelief } from "@/lib/prompts/flipBelief";
import { getUserBelief } from "@/lib/prompts/userBelief";
import { pickPersona, getPersonaById, isTier } from "@/lib/personas/pool";

export async function POST(req: Request) {
  const session = await getMobileSession(req);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const { topic, category, difficulty, isDaily, newsStoryUrl, newsStoryContent } = await req.json();

  const tier = isTier(difficulty) ? difficulty : "Friendly Cluck";
  const persona = pickPersona(tier);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { surveyResponses: true },
  });
  // Keep flipBelief on the user's onboarding belief — this is what the chat-setup card surfaces.
  // The persona's own beliefKey is what the system prompt uses, so the two live independently for now.
  const beliefKey = flipBelief(getUserBelief(user?.surveyResponses));

  const debate = await prisma.debate.create({
    data: {
      userId,
      topic,
      category: category || "General",
      beliefKey,
      difficulty: tier,
      personaId: persona.id,
      isDaily: isDaily || false,
      newsStoryUrl: newsStoryUrl || null,
      newsStoryContent: newsStoryContent || null,
    },
  });

  const aiOpening = await getAIOpening(topic, persona, newsStoryContent || undefined);

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
    personaInitials: persona.initials,
    openingMessage: aiOpening,
  });
}

export async function GET(req: Request) {
  const session = await getMobileSession(req);
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
    const persona = getPersonaById(debate.personaId);
    return NextResponse.json({
      ...debate,
      personaInitials: persona?.initials ?? null,
    });
  }

  const debates = await prisma.debate.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return NextResponse.json(debates);
}
