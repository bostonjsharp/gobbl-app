"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
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
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-roost-900 dark:text-roost-50">
            Ready to talk turkey, {userData.username}?
          </h1>
          <p className="text-roost-500">
            Your flock is waiting. Let&apos;s practice some civil discourse.{" "}
            <Link href="/shop" className="font-medium text-gobbl-600 underline-offset-2 hover:underline dark:text-gobbl-400">
              Visit the Bazaar
            </Link>{" "}
            to dress your turkey.
          </p>
        </div>
        <Link href="/arena">
          <Button size="lg">🦃 Let&apos;s Talk Turkey</Button>
        </Link>
      </div>

      <div className="mb-8 flex flex-col sm:flex-row items-center gap-6 rounded-2xl border border-roost-200 bg-gradient-to-r from-white to-gobbl-50/50 p-6 dark:border-roost-800 dark:from-roost-900 dark:to-gobbl-950/30">
        <TurkeyAvatarWithLabel level={userData.level} size="lg" equipped={userData.equippedCosmetics} />
        <div className="flex-1 w-full">
          <XPBar
            current={userData.levelInfo.xpProgress}
            max={userData.levelInfo.xpForNext}
            level={userData.level}
            levelName={userData.levelInfo.name}
          />
          <p className="mt-2 text-xs text-roost-500">
            {userData.levelInfo.xpForNext > 0
              ? `${userData.levelInfo.xpForNext - userData.levelInfo.xpProgress} XP until next evolution`
              : "Maximum evolution reached! You are a Thunderbird!"
            }
          </p>
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard icon="🪶" label="Feathers (spend)" value={userData.featherBalance.toLocaleString()} />
        <StatsCard
          icon="🎯"
          label="Civility Score"
          value={userData.civilityScore > 0 ? `${(userData.civilityScore * 10).toFixed(0)}/100` : "—"}
          color={
            userData.civilityScore >= 0.8
              ? "text-emerald-500"
              : userData.civilityScore >= 0.6
                ? "text-golden-600"
                : "text-roost-800 dark:text-roost-100"
          }
        />
        <StatsCard icon="💬" label="Debates" value={userData.recentDebates.length} />
        <div className="rounded-2xl border border-roost-200 bg-white p-4 dark:border-roost-800 dark:bg-roost-900">
          <StreakCounter current={userData.currentStreak} longest={userData.longestStreak} />
        </div>
      </div>

      <div className="mb-6">
        <DailyChallenge topic={dailyTopic} completed={userData.dailyCompleted} />
      </div>

      {userData.recentDebates.length > 0 && (
        <Card>
          <h3 className="mb-4 font-bold text-roost-700 dark:text-roost-300 flex items-center gap-2">
            <span>📜</span> Recent Discussions
          </h3>
          <div className="space-y-3">
            {userData.recentDebates.map((debate) => (
              <Link
                key={debate.id}
                href={`/arena/${debate.id}`}
                className="flex items-center justify-between rounded-xl bg-roost-50 px-4 py-3 dark:bg-roost-800/50 transition-colors hover:bg-roost-100 dark:hover:bg-roost-800"
              >
                <div className="min-w-0 flex-1 pr-3">
                  <div className="font-medium text-roost-800 dark:text-roost-100 truncate">{debate.topic}</div>
                </div>
                {debate.score != null && (
                  <div
                    className={`shrink-0 text-lg font-bold tabular-nums ${debate.score >= 7 ? "text-emerald-500" : debate.score >= 5 ? "text-golden-600" : "text-plume-500"}`}
                  >
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
