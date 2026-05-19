"use client";

import { Suspense, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { DifficultyPicker } from "@/components/chat/DifficultyPicker";
import { TopicDropdown } from "@/components/chat/TopicDropdown";

function ChatEntryContent() {
  const { status } = useSession();
  const router = useRouter();
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [topicId, setTopicId] = useState<string | null>(null);

  if (status === "unauthenticated") {
    router.push("/");
    return null;
  }

  const canStart = !!difficulty && !!topicId;

  function start() {
    if (!canStart) return;
    router.push(`/chat/setup?topic=${topicId}&difficulty=${encodeURIComponent(difficulty!)}`);
  }

  return (
    <div className="flex flex-col gap-lg">
      <div>
        <h2 className="font-display text-2xl font-bold text-roost-700">Pick your match</h2>
        <p className="text-sm text-roost-500">Choose a challenge level, then a topic.</p>
      </div>

      <section>
        <h3 className="mb-3 font-display text-xs font-bold uppercase tracking-wider text-roost-500">
          Difficulty
        </h3>
        <DifficultyPicker value={difficulty} onChange={setDifficulty} />
      </section>

      <section>
        <h3 className="mb-3 font-display text-xs font-bold uppercase tracking-wider text-roost-500">
          Topic
        </h3>
        <TopicDropdown value={topicId} onChange={setTopicId} />
      </section>

      <Button size="lg" className="w-full" disabled={!canStart} onClick={start}>
        {canStart ? "Start debate" : "Pick difficulty and topic"}
      </Button>
    </div>
  );
}

export default function ChatEntryPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <span className="text-4xl animate-wiggle inline-block">🥚</span>
        </div>
      }
    >
      <ChatEntryContent />
    </Suspense>
  );
}
