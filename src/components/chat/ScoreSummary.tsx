"use client";

import { useState, useEffect } from "react";
import { DIMENSION_LABELS } from "@/lib/civility";
import { BADGES, LEVELS } from "@/lib/gamification";
import { FinishResult } from "./ChatInterface";
import { Button } from "../ui/Button";
import { TurkeyAvatar } from "../gamification/TurkeyAvatar";
import Link from "next/link";

interface ScoreSummaryProps {
  result: FinishResult;
}

function LevelUpOverlay({
  previousLevel,
  newLevel,
  onDismiss,
}: {
  previousLevel: number;
  newLevel: number;
  onDismiss: () => void;
}) {
  const [phase, setPhase] = useState<"old" | "morphing" | "new">("old");
  const oldStage = LEVELS.find((l) => l.level === previousLevel);
  const newStage = LEVELS.find((l) => l.level === newLevel);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("morphing"), 800);
    const t2 = setTimeout(() => setPhase("new"), 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative mx-4 max-w-sm w-full rounded-3xl bg-gradient-to-br from-golden-50 via-gobbl-50 to-plume-50 p-8 text-center shadow-2xl dark:from-golden-900/40 dark:via-gobbl-900/30 dark:to-plume-900/30 dark:border dark:border-golden-700">
        {/* Sparkle particles */}
        {phase !== "old" && (
          <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
            {Array.from({ length: 12 }).map((_, i) => (
              <span
                key={i}
                className="absolute text-lg"
                style={{
                  left: `${15 + Math.random() * 70}%`,
                  top: `${20 + Math.random() * 50}%`,
                  animation: `sparkleFloat ${1.2 + Math.random() * 0.8}s ease-out ${i * 0.1}s forwards`,
                }}
              >
                {["✨", "🪶", "⭐", "💫"][i % 4]}
              </span>
            ))}
          </div>
        )}

        <div className="mb-2 text-sm font-bold uppercase tracking-widest text-golden-600 dark:text-golden-400">
          Evolution!
        </div>

        <div className="relative mx-auto mb-4 flex items-center justify-center gap-4">
          {phase === "old" && (
            <div className="animate-scale-in">
              <TurkeyAvatar level={previousLevel} size="lg" animate={false} />
              <div className="mt-2 text-sm font-semibold text-roost-600 dark:text-roost-400">
                {oldStage?.name}
              </div>
            </div>
          )}

          {phase === "morphing" && (
            <div
              className="relative"
              style={{ animation: "levelUpGlow 1.2s ease-out forwards" }}
            >
              <div style={{ animation: "levelUpPulse 1.2s ease-in-out" }}>
                <TurkeyAvatar level={previousLevel} size="lg" animate={false} />
              </div>
            </div>
          )}

          {phase === "new" && (
            <div>
              <div style={{ animation: "morphIn 0.8s cubic-bezier(0.34,1.56,0.64,1) forwards" }}>
                <TurkeyAvatar level={newLevel} size="xl" />
              </div>
              <div className="mt-3 text-xl font-extrabold text-gradient-gobbl">
                {newStage?.name}
              </div>
              <div className="text-sm text-roost-500 mt-1">
                {newStage?.description}
              </div>
            </div>
          )}
        </div>

        {phase === "new" && (
          <div className="animate-slide-up mt-4">
            <p className="mb-4 text-sm text-roost-600 dark:text-roost-400">
              Your turkey evolved from <strong>{oldStage?.name}</strong> to <strong>{newStage?.name}</strong>!
            </p>
            <Button onClick={onDismiss}>
              Continue
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export function ScoreSummary({ result }: ScoreSummaryProps) {
  const isGreat = result.overallScore >= 7;
  const didLevelUp = result.previousLevel !== undefined && result.newLevel > result.previousLevel;
  const [showLevelUp, setShowLevelUp] = useState(didLevelUp);

  const scoreColor =
    result.overallScore >= 8
      ? "text-emerald-500"
      : result.overallScore >= 6
        ? "text-golden-500"
        : "text-plume-500";

  if (showLevelUp) {
    return (
      <LevelUpOverlay
        previousLevel={result.previousLevel}
        newLevel={result.newLevel}
        onDismiss={() => setShowLevelUp(false)}
      />
    );
  }

  return (
    <div className="mx-auto max-w-2xl animate-fade-in space-y-6 p-6">
      <div className="text-center">
        <div className="mb-4 relative inline-block">
          <TurkeyAvatar level={result.newLevel} size="lg" />
          {isGreat && (
            <div className="absolute -top-2 -right-2 animate-bounce-in">
              <span className="text-2xl">✨</span>
            </div>
          )}
        </div>
        <h2 className="mb-2 text-2xl font-bold text-roost-800 dark:text-roost-100">
          {isGreat ? "Gobble Gobble! Great Discussion!" : "Good effort! Keep strutting!"}
        </h2>
        <div className={`text-5xl font-bold ${scoreColor}`}>
          {result.overallScore.toFixed(1)}
        </div>
        <p className="text-sm text-roost-500 mt-1">Overall Civility Score</p>

        {isGreat && (
          <div className="mt-3 flex justify-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className="inline-block animate-feather-fall text-lg"
                style={{ animationDelay: `${i * 200}ms`, animationDuration: `${1.5 + i * 0.3}s` }}
              >
                🪶
              </span>
            ))}
          </div>
        )}

        {didLevelUp && (
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-golden-100 px-4 py-1.5 text-sm font-bold text-golden-700 dark:bg-golden-900/30 dark:text-golden-400 animate-bounce-in">
            <span>🎉</span> Evolved to {LEVELS.find((l) => l.level === result.newLevel)?.name}!
          </div>
        )}
      </div>

      {result.dimensions && (
        <div className="rounded-2xl border border-roost-200 bg-white p-5 dark:border-roost-800 dark:bg-roost-900">
          <h3 className="mb-4 font-bold text-roost-700 dark:text-roost-300">
            Civility breakdown
          </h3>
          <div className="space-y-3">
            {Object.entries(result.dimensions).map(([key, value]) => {
              const label = DIMENSION_LABELS[key as keyof typeof DIMENSION_LABELS] || key;
              const pct = (value / 10) * 100;
              return (
                <div key={key}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-roost-600 dark:text-roost-400">{label}</span>
                    <span className="font-semibold text-roost-800 dark:text-roost-200">
                      {value.toFixed(1)}
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-roost-200 dark:bg-roost-700">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-gobbl-400 via-golden-400 to-gobbl-500 transition-all duration-1000"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-roost-200 bg-white p-5 dark:border-roost-800 dark:bg-roost-900">
        <h3 className="mb-3 font-bold text-roost-700 dark:text-roost-300 flex items-center gap-2">
          <span>⭐</span> XP earned
        </h3>
        <p className="mb-3 text-xs text-roost-500">
          Based on civility, difficulty, daily challenge, and streak — levels up your turkey.
        </p>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex justify-between">
            <span className="text-roost-500">Base XP</span>
            <span className="font-medium">+{result.xp.base}</span>
          </div>
          {result.xp.difficultyBonus > 0 && (
            <div className="flex justify-between">
              <span className="text-roost-500">Difficulty bonus</span>
              <span className="font-medium text-plume-500">+{result.xp.difficultyBonus}</span>
            </div>
          )}
          {result.xp.dailyBonus > 0 && (
            <div className="flex justify-between">
              <span className="text-roost-500">Daily Gobble</span>
              <span className="font-medium text-golden-600">+{result.xp.dailyBonus}</span>
            </div>
          )}
          {result.xp.streakMultiplier > 1 && (
            <div className="flex justify-between">
              <span className="text-roost-500">Migration bonus</span>
              <span className="font-medium text-gobbl-600">x{result.xp.streakMultiplier.toFixed(1)}</span>
            </div>
          )}
          <div className="col-span-2 border-t border-roost-200 pt-2 dark:border-roost-700">
            <div className="flex justify-between text-base font-bold">
              <span>Total XP</span>
              <span className="text-gobbl-600 flex items-center gap-1">+{result.xp.total}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-roost-200 bg-white p-5 dark:border-roost-800 dark:bg-roost-900">
        <h3 className="mb-3 font-bold text-roost-700 dark:text-roost-300 flex items-center gap-2">
          <span>🪶</span> Feathers earned
        </h3>
        <p className="mb-3 text-xs text-roost-500">
          Based on how much you participated (messages), difficulty, and daily — spend in the Bazaar.
        </p>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex justify-between">
            <span className="text-roost-500">Engagement (messages)</span>
            <span className="font-medium">+{result.feathers.base}</span>
          </div>
          {result.feathers.difficultyBonus !== 0 && (
            <div className="flex justify-between">
              <span className="text-roost-500">Difficulty</span>
              <span className="font-medium text-plume-500">+{result.feathers.difficultyBonus}</span>
            </div>
          )}
          {result.feathers.dailyBonus > 0 && (
            <div className="flex justify-between">
              <span className="text-roost-500">Daily Gobble</span>
              <span className="font-medium text-golden-600">+{result.feathers.dailyBonus}</span>
            </div>
          )}
          <div className="col-span-2 border-t border-roost-200 pt-2 dark:border-roost-700">
            <div className="flex justify-between text-base font-bold">
              <span>Total feathers</span>
              <span className="text-gobbl-600 flex items-center gap-1">🪶 +{result.feathers.total}</span>
            </div>
          </div>
        </div>
      </div>

      {result.newBadges.length > 0 && (
        <div className="rounded-2xl border-2 border-golden-400 bg-gradient-to-br from-golden-50 to-gobbl-50 p-5 dark:border-golden-700 dark:from-golden-900/20 dark:to-gobbl-900/20">
          <h3 className="mb-3 text-center font-bold text-golden-700 dark:text-golden-400">
            New Badges Hatched!
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {result.newBadges.map((key) => {
              const badge = BADGES.find((b) => b.key === key);
              if (!badge) return null;
              return (
                <div key={key} className="flex flex-col items-center animate-hatch">
                  <span className="text-4xl mb-1">{badge.icon}</span>
                  <span className="text-sm font-bold text-roost-700 dark:text-roost-300">{badge.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex justify-center gap-3 pt-2">
        <Link href="/arena">
          <Button>Let&apos;s Talk Turkey Again</Button>
        </Link>
        <Link href="/dashboard">
          <Button variant="secondary">Back to Roost</Button>
        </Link>
      </div>
    </div>
  );
}
