"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ChatInterface, FinishResult, ChatMsg } from "@/components/chat/ChatInterface";
import { ScoreSummary } from "@/components/chat/ScoreSummary";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { IDEOLOGY_OPTIONS } from "@/lib/prompts/beliefs";

interface DebateData {
  id: string;
  topic: string;
  difficulty: string;
  category: string;
  beliefKey: string;
  completed: boolean;
  overallScore: number | null;
  messages: {
    id: string;
    role: string;
    content: string;
    civilityScore: number | null;
  }[];
}

export default function DebatePage() {
  const { status } = useSession();
  const router = useRouter();
  const params = useParams();
  const debateId = params.id as string;
  const [debate, setDebate] = useState<DebateData | null>(null);
  const [result, setResult] = useState<FinishResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
      return;
    }
    if (status === "authenticated" && debateId) {
      fetch(`/api/debates?id=${debateId}`)
        .then((r) => r.json())
        .then((data) => {
          setDebate(data);
          setLoading(false);
        })
        .catch(() => {
          router.push("/arena");
        });
    }
  }, [status, debateId, router]);

  if (loading || !debate) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <span className="text-4xl animate-wiggle inline-block mb-2">🥚</span>
          <p className="text-sm text-roost-500">Preparing your discussion...</p>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="mx-auto max-w-3xl py-8">
        <ScoreSummary result={result} />
      </div>
    );
  }

  const initialMessages: ChatMsg[] = debate.messages.map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
    civilityScore: m.civilityScore,
  }));

  const ideologyLabel =
    IDEOLOGY_OPTIONS.find((o) => o.key === debate.beliefKey)?.label ?? debate.beliefKey;

  const header = (
    <div className="border-b border-roost-200 px-4 py-3 dark:border-roost-800 bg-gradient-to-r from-gobbl-50/50 to-transparent dark:from-gobbl-950/20">
      <div className="flex items-center gap-2">
        <span className="text-lg">🦃</span>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-bold text-roost-800 dark:text-roost-100">
            {debate.category} · {debate.difficulty} · {ideologyLabel}
          </h2>
          <p className="text-xs text-roost-500 truncate max-w-md">{debate.topic}</p>
        </div>
        {debate.completed && debate.overallScore != null && (
          <div className="shrink-0 text-right">
            <div className="text-[10px] uppercase tracking-wide text-roost-500">Civility</div>
            <div className="text-sm font-bold text-roost-800 dark:text-roost-100 tabular-nums">
              {debate.overallScore.toFixed(1)}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (debate.completed) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-4xl flex-col">
        {header}
        <div className="border-b border-roost-100 bg-roost-50/80 px-4 py-2 text-center text-xs text-roost-600 dark:border-roost-800 dark:bg-roost-900/50 dark:text-roost-400">
          View-only transcript — this discussion is finished.{" "}
          <Link href="/dashboard" className="font-medium text-gobbl-600 underline-offset-2 hover:underline dark:text-gobbl-400">
            Back to Roost
          </Link>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {initialMessages.map((msg, i) => (
            <MessageBubble
              key={i}
              role={msg.role}
              content={msg.content}
              civilityScore={msg.civilityScore}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-64px)] max-w-4xl flex-col">
      {header}
      <div className="flex-1 overflow-hidden">
        <ChatInterface
          debateId={debate.id}
          initialMessages={initialMessages}
          maxTurns={8}
          onFinish={(r) => setResult(r)}
        />
      </div>
    </div>
  );
}
