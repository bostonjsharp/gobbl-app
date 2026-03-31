"use client";

const LEVEL_COLORS: Record<number, string> = {
  1: "from-roost-300 to-roost-400",
  2: "from-golden-300 to-golden-400",
  3: "from-golden-400 to-gobbl-400",
  4: "from-gobbl-400 to-gobbl-500",
  5: "from-gobbl-500 to-gobbl-600",
  6: "from-gobbl-600 to-plume-500",
  7: "from-plume-400 to-golden-500",
  8: "from-golden-400 to-gobbl-500",
};

interface LevelBadgeProps {
  level: number;
  size?: "sm" | "md" | "lg";
}

export function LevelBadge({ level, size = "md" }: LevelBadgeProps) {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-16 h-16 text-lg",
  };

  return (
    <div
      className={`${sizeClasses[size]} flex items-center justify-center rounded-full bg-gradient-to-br font-bold text-white shadow-md ring-2 ring-white/30
        ${LEVEL_COLORS[level] || LEVEL_COLORS[1]}`}
    >
      {level}
    </div>
  );
}
