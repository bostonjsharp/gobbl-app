"use client";

interface StatsCardProps {
  label: string;
  value: string | number;
  /** Optional unit/sublabel, e.g. "/100" or "days" */
  unit?: string;
  /** Tone tint — drives the value color. */
  tone?: "primary" | "forest" | "ochre" | "rust" | "neutral";
  /** Optional delta in the top-right, e.g. "+3" or "↑ 6" */
  delta?: string;
}

const tones = {
  primary: "text-primary",
  forest:  "text-forest-600",
  ochre:   "text-golden-600",
  rust:    "text-plume-500",
  neutral: "text-ink",
};

/**
 * Compact statistic tile — Harvest direction.
 * Eyebrow label, big display-weight value, optional unit + delta.
 * Used on dashboard and profile.
 */
export function StatsCard({ label, value, unit, tone = "neutral", delta }: StatsCardProps) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-4">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-muted">
          {label}
        </span>
        {delta && (
          <span className={`font-mono text-[10px] font-semibold ${tones[tone]}`}>{delta}</span>
        )}
      </div>
      <div className="mt-1.5 flex items-baseline gap-1">
        <span
          className={`font-display text-[28px] font-bold tracking-[-0.03em] num-tabular ${tones[tone]}`}
        >
          {value}
        </span>
        {unit && <span className="font-mono text-[11px] text-ink-muted">{unit}</span>}
      </div>
    </div>
  );
}
