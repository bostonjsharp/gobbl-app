"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { XPBar } from "@/components/gamification/XPBar";
import { BadgeGrid } from "@/components/gamification/BadgeGrid";
import { StreakCounter } from "@/components/gamification/StreakCounter";
import { TurkeyAvatarWithLabel } from "@/components/gamification/TurkeyAvatar";
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
  badges: string[];
  recentDebates: {
    id: string;
    topic: string;
    score: number | null;
    xpEarned: number;
    feathersEarned: number;
    completedAt: string;
    difficulty: string;
  }[];
  createdAt: string;
}

export default function ProfilePage() {
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

  const totalDebates = userData.recentDebates.length;
  const civilDebates = userData.recentDebates.filter((d) => d.score != null && d.score >= 7).length;
  const winRate = totalDebates > 0 ? Math.round((civilDebates / totalDebates) * 100) : 0;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Card className="mb-6 bg-gradient-to-br from-white to-gobbl-50/30 dark:from-roost-900 dark:to-gobbl-950/20">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <TurkeyAvatarWithLabel level={userData.level} size="lg" equipped={userData.equippedCosmetics} />
          <div className="flex-1 w-full text-center sm:text-left">
            <h1 className="text-2xl font-bold text-roost-900 dark:text-roost-50">
              {userData.username}
            </h1>
            <p className="text-sm text-roost-500 mb-3">
              Roosting since {new Date(userData.createdAt).toLocaleDateString()}
            </p>
            <XPBar
              current={userData.levelInfo.xpProgress}
              max={userData.levelInfo.xpForNext}
              level={userData.level}
              levelName={userData.levelInfo.name}
            />
          </div>
        </div>
      </Card>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="min-h-[5.5rem] flex flex-col justify-center">
          <div className="text-center px-1">
            <div className="text-2xl font-bold text-golden-600 dark:text-golden-400">
              {userData.featherBalance.toLocaleString()}
            </div>
            <div className="text-xs text-roost-500 flex items-center justify-center gap-1">🪶 Feathers </div>
          </div>
        </Card>
        <Card className="min-h-[5.5rem] flex flex-col justify-center">
          <div className="text-center px-1">
            <div className="text-2xl font-bold text-roost-800 dark:text-roost-100">{totalDebates}</div>
            <div className="text-xs text-roost-500">Total Debates</div>
          </div>
        </Card>
        <Card className="min-h-[5.5rem] flex flex-col justify-center">
          <div className="text-center px-1">
            <div className={`text-2xl font-bold ${winRate >= 70 ? "text-emerald-500" : "text-golden-600"}`}>
              {winRate}%
            </div>
            <div className="text-xs text-roost-500">Civil Rate (7+)</div>
          </div>
        </Card>
        <Card className="min-h-[5.5rem] flex flex-col justify-center">
          <div className="flex h-full min-h-[4.5rem] items-center justify-center px-1">
            <StreakCounter current={userData.currentStreak} longest={userData.longestStreak} />
          </div>
        </Card>
      </div>

      <Card className="mb-6">
        <h3 className="mb-4 text-lg font-bold text-roost-700 dark:text-roost-300 flex items-center gap-2">
          <span>🏆</span> Trophy Roost
        </h3>
        <BadgeGrid earnedBadges={userData.badges} />
      </Card>

      {userData.civilityScore > 0 && (
        <Card>
          <h3 className="mb-3 text-lg font-bold text-roost-700 dark:text-roost-300">
            Civility Reputation
          </h3>
          <div className="flex items-center gap-4">
            <div
              className={`text-4xl font-bold ${
                userData.civilityScore >= 0.8
                  ? "text-emerald-500"
                  : userData.civilityScore >= 0.6
                    ? "text-golden-600"
                    : "text-plume-500"
              }`}
            >
              {(userData.civilityScore * 10).toFixed(0)}
            </div>
            <div>
              <div className="text-sm font-medium text-roost-700 dark:text-roost-300">out of 100</div>
              <div className="text-xs text-roost-500">Rolling average of recent debates</div>
            </div>
            <div className="ml-auto">
              <div className="h-3.5 w-32 overflow-hidden rounded-full bg-roost-200 dark:bg-roost-700">
                <div
                  className={`h-full rounded-full transition-all ${
                    userData.civilityScore >= 0.8
                      ? "bg-emerald-500"
                      : userData.civilityScore >= 0.6
                        ? "bg-golden-500"
                        : "bg-plume-500"
                  }`}
                  style={{ width: `${userData.civilityScore * 100}%` }}
                />
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
