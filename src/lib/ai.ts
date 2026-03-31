import OpenAI from "openai";
import { CivilityDimensions, CivilityResult, averageDimensions } from "./civility";
import { buildSystemPrompt } from "./prompts/builder";

const MOCK_MODE = !process.env.GROK_API_KEY;

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

export async function getAIOpening(
  topic: string,
  difficulty: string,
  category: string
): Promise<string> {
  if (MOCK_MODE) return getMockOpening(topic);

  const client = getClient()!;
  const systemPrompt = buildSystemPrompt(difficulty, category);

  const completion = await client.chat.completions.create({
    model: "grok-3-fast",
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
  return completion.choices[0]?.message?.content || getMockOpening(topic);
}

export async function getAIResponse(
  messages: ChatMessage[],
  topic: string,
  difficulty: string,
  category: string
): Promise<string> {
  if (MOCK_MODE) return getMockResponse(messages, topic);

  const client = getClient()!;
  const systemPrompt = buildSystemPrompt(difficulty, category);

  const completion = await client.chat.completions.create({
    model: "grok-3-fast",
    messages: [
      { role: "system", content: systemPrompt },
      ...messages,
    ],
    max_tokens: 400,
    temperature: 0.8,
  });
  return completion.choices[0]?.message?.content || "That's a thoughtful point. Could you tell me more about what led you to that view?";
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
    model: "grok-3-fast",
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

function getMockOpening(topic: string): string {
  const openers = [
    `Hey, I'm Robert. So, ${topic.toLowerCase()} — I've got some thoughts on this. Where do you stand? I'm curious what side you're coming from before I jump in.`,
    `Robert here. Look, when it comes to ${topic.toLowerCase()}, I think a lot of people have it wrong. But I want to hear what you think first — what's your take?`,
    `Hey, name's Robert. ${topic} is something I feel pretty strongly about, but I know not everyone sees it my way. What's your position on this? Let's get into it.`,
    `I'm Robert. So we're talking about ${topic.toLowerCase()} today — good, because this is one of those things that really matters. Tell me where you're at on this and I'll share where I'm coming from.`,
    `Robert. Nice to meet you. So, ${topic.toLowerCase()} — everyone's got an opinion on this one. What's yours? I want to know what I'm working with here before I give you mine.`,
  ];
  const idx = Math.floor(Math.random() * openers.length);
  return openers[idx];
}

function getMockResponse(messages: ChatMessage[], topic: string): string {
  const responses = [
    `That's a really interesting take on ${topic}. I see where you're coming from, but have you considered the counterargument that there might be unintended consequences? I'd love to hear your reasoning.`,
    `I appreciate you sharing that perspective. While I understand the appeal, I think we should also consider how this affects different communities. What would you say to someone who disagrees?`,
    `You raise a fair point, and I think there's real merit there. But let me push back a bit — the situation might be more nuanced than it first appears. How would you address concerns from the other side?`,
    `That's a thoughtful take, and I respect the reasoning behind it. I'd challenge you to think about the economic implications though. Sometimes well-intentioned policies have surprising outcomes. What's your response?`,
    `I can see the heart behind your argument, and that matters. But what about people who'd be negatively affected? How do we balance these competing interests in a way that's fair to everyone?`,
    `Good point — I think there's real common ground to find here. The devil is in the details though. What specific approach would you propose that addresses concerns from both sides?`,
  ];
  const idx = messages.length % responses.length;
  return responses[idx];
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
