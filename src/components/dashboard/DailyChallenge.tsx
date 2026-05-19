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
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-golden-100 via-roost-50 to-roost-100 p-lg">
      <div className="absolute right-md top-md rounded-full bg-golden-500 px-3 py-1 text-xs font-bold text-roost-700 flex items-center gap-1">
        <span>{completed ? "✅" : "🌅"}</span> Daily Gobble
      </div>
      <div className="absolute -right-4 -bottom-4 text-8xl opacity-10 rotate-12 select-none">🦃</div>
      <div className="mb-1 font-display text-xs font-bold uppercase tracking-wider text-gobbl-500">
        {topic.category}
      </div>
      <h3 className="mb-1 font-display text-lg font-bold text-roost-700">{topic.title}</h3>
      <p className="mb-4 text-sm text-roost-500">{topic.description}</p>
      {completed ? (
        <div className="flex items-center gap-2 rounded-xl bg-roost-100 px-4 py-2.5">
          <span className="text-lg">🪶</span>
          <span className="text-sm font-semibold text-roost-700">
            Today&apos;s challenge complete! Come back tomorrow for a fresh topic.
          </span>
        </div>
      ) : (
        <Link href="/chat/setup?daily=true">
          <Button size="sm">Accept Challenge (+25 XP &amp; +30 🪶)</Button>
        </Link>
      )}
    </div>
  );
}
