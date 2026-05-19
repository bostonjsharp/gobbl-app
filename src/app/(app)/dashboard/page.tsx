"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { XPBar } from "@/components/gamification/XPBar";
import { StreakCounter } from "@/components/gamification/StreakCounter";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { DailyChallenge } from "@/components/dashboard/DailyChallenge";
import { TurkeyAvatarWithLabel } from "@/components/gamification/TurkeyAvatar";
import { getDailyTopic } from "@/lib/topics";
import type { EquippedCosmetics } from "@/lib/shop";

interface UserData {
  username: string;
  xp: number;
  featherBalance: number;
  level: number;
  equippedCosmetics: EquippedCosmetics;
  levelInfo: {
    level: number;
    name: string;
    xpForNext: number;
    xpProgress: number;
    progressPercent: number;
  };
  civilityScore: number;
  currentStreak: number;
  longestStreak: number;
  dailyCompleted: boolean;
  badges: string[];
  recentDebates: {
    id: string;
    topic: string;
    category: string;
    difficulty: string;
    score: number | null;
    xpEarned: number;
    feathersEarned: number;
    completedAt: string;
  }[];
}

export default function DashboardPage() {
  const { status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
      return;
    }
    if (status === "authenticated") {
      fetch("/api/user")
        .then((r) => r.json())
        .then(setUserData)
        .finally(() => setLoading(false));
    }
  }, [status, router]);

  if (loading || !userData) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="text-4xl animate-wiggle inline-block">🥚</span>
      </div>
    );
  }

  const dailyTopic = getDailyTopic();

  return (
    <div className="flex flex-col gap-lg">
      <div>
        <h1 className="font-display text-2xl font-bold text-roost-700">
          Ready to talk turkey, {userData.username}?
        </h1>
        <p className="text-sm text-roost-500">
          Your flock is waiting.{" "}
          <Link href="/shop" className="font-semibold text-gobbl-500 hover:underline">
            Visit the Bazaar
          </Link>{" "}
          to dress your turkey.
        </p>
      </div>

      <div className="flex items-center gap-md rounded-2xl bg-roost-100 p-md">
        <TurkeyAvatarWithLabel level={userData.level} size="lg" equipped={userData.equippedCosmetics} />
        <div className="flex-1">
          <XPBar
            current={userData.levelInfo.xpProgress}
            max={userData.levelInfo.xpForNext}
            level={userData.level}
            levelName={userData.levelInfo.name}
          />
          <p className="mt-1 text-xs text-roost-500">
            {userData.levelInfo.xpForNext > 0
              ? `${userData.levelInfo.xpForNext - userData.levelInfo.xpProgress} XP until next evolution`
              : "Maximum evolution reached! You are a Thunderbird!"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-md">
        <StatsCard icon="🪶" label="Feathers" value={userData.featherBalance.toLocaleString()} />
        <StatsCard
          icon="🎯"
          label="Civility"
          value={userData.civilityScore > 0 ? `${(userData.civilityScore * 10).toFixed(0)}/100` : "—"}
        />
        <StatsCard icon="💬" label="Debates" value={userData.recentDebates.length} />
        <div className="flex flex-col justify-center rounded-2xl bg-roost-100 p-md">
          <StreakCounter current={userData.currentStreak} longest={userData.longestStreak} />
        </div>
      </div>

      <DailyChallenge topic={dailyTopic} completed={userData.dailyCompleted} />

      {userData.recentDebates.length > 0 && (
        <Card>
          <h3 className="mb-md font-display font-bold text-roost-700 flex items-center gap-2">
            <span>📜</span> Recent Discussions
          </h3>
          <div className="flex flex-col gap-2">
            {userData.recentDebates.map((debate) => (
              <Link
                key={debate.id}
                href={`/chat/${debate.id}`}
                className="flex items-center justify-between rounded-xl bg-roost-100 px-md py-3 transition-colors hover:bg-roost-200"
              >
                <div className="min-w-0 flex-1 pr-3">
                  <div className="truncate font-medium text-roost-700">{debate.topic}</div>
                </div>
                {debate.score != null && (
                  <div className="shrink-0 text-lg font-bold tabular-nums text-gobbl-500">
                    {debate.score.toFixed(1)}
                  </div>
                )}
                {debate.score == null && (
                  <span className="shrink-0 text-xs text-roost-500">In progress</span>
                )}
              </Link>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
