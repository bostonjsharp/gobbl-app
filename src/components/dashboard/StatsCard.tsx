"use client";

interface StatsCardProps {
  icon: string;
  label: string;
  value: string | number;
  subtitle?: string;
  color?: string;
}

export function StatsCard({ icon, label, value, subtitle, color = "text-roost-700" }: StatsCardProps) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl bg-roost-100 p-md">
      <div className="flex items-center gap-2">
        <span className="text-xl">{icon}</span>
        <span className="font-display text-xs font-semibold uppercase tracking-wider text-roost-500">{label}</span>
      </div>
      <div className={`font-display text-2xl font-bold ${color}`}>{value}</div>
      {subtitle && <div className="text-xs text-roost-500">{subtitle}</div>}
    </div>
  );
}
