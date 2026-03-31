"use client";

interface XPBarProps {
  current: number;
  max: number;
  level: number;
  levelName: string;
  showLabel?: boolean;
}

export function XPBar({ current, max, level, levelName, showLabel = true }: XPBarProps) {
  const percent = max > 0 ? Math.min(100, (current / max) * 100) : 100;

  return (
    <div className="space-y-1.5">
      {showLabel && (
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-roost-700 dark:text-roost-300">
            Lv.{level} {levelName}
          </span>
          <span className="text-roost-500 flex items-center gap-1">
            <span>🪶</span>
            {current} / {max > 0 ? max : "MAX"} feathers
          </span>
        </div>
      )}
      <div className="h-3.5 overflow-hidden rounded-full bg-roost-200 dark:bg-roost-700 relative">
        <div
          className="h-full rounded-full bg-gradient-to-r from-gobbl-400 via-gobbl-500 to-golden-500 transition-all duration-700 ease-out relative"
          style={{ width: `${percent}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
        </div>
      </div>
    </div>
  );
}
