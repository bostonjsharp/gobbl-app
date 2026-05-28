import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { scoreCivility } from "@/lib/ai";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!(session?.user as { id?: string } | undefined)?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { text?: string; context?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { text, context = "" } = body;
  if (!text?.trim()) return NextResponse.json({ error: "text required" }, { status: 400 });

  const result = await scoreCivility(text, [
    { role: "assistant", content: context },
  ]);

  return NextResponse.json({ civility: result.overall });
}
