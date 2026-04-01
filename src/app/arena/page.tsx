"use client";

import { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { TOPICS, CATEGORIES } from "@/lib/topics";

function ArenaContent() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const isDaily = searchParams.get("daily") === "true";

  useEffect(() => {
    if (isDaily) {
      router.replace("/arena/setup?daily=true");
    }
  }, [isDaily, router]);

  if (status === "unauthenticated") {
    router.push("/");
    return null;
  }

  if (isDaily) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="text-4xl animate-wiggle inline-block">🥚</span>
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
          The Arena
        </h1>
        <p className="text-roost-500">Pick a topic — then choose challenge level and who you&apos;re talking to</p>
      </div>

      <div className="mb-6">
        <label className="mb-2 block text-sm font-semibold text-roost-700 dark:text-roost-300">Category</label>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
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
              type="button"
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
          <Card
            key={topic.id}
            hover
            className="group"
            onClick={() => router.push(`/arena/setup?topic=${topic.id}`)}
          >
            <div className="mb-2 text-xs font-bold uppercase tracking-wide text-gobbl-600">
              {topic.category}
            </div>
            <h3 className="mb-1 font-bold text-roost-800 dark:text-roost-100">{topic.title}</h3>
            <p className="mb-4 text-sm text-roost-500 leading-relaxed">{topic.description}</p>
            <Button size="sm" className="group-hover:shadow-md">
              Choose topic
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
