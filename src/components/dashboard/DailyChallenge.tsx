"use client";

import Link from "next/link";
import { Button } from "../ui/Button";

interface DailyChallengeProps {
  topic: {
    id: string;
    title: string;
    description: string;
    category: string;
  };
  completed?: boolean;
}

export function DailyChallenge({ topic, completed = false }: DailyChallengeProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-golden-400 bg-gradient-to-br from-golden-50 via-gobbl-50 to-roost-50 p-6 dark:border-golden-700 dark:from-golden-900/20 dark:via-gobbl-900/10 dark:to-roost-900">
      <div className="absolute right-4 top-4 rounded-full bg-golden-200 px-3 py-1 text-xs font-bold text-golden-800 dark:bg-golden-800 dark:text-golden-200 flex items-center gap-1">
        <span>{completed ? "✅" : "🌅"}</span> Daily Gobble
      </div>
      <div className="absolute -right-4 -bottom-4 text-8xl opacity-10 rotate-12 select-none">
        🦃
      </div>
      <div className="mb-1 text-sm font-semibold text-gobbl-600 dark:text-gobbl-400">
        {topic.category}
      </div>
      <h3 className="mb-1 text-lg font-bold text-roost-800 dark:text-roost-100">
        {topic.title}
      </h3>
      <p className="mb-4 text-sm text-roost-600 dark:text-roost-400">{topic.description}</p>

      {completed ? (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 dark:bg-emerald-900/20">
          <span className="text-lg">🪶</span>
          <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
            Today&apos;s challenge complete! Come back tomorrow for a fresh topic.
          </span>
        </div>
      ) : (
        <Link href="/arena/setup?daily=true">
          <Button size="sm">
            Accept Challenge (+25 XP & +30 🪶)
          </Button>
        </Link>
      )}
    </div>
  );
}
