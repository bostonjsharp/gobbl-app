"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { ChatInterface, FinishResult, ChatMsg } from "@/components/chat/ChatInterface";
import { ScoreSummary } from "@/components/chat/ScoreSummary";

interface DebateData {
  id: string;
  topic: string;
  difficulty: string;
  category: string;
  completed: boolean;
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

  return (
    <div className="mx-auto flex h-[calc(100vh-64px)] max-w-4xl flex-col">
      <div className="border-b border-roost-200 px-4 py-3 dark:border-roost-800 bg-gradient-to-r from-gobbl-50/50 to-transparent dark:from-gobbl-950/20">
        <div className="flex items-center gap-2">
          <span className="text-lg">🦃</span>
          <div>
            <h2 className="text-sm font-bold text-roost-800 dark:text-roost-100">
              {debate.category} · {debate.difficulty}
            </h2>
            <p className="text-xs text-roost-500 truncate max-w-md">{debate.topic}</p>
          </div>
        </div>
      </div>
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
