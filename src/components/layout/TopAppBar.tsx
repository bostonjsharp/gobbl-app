"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { FlatTurkeyGlyph } from "@/components/gamification/FlatTurkey";

/**
 * Top app bar — Harvest direction.
 *
 * Layout: [avatar + greeting] · [feather pill]
 *   - Avatar links to /profile
 *   - Greeting uses a "Day · Hi, $username" two-line stack (eyebrow mono + body semibold)
 *   - Feather chip is a rounded-full surface with the ochre feather glyph + monospaced count
 *
 * No huge centered "Gobbl" logo anymore — branding lives in the URL bar / OS chrome.
 * The page-level <h1> ("Ready to talk turkey?") carries the brand voice instead.
 */

interface UserSummary {
  username: string;
  level: number;
  featherBalance: number;
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function TopAppBar() {
  const { status, data: session } = useSession();
  const [user, setUser] = useState<UserSummary | null>(null);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/user")
      .then((r) => r.json())
      .then((data) =>
        setUser({
          username: data.username,
          level: data.level,
          featherBalance: data.featherBalance,
        }),
      )
      .catch(() => {});
  }, [status]);

  const day = DAY_LABELS[new Date().getDay()];
  const initial = (user?.username ?? session?.user?.name ?? "S")[0]?.toUpperCase() ?? "S";

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between bg-bg px-5 pb-3 pt-3">
      <Link href="/profile" className="group flex items-center gap-2.5">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-display text-base font-bold text-white shadow-soft transition-transform group-active:scale-95">
          {initial}
        </div>
        <div className="leading-tight">
          <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-muted">{day}</div>
          <div className="font-body text-sm font-semibold text-ink">
            Hey, {user?.username ?? "friend"}
          </div>
        </div>
      </Link>

      <Link
        href="/shop"
        className="flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 transition-colors hover:border-ink-muted"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M21 3c-7 0-11 5-12 9-1 4 0 8 0 9h2c0-3 1-7 3-10s5-5 7-8z"
            fill="rgb(228 165 71)"
          />
        </svg>
        <span className="font-mono text-[13px] font-semibold text-ink num-tabular">
          {(user?.featherBalance ?? 0).toLocaleString()}
        </span>
      </Link>
    </header>
  );
}
