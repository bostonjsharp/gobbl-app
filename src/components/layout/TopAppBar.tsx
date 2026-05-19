"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { TurkeyAvatar } from "@/components/gamification/TurkeyAvatar";
import type { EquippedCosmetics } from "@/lib/shop";

const TITLES: Record<string, string> = {
  "/dashboard": "Gobbl",
  "/chat": "Chat",
  "/skills": "Skills",
  "/shop": "Shop",
  "/profile": "Profile",
  "/leaderboard": "The Flock",
};

interface UserSummary {
  level: number;
  featherBalance: number;
  equippedCosmetics: EquippedCosmetics;
}

function titleFor(pathname: string): string {
  if (TITLES[pathname]) return TITLES[pathname];
  for (const key of Object.keys(TITLES)) {
    if (pathname.startsWith(key + "/")) return TITLES[key];
  }
  return "Gobbl";
}

export function TopAppBar() {
  const pathname = usePathname();
  const { status } = useSession();
  const [user, setUser] = useState<UserSummary | null>(null);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/user")
      .then((r) => r.json())
      .then((data) =>
        setUser({
          level: data.level,
          featherBalance: data.featherBalance,
          equippedCosmetics: data.equippedCosmetics,
        }),
      )
      .catch(() => {});
  }, [status]);

  return (
    <header className="sticky top-0 z-40 flex h-[72px] items-center justify-between bg-roost-50 px-margin-mobile shadow-[0px_4px_12px_rgba(141,110,99,0.12)]">
      <Link href="/profile" className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gobbl-500/20 overflow-hidden">
        {user ? (
          <TurkeyAvatar level={user.level} size="sm" equipped={user.equippedCosmetics} animate={false} />
        ) : (
          <span className="text-xl">🥚</span>
        )}
      </Link>
      <h1 className="font-display text-2xl font-bold tracking-tight text-gobbl-500">
        {titleFor(pathname)}
      </h1>
      <Link
        href="/shop"
        className="flex items-center gap-1 rounded-full bg-roost-100 px-3 py-1.5 font-display text-sm font-semibold text-gobbl-500 transition-colors hover:bg-roost-200"
      >
        <span>{(user?.featherBalance ?? 0).toLocaleString()}</span>
        <span>🪶</span>
      </Link>
    </header>
  );
}
