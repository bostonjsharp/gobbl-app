"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { XPBar } from "@/components/gamification/XPBar";
import { BadgeGrid } from "@/components/gamification/BadgeGrid";
import { StreakCounter } from "@/components/gamification/StreakCounter";
import { TurkeyAvatarWithLabel } from "@/components/gamification/TurkeyAvatar";
import { Icon } from "@/components/ui/Icon";
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
    <div className="flex flex-col gap-lg">
      <Card className="bg-roost-100">
        <div className="flex flex-col items-center gap-md sm:flex-row sm:items-start">
          <TurkeyAvatarWithLabel level={userData.level} size="lg" equipped={userData.equippedCosmetics} />
          <div className="flex-1 w-full text-center sm:text-left">
            <h1 className="font-display text-2xl font-bold text-roost-700">{userData.username}</h1>
            <p className="mb-3 text-xs text-roost-500">
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

      <div className="grid grid-cols-2 gap-md">
        <div className="rounded-2xl bg-roost-100 p-md text-center">
          <div className="font-display text-2xl font-bold text-golden-500">
            {userData.featherBalance.toLocaleString()}
          </div>
          <div className="text-xs text-roost-500">🪶 Feathers</div>
        </div>
        <div className="rounded-2xl bg-roost-100 p-md text-center">
          <div className="font-display text-2xl font-bold text-roost-700">{totalDebates}</div>
          <div className="text-xs text-roost-500">Total Debates</div>
        </div>
        <div className="rounded-2xl bg-roost-100 p-md text-center">
          <div className="font-display text-2xl font-bold text-gobbl-500">{winRate}%</div>
          <div className="text-xs text-roost-500">Civil Rate (7+)</div>
        </div>
        <div className="flex items-center justify-center rounded-2xl bg-roost-100 p-md">
          <StreakCounter current={userData.currentStreak} longest={userData.longestStreak} />
        </div>
      </div>

      <Card>
        <h3 className="mb-md font-display font-bold text-roost-700 flex items-center gap-2">
          <span>🏆</span> Trophy Roost
        </h3>
        <BadgeGrid earnedBadges={userData.badges} />
      </Card>

      {userData.civilityScore > 0 && (
        <Card>
          <h3 className="mb-3 font-display font-bold text-roost-700">Civility Reputation</h3>
          <div className="flex items-center gap-4">
            <div className="font-display text-4xl font-bold text-gobbl-500">
              {(userData.civilityScore * 10).toFixed(0)}
            </div>
            <div>
              <div className="text-sm font-medium text-roost-700">out of 100</div>
              <div className="text-xs text-roost-500">Rolling average of recent debates</div>
            </div>
          </div>
        </Card>
      )}

      <div className="overflow-hidden rounded-2xl bg-roost-100">
        <Link
          href="/leaderboard"
          className="flex items-center justify-between px-md py-4 hover:bg-roost-200 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">🏆</span>
            <span className="font-display font-semibold text-roost-700">View the Flock</span>
          </div>
          <Icon name="chevron_right" className="text-roost-500" />
        </Link>
        <div className="border-t border-roost-200" />
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex w-full items-center justify-between px-md py-4 hover:bg-roost-200 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">🚪</span>
            <span className="font-display font-semibold text-plume-500">Fly the Coop</span>
          </div>
          <Icon name="chevron_right" className="text-roost-500" />
        </button>
      </div>
    </div>
  );
}
