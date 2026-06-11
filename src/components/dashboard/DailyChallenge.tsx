"use client";

import Link from "next/link";
import { FlatTurkey } from "@/components/gamification/FlatTurkey";

interface DailyChallengeProps {
  completed?: boolean;
}

export function DailyChallenge({ completed = false }: DailyChallengeProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-ink p-6 text-bg shadow-soft">
      {/* Background turkey silhouette */}
      <div className="pointer-events-none absolute -bottom-8 -right-8 opacity-20">
        <FlatTurkey stage={6} size={180} />
      </div>

      <div className="relative">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ochre">
            {completed ? "Completed today" : "Today's Gobble · Live News"}
          </span>
          <span className="font-mono text-[10px] text-bg/60">
            {completed ? "✓" : "6h left"}
          </span>
        </div>

        <h2 className="mt-2 max-w-[78%] font-display text-[22px] font-semibold leading-[1.15] tracking-[-0.02em]">
          {completed ? "Nice gobble." : "Pick today's story."}
        </h2>

        {!completed && (
          <>
            <p className="mt-2 max-w-[80%] font-body text-sm text-bg/70">
              3 real news stories to choose from — debate what&apos;s happening now.
            </p>

            <div className="mt-3.5 flex gap-1.5">
              {["Friendly Cluck", "Spirited Strut", "Full Gobble"].map((d, i) => (
                <span
                  key={d}
                  className={`rounded-full px-2.5 py-1 font-body text-[11px] font-semibold ${
                    i === 1 ? "bg-ochre text-ink" : "bg-white/10 text-bg"
                  }`}
                >
                  {d}
                </span>
              ))}
            </div>

            <Link
              href="/chat?daily=true"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-ochre px-5 py-3 font-body text-sm font-bold text-ink transition-transform active:scale-[0.98]"
            >
              Choose a story
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M5 12h14M13 6l6 6-6 6"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <div className="mt-3 font-mono text-[10px] text-bg/55">+50 feathers · +120 XP</div>
          </>
        )}

        {completed && (
          <p className="mt-3 max-w-[80%] font-body text-sm text-bg/70">
            Nice gobble. Come back tomorrow for fresh stories.
          </p>
        )}
      </div>
    </div>
  );
}
