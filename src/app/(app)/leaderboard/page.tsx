"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
    <div className="flex flex-col gap-lg">
      <div>
        <h2 className="font-display text-2xl font-bold text-roost-700">🏆 The Flock</h2>
        <p className="text-sm text-roost-500">See who&apos;s strutting their stuff in civil discourse</p>
      </div>

      <div className="flex justify-center gap-2">
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setSortBy(opt.key)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition-all ${
              sortBy === opt.key
                ? "bg-gobbl-500 text-white"
                : "bg-roost-100 text-roost-500 hover:bg-roost-200"
            }`}
          >
            <span>{opt.icon}</span>
            <span>{opt.label}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <span className="text-3xl animate-wiggle inline-block">🥚</span>
        </div>
      ) : (
        <RankingTable data={data} sortBy={sortBy} />
      )}
    </div>
  );
}
