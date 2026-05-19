"use client";

interface DifficultyOption {
  key: string;
  emoji: string;
  label: string;
  description: string;
}

const DIFFICULTIES: DifficultyOption[] = [
  { key: "Friendly Cluck", emoji: "🐣", label: "Friendly Cluck", description: "Warm, listens well" },
  { key: "Spirited Strut", emoji: "🦃", label: "Spirited Strut", description: "Engaged, direct" },
  { key: "Full Gobble", emoji: "🌩️", label: "Full Gobble", description: "Confrontational, immovable" },
];

interface DifficultyPickerProps {
  value: string | null;
  onChange: (value: string) => void;
}

export function DifficultyPicker({ value, onChange }: DifficultyPickerProps) {
  return (
    <div className="flex flex-col gap-3">
      {DIFFICULTIES.map((opt) => {
        const active = value === opt.key;
        return (
          <button
            key={opt.key}
            type="button"
            onClick={() => onChange(opt.key)}
            className={`flex items-center gap-md rounded-2xl border-2 p-md text-left transition-all ${
              active
                ? "border-gobbl-500 bg-gobbl-500/10"
                : "border-roost-200 bg-roost-50 hover:border-roost-300"
            }`}
          >
            <span className="text-3xl">{opt.emoji}</span>
            <div>
              <div className="font-display font-bold text-roost-700">{opt.label}</div>
              <div className="text-sm text-roost-500">{opt.description}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
