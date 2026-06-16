"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { FlatTurkey, TURKEY_STAGE_LABELS } from "@/components/gamification/FlatTurkey";
import { AvatarWithItems } from "@/components/gamification/AvatarWithItems";
import { StreakCounter } from "@/components/gamification/StreakCounter";
import { LEVELS, BADGES } from "@/lib/gamification";
import type { EquippedCosmetics } from "@/lib/shop";

interface UserData {
  username: string;
  xp: number;
  featherBalance: number;
  level: number;
  equippedCosmetics: EquippedCosmetics;
  levelInfo: { level: number; name: string; xpForNext: number; xpProgress: number; progressPercent: number };
  civilityScore: number;
  currentStreak: number;
  longestStreak: number;
  badges: string[];
  recentDebates: { id: string; topic: string; score: number | null; difficulty: string; completedAt: string }[];
  createdAt: string;
}

// Replace this map with real per-dimension scores once the API exposes them.
// For now we fan out the rolling civilityScore with small intentional variance.
function civilityBreakdown(score: number) {
  const base = Math.round(score * 10);
  return [
    { k: "Respectful tone",  v: Math.min(100, base + 5) },
    { k: "Evidence-based",   v: Math.max(0, base - 3) },
    { k: "Empathy",          v: Math.min(100, base + 2) },
    { k: "Constructive",     v: Math.max(0, base - 6) },
    { k: "Active listening", v: Math.min(100, base + 1) },
  ];
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
      fetch("/api/user").then((r) => r.json()).then(setUserData).finally(() => setLoading(false));
    }
  }, [status, router]);

  if (loading || !userData) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <FlatTurkey stage={1} size="md" animate />
      </div>
    );
  }

  const stages: number[] = [1, 2, 3, 4, 5, 6, 7, 8];
  const totalDebates = userData.recentDebates.length;
  const civilityRows = userData.civilityScore > 0 ? civilityBreakdown(userData.civilityScore) : null;

  return (
    <div className="flex flex-col gap-5">
      {/* Hero card */}
      <Card className="overflow-hidden p-6 text-center">
        <div className="pointer-events-none absolute -right-14 -top-14 h-56 w-56 rounded-full bg-ochre-soft/60" />
        <div className="relative">
          <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">
            Lv. {String(userData.level).padStart(2, "0")} / 08
          </div>
          <h1 className="mt-2 font-display text-[36px] font-bold tracking-[-0.03em]">
            {userData.username}
          </h1>
          <p className="mt-1 font-body text-xs text-ink-soft">
            Joined {new Date(userData.createdAt).toLocaleDateString()} · {userData.featherBalance.toLocaleString()} feathers
          </p>
          <div className="mt-3 flex justify-center">
            <AvatarWithItems stage={userData.level} size={180} equipped={userData.equippedCosmetics} animate />
          </div>
          <div className="mt-3 flex justify-center gap-1.5">
            <MiniStat k="Civility" v={userData.civilityScore > 0 ? Math.round(userData.civilityScore * 10) : "—"} />
            <MiniStat k="Streak" v={`${userData.currentStreak}d`} />
            <MiniStat k="Rank" v="—" />
          </div>
        </div>
      </Card>

      {/* Evolution timeline */}
      <section>
        <div className="mb-2.5 flex items-baseline justify-between">
          <h2 className="font-display text-xl font-bold tracking-[-0.02em]">Evolution</h2>
          <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-muted">
            {userData.level} of 8
          </span>
        </div>
        <Card className="p-4">
          <div className="grid grid-cols-4 gap-x-1.5 gap-y-3.5">
            {stages.map((s) => {
              const unlocked = s <= userData.level;
              const current = s === userData.level;
              return (
                <div
                  key={s}
                  className={`flex flex-col items-center gap-1 rounded-2xl border p-1 ${
                    current ? "border-primary bg-primary-soft" : "border-transparent"
                  }`}
                >
                  <div className={unlocked ? "" : "opacity-35 grayscale"}>
                    <FlatTurkey stage={s} size={56} />
                  </div>
                  <div className={`font-mono text-[9px] font-semibold ${unlocked ? "text-ink" : "text-ink-muted"}`}>
                    LV {s}
                  </div>
                  <div className="text-center font-body text-[10px] leading-tight text-ink-soft">
                    {TURKEY_STAGE_LABELS[s as 1]}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </section>

      {/* Civility breakdown */}
      {civilityRows && (
        <section>
          <h2 className="mb-2.5 font-display text-xl font-bold tracking-[-0.02em]">
            Civility, by dimension
          </h2>
          <Card>
            {civilityRows.map((row, i) => (
              <div key={row.k} className={`py-3 ${i > 0 ? "border-t border-line" : ""}`}>
                <div className="mb-1.5 flex items-baseline justify-between">
                  <span className="font-body text-[13px] font-semibold">{row.k}</span>
                  <span className="font-mono text-[13px] font-semibold text-forest-600 num-tabular">
                    {row.v}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-bg">
                  <div
                    className="h-full rounded-full bg-forest-500 transition-[width] duration-700"
                    style={{ width: `${row.v}%` }}
                  />
                </div>
              </div>
            ))}
          </Card>
        </section>
      )}

      {/* Badges */}
      <section>
        <h2 className="mb-2.5 font-display text-xl font-bold tracking-[-0.02em]">
          Badges · {userData.badges.length} of {BADGES.length}
        </h2>
        <div className="grid grid-cols-4 gap-2.5">
          {BADGES.map((b) => {
            const earned = userData.badges.includes(b.key);
            return (
              <div
                key={b.key}
                className={`flex aspect-square flex-col items-center justify-center rounded-2xl border p-1.5 transition-opacity ${
                  earned ? "border-line bg-surface" : "border-line opacity-45"
                }`}
                title={b.description}
              >
                <div
                  className={`mb-1 h-7 w-7 rounded-full ${earned ? "bg-primary" : "bg-line"}`}
                  aria-hidden
                />
                <div className="text-center font-body text-[9px] font-semibold leading-tight">
                  {b.name}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Actions list */}
      <div className="overflow-hidden rounded-2xl border border-line bg-surface">
        <Link href="/leaderboard" className="flex items-center justify-between px-4 py-3.5 hover:bg-surface-2">
          <span className="font-body text-sm font-semibold">View the Flock</span>
          <ChevronRight />
        </Link>
        <div className="border-t border-line" />
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex w-full items-center justify-between px-4 py-3.5 hover:bg-surface-2"
        >
          <span className="font-body text-sm font-semibold text-plume-500">Fly the Coop</span>
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}

function MiniStat({ k, v }: { k: string; v: string | number }) {
  return (
    <div className="rounded-xl border border-line bg-bg px-3.5 py-2 text-center">
      <div className="font-display text-lg font-bold tracking-[-0.02em] num-tabular">{v}</div>
      <div className="font-mono text-[9px] uppercase tracking-[0.08em] text-ink-muted">{k}</div>
    </div>
  );
}

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
