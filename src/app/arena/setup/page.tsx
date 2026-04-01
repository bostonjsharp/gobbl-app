"use client";

import { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { TOPICS, getDailyTopic, formatTopicForDebate, type Topic } from "@/lib/topics";
import { DIFFICULTIES } from "@/lib/gamification";
import { IDEOLOGY_OPTIONS, type BeliefKey } from "@/lib/prompts/beliefs";
import { TurkeyAvatar } from "@/components/gamification/TurkeyAvatar";

function SetupContent() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDaily = searchParams.get("daily") === "true";
  const topicId = searchParams.get("topic");

  const [selectedDifficulty, setSelectedDifficulty] = useState("Friendly Cluck");
  const [selectedBeliefKey, setSelectedBeliefKey] = useState<BeliefKey>("center");
  const [loading, setLoading] = useState(false);
  const [dailyCompleted, setDailyCompleted] = useState(false);
  const [checkingDaily, setCheckingDaily] = useState(isDaily);

  const topic: Topic | null = (() => {
    if (isDaily) return getDailyTopic();
    if (!topicId) return null;
    return TOPICS.find((t) => t.id === topicId) ?? null;
  })();

  useEffect(() => {
    if (!isDaily) {
      setCheckingDaily(false);
      return;
    }
    if (status === "authenticated") {
      fetch("/api/user")
        .then((r) => r.json())
        .then((data) => setDailyCompleted(data.dailyCompleted ?? false))
        .finally(() => setCheckingDaily(false));
    } else {
      setCheckingDaily(false);
    }
  }, [status, isDaily]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    if (isDaily) return;
    if (!topicId || !TOPICS.some((t) => t.id === topicId)) {
      router.replace("/arena");
    }
  }, [status, isDaily, topicId, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="text-4xl animate-wiggle inline-block">🥚</span>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  if (!topic) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="text-4xl animate-wiggle inline-block">🥚</span>
      </div>
    );
  }

  if (checkingDaily) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="text-4xl animate-wiggle inline-block">🥚</span>
      </div>
    );
  }

  if (isDaily && dailyCompleted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <div className="mb-6">
          <TurkeyAvatar level={5} size="lg" />
        </div>
        <div className="inline-block rounded-full bg-emerald-200 px-4 py-1 text-sm font-bold text-emerald-800 mb-4">
          Daily Gobble complete
        </div>
        <h2 className="mb-2 text-2xl font-bold text-roost-800 dark:text-roost-100">
          You&apos;ve already gobbled today!
        </h2>
        <p className="mb-6 text-roost-500">
          Come back tomorrow for a fresh topic and bonus feathers.
        </p>
        <div className="flex justify-center gap-3">
          <Button onClick={() => router.push("/arena")}>Browse topics</Button>
          <Button variant="secondary" onClick={() => router.push("/dashboard")}>
            Back to Roost
          </Button>
        </div>
      </div>
    );
  }

  const startDebate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/debates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: formatTopicForDebate(topic),
          category: topic.category,
          difficulty: selectedDifficulty,
          beliefKey: selectedBeliefKey,
          isDaily,
        }),
      });
      if (!res.ok) throw new Error("Failed to start");
      const data = await res.json();
      router.push(`/arena/${data.id}`);
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-6 text-sm text-gobbl-600 hover:underline"
      >
        ← Back to Arena
      </button>

      <div className="mb-6 text-center">
        {isDaily && (
          <div className="inline-block rounded-full bg-golden-200 px-4 py-1 text-sm font-bold text-golden-800 mb-3">
            Daily Gobble
          </div>
        )}
        <h1 className="text-2xl font-bold text-roost-900 dark:text-roost-50 mb-2">{topic.title}</h1>
        <p className="text-roost-500">{topic.description}</p>
        <p className="mt-2 text-xs text-roost-400">{topic.category}</p>
      </div>

      <div className="mb-8">
        <label className="mb-3 block text-sm font-semibold text-roost-700 dark:text-roost-300">
          Challenge level
        </label>
        <div className="flex flex-wrap gap-2">
          {DIFFICULTIES.map((d) => (
            <button
              key={d.key}
              type="button"
              onClick={() => setSelectedDifficulty(d.key)}
              className={`rounded-xl px-4 py-2.5 text-left text-sm font-medium transition-all flex-1 min-w-[140px]
                ${
                  selectedDifficulty === d.key
                    ? "bg-gradient-to-r from-gobbl-500 to-gobbl-600 text-white shadow-md"
                    : "bg-roost-100 text-roost-600 hover:bg-roost-200 dark:bg-roost-800 dark:text-roost-300"
                }`}
            >
              <div>{d.label}</div>
              <div className="text-xs opacity-80">{d.description}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <label className="mb-3 block text-sm font-semibold text-roost-700 dark:text-roost-300">
          Robert&apos;s ideology
        </label>
        <p className="text-xs text-roost-500 mb-3">
          Choose the political stance Robert will roleplay for this conversation.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {IDEOLOGY_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setSelectedBeliefKey(opt.key)}
              className={`rounded-xl px-4 py-3 text-left text-sm transition-all border-2
                ${
                  selectedBeliefKey === opt.key
                    ? "border-gobbl-500 bg-gobbl-50 dark:bg-gobbl-950/40"
                    : "border-roost-200 bg-white dark:bg-roost-900 dark:border-roost-700 hover:border-roost-300"
                }`}
            >
              <div className="font-bold text-roost-800 dark:text-roost-100">{opt.label}</div>
              <div className="text-xs text-roost-500">{opt.description}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <Button size="lg" onClick={startDebate} disabled={loading}>
          {loading ? "Starting…" : "Let's talk turkey"}
        </Button>
      </div>
    </div>
  );
}

export default function ArenaSetupPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <span className="text-4xl animate-wiggle inline-block">🥚</span>
        </div>
      }
    >
      <SetupContent />
    </Suspense>
  );
}
