"use client";

import { TOPICS } from "@/lib/topics";

interface TopicDropdownProps {
  value: string | null;
  onChange: (topicId: string) => void;
}

export function TopicDropdown({ value, onChange }: TopicDropdownProps) {
  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border-2 border-roost-200 bg-roost-50 px-md py-3 text-sm text-roost-700 focus:border-gobbl-500 focus:outline-none"
    >
      <option value="" disabled>
        Pick a topic…
      </option>
      {TOPICS.map((t) => (
        <option key={t.id} value={t.id}>
          {t.title}
        </option>
      ))}
    </select>
  );
}
