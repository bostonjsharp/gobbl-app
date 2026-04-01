import OpenAI from "openai";
import { CivilityDimensions, CivilityResult, averageDimensions } from "./civility";
import { buildSystemPrompt } from "./prompts/builder";
import type { BeliefKey } from "./prompts/beliefs";

const MOCK_MODE = !process.env.GROK_API_KEY;

/** Grok 4 fast reasoning — see https://docs.x.ai/docs/models */
const GROK_MODEL = process.env.GROK_MODEL ?? "grok-4-1-fast-reasoning";

let grokClient: OpenAI | null = null;
function getClient() {
  if (!grokClient && !MOCK_MODE) {
    grokClient = new OpenAI({
      apiKey: process.env.GROK_API_KEY,
      baseURL: "https://api.x.ai/v1",
    });
  }
  return grokClient;
}

const SCORING_PROMPT = `You are the civility scorer for Gobbl, a discourse training app. Evaluate the user's message on these dimensions (1-10 scale):

1. respectfulTone: Does the user avoid insults, sarcasm, and dismissiveness? (10=perfectly respectful)
2. evidenceBased: Does the user use facts, logic, and reasoning? (10=strong evidence use)
3. empathy: Does the user acknowledge the other perspective? (10=deeply empathetic)
4. constructiveFraming: Does the user propose solutions rather than just criticize? (10=very constructive)
5. activeListening: Does the user reference what was previously said? (10=excellent listening)

Respond ONLY with valid JSON in this exact format:
{"respectfulTone":N,"evidenceBased":N,"empathy":N,"constructiveFraming":N,"activeListening":N,"feedback":"One brief sentence of encouraging, constructive feedback"}`;

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

const NO_GROK_KEY =
  "Robert is offline — add GROK_API_KEY to your environment to run conversations.";

export async function getAIOpening(
  topic: string,
  difficulty: string,
  beliefKey: BeliefKey
): Promise<string> {
  if (MOCK_MODE) return NO_GROK_KEY;

  const client = getClient()!;
  const systemPrompt = buildSystemPrompt(difficulty, beliefKey);

  const completion = await client.chat.completions.create({
    model: GROK_MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `The topic for today's discussion is: ${topic}\n\nIntroduce yourself briefly and share your initial take on this topic to get the conversation started.`,
      },
    ],
    max_tokens: 400,
    temperature: 0.8,
  });
  const text = completion.choices[0]?.message?.content?.trim();
  return text || "Hmm, I blanked — say that again?";
}

export async function getAIResponse(
  messages: ChatMessage[],
  topic: string,
  difficulty: string,
  beliefKey: BeliefKey
): Promise<string> {
  if (MOCK_MODE) return NO_GROK_KEY;

  const client = getClient()!;
  const systemPrompt = buildSystemPrompt(difficulty, beliefKey);

  const completion = await client.chat.completions.create({
    model: GROK_MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      ...messages,
    ],
    max_tokens: 400,
    temperature: 0.8,
  });
  const text = completion.choices[0]?.message?.content?.trim();
  return text || "Lost my train of thought — what were you saying?";
}

export async function scoreCivility(
  userMessage: string,
  conversationContext: ChatMessage[]
): Promise<CivilityResult> {
  if (MOCK_MODE) return getMockScore(userMessage);

  const client = getClient()!;
  const contextStr = conversationContext
    .slice(-4)
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n");

  const completion = await client.chat.completions.create({
    model: GROK_MODEL,
    messages: [
      { role: "system", content: SCORING_PROMPT },
      {
        role: "user",
        content: `Conversation context:\n${contextStr}\n\nUser message to score:\n"${userMessage}"`,
      },
    ],
    max_tokens: 200,
    temperature: 0.3,
  });

  try {
    const raw = completion.choices[0]?.message?.content || "";
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found");
    const parsed = JSON.parse(jsonMatch[0]);
    const dimensions: CivilityDimensions = {
      respectfulTone: clamp(parsed.respectfulTone),
      evidenceBased: clamp(parsed.evidenceBased),
      empathy: clamp(parsed.empathy),
      constructiveFraming: clamp(parsed.constructiveFraming),
      activeListening: clamp(parsed.activeListening),
    };
    return {
      dimensions,
      overall: averageDimensions(dimensions),
      feedback: parsed.feedback || "Keep those feathers flying — great discourse!",
    };
  } catch {
    return getMockScore(userMessage);
  }
}

function clamp(val: number): number {
  return Math.max(1, Math.min(10, Math.round(val)));
}

function getMockScore(message: string): CivilityResult {
  const length = message.length;
  const hasQuestion = message.includes("?");
  const base = 5 + Math.min(3, length / 100);

  const dimensions: CivilityDimensions = {
    respectfulTone: clamp(base + (Math.random() * 2 - 0.5)),
    evidenceBased: clamp(base - 1 + Math.random() * 2),
    empathy: clamp(base - 0.5 + (hasQuestion ? 1 : 0) + Math.random()),
    constructiveFraming: clamp(base - 0.5 + Math.random() * 2),
    activeListening: clamp(base - 1 + (hasQuestion ? 1.5 : 0) + Math.random()),
  };

  return {
    dimensions,
    overall: averageDimensions(dimensions),
    feedback: hasQuestion
      ? "Nice work asking questions — that shows real engagement with the other side. Your feathers are looking bright!"
      : "Try asking a question to show you're actively engaging with the other viewpoint. Curious turkeys earn more feathers!",
  };
}
