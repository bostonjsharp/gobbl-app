"use client";

interface StreakCounterProps {
  current: number;
  longest: number;
}

/**
 * Streak counter — Harvest direction.
 * Two values side-by-side, ochre primary value, muted "best" value.
 */
export function StreakCounter({ current, longest }: StreakCounterProps) {
  return (
    <div className="flex items-center gap-4">
      <div>
        <div className="flex items-baseline gap-1">
          <span className="font-display text-2xl font-bold text-primary tracking-tight num-tabular">
            {current}
          </span>
          <span className="font-mono text-[10px] text-ink-muted">day</span>
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-muted">
          Streak
        </div>
      </div>
      <div className="h-8 w-px bg-line" />
      <div>
        <div className="font-display text-sm font-semibold text-ink-soft num-tabular">
          {longest}
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-muted">
          Best
        </div>
      </div>
    </div>
  );
}
