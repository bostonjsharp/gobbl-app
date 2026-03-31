"use client";

interface StatsCardProps {
  icon: string;
  label: string;
  value: string | number;
  subtitle?: string;
  color?: string;
}

export function StatsCard({ icon, label, value, subtitle, color = "text-roost-800 dark:text-roost-100" }: StatsCardProps) {
  return (
    <div className="rounded-2xl border border-roost-200 bg-white p-4 dark:border-roost-800 dark:bg-roost-900 transition-all hover:shadow-md">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <div className="text-xs text-roost-500 font-medium">{label}</div>
          <div className={`text-xl font-bold ${color}`}>{value}</div>
          {subtitle && <div className="text-xs text-roost-400">{subtitle}</div>}
        </div>
      </div>
    </div>
  );
}
