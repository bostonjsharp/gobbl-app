"use client";

import { BADGES } from "@/lib/gamification";

interface BadgeGridProps {
  earnedBadges: string[];
  compact?: boolean;
}

export function BadgeGrid({ earnedBadges, compact = false }: BadgeGridProps) {
  return (
    <div className={`grid gap-3 ${compact ? "grid-cols-4" : "grid-cols-2 sm:grid-cols-4"}`}>
      {BADGES.map((badge) => {
        const earned = earnedBadges.includes(badge.key);
        return (
          <div
            key={badge.key}
            className={`flex flex-col items-center rounded-2xl p-3 text-center transition-all duration-300
              ${earned
                ? "bg-gradient-to-br from-gobbl-50 to-golden-50 border-2 border-gobbl-300 dark:from-gobbl-900/30 dark:to-golden-900/20 dark:border-gobbl-700 shadow-sm animate-scale-in"
                : "bg-roost-100 border-2 border-roost-200 opacity-40 grayscale dark:bg-roost-800 dark:border-roost-700"
              }`}
            title={badge.description}
          >
            <span className={`${compact ? "text-2xl" : "text-3xl"} mb-1 ${earned ? "" : "grayscale"}`}>{badge.icon}</span>
            {!compact && (
              <>
                <span className="text-xs font-bold text-roost-700 dark:text-roost-300">
                  {badge.name}
                </span>
                <span className="text-[10px] text-roost-500 dark:text-roost-400 leading-tight mt-0.5">
                  {badge.description}
                </span>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
