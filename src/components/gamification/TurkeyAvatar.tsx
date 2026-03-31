"use client";

interface TurkeyAvatarProps {
  level: number;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  animate?: boolean;
  className?: string;
}

const SIZE_MAP = {
  xs: { container: "w-8 h-8", text: "text-lg" },
  sm: { container: "w-12 h-12", text: "text-2xl" },
  md: { container: "w-20 h-20", text: "text-4xl" },
  lg: { container: "w-32 h-32", text: "text-6xl" },
  xl: { container: "w-44 h-44", text: "text-8xl" },
};

const STAGE_CONFIG: Record<number, { emoji: string; bg: string; ring: string; label: string }> = {
  1: {
    emoji: "🥚",
    bg: "bg-gradient-to-br from-roost-100 to-roost-200 dark:from-roost-800 dark:to-roost-700",
    ring: "ring-roost-300 dark:ring-roost-600",
    label: "Egg",
  },
  2: {
    emoji: "🐣",
    bg: "bg-gradient-to-br from-golden-100 to-golden-200 dark:from-golden-800 dark:to-golden-700",
    ring: "ring-golden-400 dark:ring-golden-600",
    label: "Hatchling",
  },
  3: {
    emoji: "🐥",
    bg: "bg-gradient-to-br from-golden-200 to-gobbl-100 dark:from-golden-700 dark:to-gobbl-800",
    ring: "ring-gobbl-300 dark:ring-gobbl-600",
    label: "Poult",
  },
  4: {
    emoji: "🐔",
    bg: "bg-gradient-to-br from-gobbl-100 to-gobbl-200 dark:from-gobbl-800 dark:to-gobbl-700",
    ring: "ring-gobbl-400 dark:ring-gobbl-600",
    label: "Youngster",
  },
  5: {
    emoji: "🦃",
    bg: "bg-gradient-to-br from-gobbl-200 to-gobbl-300 dark:from-gobbl-700 dark:to-gobbl-600",
    ring: "ring-gobbl-500 dark:ring-gobbl-500",
    label: "Tom",
  },
  6: {
    emoji: "🦃",
    bg: "bg-gradient-to-br from-gobbl-300 to-plume-200 dark:from-gobbl-600 dark:to-plume-800",
    ring: "ring-plume-400 dark:ring-plume-600",
    label: "Gobbler",
  },
  7: {
    emoji: "🦃",
    bg: "bg-gradient-to-br from-plume-100 to-golden-200 dark:from-plume-800 dark:to-golden-800",
    ring: "ring-golden-500 dark:ring-golden-500",
    label: "Grand Gobbler",
  },
  8: {
    emoji: "🦅",
    bg: "bg-gradient-to-br from-golden-200 via-gobbl-200 to-plume-200 dark:from-golden-700 dark:via-gobbl-700 dark:to-plume-700",
    ring: "ring-golden-400 dark:ring-golden-500",
    label: "Thunderbird",
  },
};

const LEVEL_DECORATIONS: Record<number, string> = {
  1: "",
  2: "",
  3: "",
  4: "drop-shadow(0 0 6px rgba(251,146,60,0.3))",
  5: "drop-shadow(0 0 8px rgba(249,115,22,0.4))",
  6: "drop-shadow(0 0 10px rgba(159,18,57,0.3))",
  7: "drop-shadow(0 0 12px rgba(255,215,0,0.4))",
  8: "drop-shadow(0 0 16px rgba(255,215,0,0.6))",
};

export function TurkeyAvatar({ level, size = "md", animate = true, className = "" }: TurkeyAvatarProps) {
  const clampedLevel = Math.max(1, Math.min(8, level));
  const stage = STAGE_CONFIG[clampedLevel];
  const sizeConfig = SIZE_MAP[size];
  const decoration = LEVEL_DECORATIONS[clampedLevel];

  return (
    <div className={`relative inline-flex flex-col items-center ${className}`}>
      <div
        className={`${sizeConfig.container} ${stage.bg} flex items-center justify-center rounded-full ring-3 ${stage.ring} 
          ${animate && clampedLevel >= 5 ? "animate-float" : ""}
          ${animate && clampedLevel >= 7 ? "animate-wiggle" : ""}
          transition-all duration-500`}
        style={{ filter: decoration }}
      >
        <span className={`${sizeConfig.text} select-none`} role="img" aria-label={stage.label}>
          {stage.emoji}
        </span>
      </div>
      {clampedLevel >= 6 && size !== "xs" && size !== "sm" && (
        <div className="absolute -top-1 -right-1">
          <span className="text-sm animate-bounce-in">✨</span>
        </div>
      )}
      {clampedLevel === 8 && size !== "xs" && size !== "sm" && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
          <span className="text-xs">👑</span>
        </div>
      )}
    </div>
  );
}

export function TurkeyAvatarWithLabel({ level, size = "md", className = "" }: TurkeyAvatarProps) {
  const clampedLevel = Math.max(1, Math.min(8, level));
  const stage = STAGE_CONFIG[clampedLevel];

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <TurkeyAvatar level={level} size={size} />
      <div className="text-center">
        <div className="text-sm font-bold text-roost-800 dark:text-roost-100">{stage.label}</div>
        <div className="text-xs text-roost-500">Level {clampedLevel}</div>
      </div>
    </div>
  );
}
