import { NextResponse } from "next/server";
import { getMobileSession } from "@/lib/mobileAuth";


import { prisma } from "@/lib/db";
import { getLeastFavoritePolitician } from "@/lib/turkey-parts/characters";

export async function GET(req: Request) {
  const session = await getMobileSession(req);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { surveyResponses: true },
  });

  const responses = (user?.surveyResponses ?? {}) as Record<string, unknown>;
  const topIssue = typeof responses.top_issue === "string" ? responses.top_issue : "economy_jobs";
  const politicianKey = getLeastFavoritePolitician(responses.politician_ranking);

  return NextResponse.json({ topIssue, politicianKey });
}
