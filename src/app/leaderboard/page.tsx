"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { RankingTable, RankEntry } from "@/components/leaderboard/RankingTable";

const SORT_OPTIONS = [
  { key: "xp", label: "XP", icon: "⭐" },
  { key: "civility", label: "Civility", icon: "🎯" },
  { key: "streak", label: "Migration", icon: "🦅" },
];

export default function LeaderboardPage() {
  const { status } = useSession();
  const router = useRouter();
  const [sortBy, setSortBy] = useState("xp");
  const [data, setData] = useState<RankEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
      return;
    }
    if (status === "authenticated") {
      setLoading(true);
      fetch(`/api/leaderboard?sort=${sortBy}`)
        .then((r) => r.json())
        .then(setData)
        .finally(() => setLoading(false));
    }
  }, [status, sortBy, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="text-4xl animate-wiggle inline-block">🥚</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-roost-900 dark:text-roost-50">
          🏆 The Flock
        </h1>
        <p className="text-roost-500">See who&apos;s strutting their stuff in civil discourse</p>
      </div>

      <div className="mb-6 flex justify-center gap-2">
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setSortBy(opt.key)}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-all
              ${sortBy === opt.key
                ? "bg-gradient-to-r from-gobbl-500 to-gobbl-600 text-white shadow-md"
                : "bg-roost-100 text-roost-600 hover:bg-roost-200 dark:bg-roost-800 dark:text-roost-300"
              }`}
          >
            <span>{opt.icon}</span>
            {opt.label}
          </button>
        ))}
      </div>

      <Card>
        {loading ? (
          <div className="flex justify-center py-12">
            <span className="text-4xl animate-wiggle inline-block">🥚</span>
          </div>
        ) : (
          <RankingTable data={data} sortBy={sortBy} />
        )}
      </Card>
    </div>
  );
}
