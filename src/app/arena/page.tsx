"use client";

import { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { TOPICS, CATEGORIES, getDailyTopic } from "@/lib/topics";
import { DIFFICULTIES } from "@/lib/gamification";
import { TurkeyAvatar } from "@/components/gamification/TurkeyAvatar";

function ArenaContent() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState("Friendly Cluck");
  const [loading, setLoading] = useState(false);
  const [dailyCompleted, setDailyCompleted] = useState(false);
  const [checkingDaily, setCheckingDaily] = useState(true);

  const isDaily = searchParams.get("daily") === "true";
  const topicParam = searchParams.get("topic");

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/user")
        .then((r) => r.json())
        .then((data) => setDailyCompleted(data.dailyCompleted ?? false))
        .finally(() => setCheckingDaily(false));
    } else {
      setCheckingDaily(false);
    }
  }, [status]);

  if (status === "unauthenticated") {
    router.push("/");
    return null;
  }

  const startDebate = async (topicId: string, daily: boolean = false) => {
    setLoading(true);
    const topic = TOPICS.find((t) => t.id === topicId);
    if (!topic) return;

    try {
      const res = await fetch("/api/debates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.prompt,
          category: topic.category,
          difficulty: selectedDifficulty,
          isDaily: daily,
        }),
      });
      const data = await res.json();
      router.push(`/arena/${data.id}`);
    } catch {
      setLoading(false);
    }
  };

  if (isDaily && topicParam) {
    const dailyTopic = getDailyTopic();

    if (checkingDaily) {
      return (
        <div className="flex min-h-[60vh] items-center justify-center">
          <span className="text-4xl animate-wiggle inline-block">🥚</span>
        </div>
      );
    }

    if (dailyCompleted) {
      return (
        <div className="mx-auto max-w-2xl px-4 py-12 text-center">
          <div className="mb-6">
            <TurkeyAvatar level={5} size="lg" />
          </div>
          <div className="inline-block rounded-full bg-emerald-200 px-4 py-1 text-sm font-bold text-emerald-800 mb-4">
            ✅ Daily Gobble Complete
          </div>
          <h2 className="mb-2 text-2xl font-bold text-roost-800 dark:text-roost-100">
            You&apos;ve already gobbled today!
          </h2>
          <p className="mb-6 text-roost-500">
            Nice work completing today&apos;s challenge. Come back tomorrow for a fresh topic and bonus feathers.
          </p>
          <div className="flex justify-center gap-3">
            <Button onClick={() => router.push("/arena")}>
              Browse Other Topics
            </Button>
            <Button variant="secondary" onClick={() => router.push("/dashboard")}>
              Back to Roost
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <div className="mb-6">
          <TurkeyAvatar level={5} size="lg" />
        </div>
        <div className="inline-block rounded-full bg-golden-200 px-4 py-1 text-sm font-bold text-golden-800 mb-4">
          🌅 Daily Gobble
        </div>
        <h2 className="mb-2 text-2xl font-bold text-roost-800 dark:text-roost-100">{dailyTopic.title}</h2>
        <p className="mb-6 text-roost-500">{dailyTopic.description}</p>

        <div className="mb-6">
          <label className="mb-2 block text-sm font-semibold text-roost-700 dark:text-roost-300">Choose your challenge level</label>
          <div className="flex justify-center gap-2 flex-wrap">
            {DIFFICULTIES.map((d) => (
              <button
                key={d.key}
                onClick={() => setSelectedDifficulty(d.key)}
                className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all
                  ${selectedDifficulty === d.key
                    ? "bg-gradient-to-r from-gobbl-500 to-gobbl-600 text-white shadow-md"
                    : "bg-roost-100 text-roost-600 hover:bg-roost-200 dark:bg-roost-800 dark:text-roost-300"
                  }`}
              >
                <div>{d.label}</div>
                <div className="text-xs opacity-75">{d.description}</div>
              </button>
            ))}
          </div>
        </div>

        <Button size="lg" onClick={() => startDebate(topicParam, true)} disabled={loading}>
          {loading ? "Hatching..." : "🦃 Let's Talk Turkey"}
        </Button>
      </div>
    );
  }

  const filteredTopics = selectedCategory
    ? TOPICS.filter((t) => t.category === selectedCategory)
    : TOPICS;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-roost-900 dark:text-roost-50">
          🦃 The Arena
        </h1>
        <p className="text-roost-500">Pick a topic, choose your challenge level, and strut your stuff</p>
      </div>

      <div className="mb-6">
        <label className="mb-2 block text-sm font-semibold text-roost-700 dark:text-roost-300">Challenge Level</label>
        <div className="flex flex-wrap gap-2">
          {DIFFICULTIES.map((d) => (
            <button
              key={d.key}
              onClick={() => setSelectedDifficulty(d.key)}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-all
                ${selectedDifficulty === d.key
                  ? "bg-gradient-to-r from-gobbl-500 to-gobbl-600 text-white shadow-md"
                  : "bg-roost-100 text-roost-600 hover:bg-roost-200 dark:bg-roost-800 dark:text-roost-300"
                }`}
            >
              {d.label}
              {d.key === "Full Gobble" && " (1.5x 🪶)"}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="mb-2 block text-sm font-semibold text-roost-700 dark:text-roost-300">Category</label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`rounded-xl px-3 py-1.5 text-sm font-medium transition-all
              ${!selectedCategory
                ? "bg-gobbl-600 text-white"
                : "bg-roost-100 text-roost-600 hover:bg-roost-200 dark:bg-roost-800 dark:text-roost-300"
              }`}
          >
            All Topics
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-3 py-1.5 text-sm font-medium transition-all
                ${selectedCategory === cat
                  ? "bg-gobbl-600 text-white"
                  : "bg-roost-100 text-roost-600 hover:bg-roost-200 dark:bg-roost-800 dark:text-roost-300"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTopics.map((topic) => (
          <Card key={topic.id} hover className="group" onClick={() => startDebate(topic.id)}>
            <div className="mb-2 text-xs font-bold uppercase tracking-wide text-gobbl-600">
              {topic.category}
            </div>
            <h3 className="mb-1 font-bold text-roost-800 dark:text-roost-100">{topic.title}</h3>
            <p className="mb-4 text-sm text-roost-500 leading-relaxed">{topic.description}</p>
            <Button size="sm" disabled={loading} className="group-hover:shadow-md">
              {loading ? "Starting..." : "Let's Talk Turkey"}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function ArenaPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="text-4xl animate-wiggle inline-block">🥚</span>
      </div>
    }>
      <ArenaContent />
    </Suspense>
  );
}
