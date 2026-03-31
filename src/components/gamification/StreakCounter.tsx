"use client";

interface StreakCounterProps {
  current: number;
  longest: number;
}

export function StreakCounter({ current, longest }: StreakCounterProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5">
        <div className="relative">
          <span className="text-2xl">🪶</span>
          {current >= 3 && (
            <span className="absolute -top-1 -right-1 text-xs">✨</span>
          )}
        </div>
        <div>
          <div className="text-xl font-bold text-roost-800 dark:text-roost-100">{current}</div>
          <div className="text-xs text-roost-500">Migration</div>
        </div>
      </div>
      <div className="h-8 w-px bg-roost-200 dark:bg-roost-700" />
      <div>
        <div className="text-sm font-semibold text-roost-600 dark:text-roost-400">{longest}</div>
        <div className="text-xs text-roost-500">Best</div>
      </div>
    </div>
  );
}
