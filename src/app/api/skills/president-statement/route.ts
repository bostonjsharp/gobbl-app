import { NextResponse } from "next/server";
import { getMobileSession } from "@/lib/mobileAuth";


import { generatePresidentStatement } from "@/lib/ai";

export async function POST(req: Request) {
  const session = await getMobileSession(req);
  if (!(session?.user as { id?: string } | undefined)?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { politicianKey?: string; topicKey?: string; statementNumber?: number };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { politicianKey, topicKey, statementNumber } = body;
  if (!politicianKey || !topicKey || (statementNumber !== 1 && statementNumber !== 2)) {
    return NextResponse.json({ error: "politicianKey, topicKey, statementNumber(1|2) required" }, { status: 400 });
  }

  const statement = await generatePresidentStatement(politicianKey, topicKey, statementNumber);
  return NextResponse.json({ statement });
}
