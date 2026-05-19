"use client";

import { TOPICS, CATEGORIES, type Topic } from "@/lib/topics";
import { useMemo, useState } from "react";

interface TopicDropdownProps {
  value: string | null;
  onChange: (topicId: string) => void;
}

export function TopicDropdown({ value, onChange }: TopicDropdownProps) {
  const [category, setCategory] = useState<string | null>(null);

  const filtered: Topic[] = useMemo(
    () => (category ? TOPICS.filter((t) => t.category === category) : TOPICS),
    [category],
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategory(null)}
          className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
            !category ? "bg-gobbl-500 text-white" : "bg-roost-100 text-roost-500 hover:bg-roost-200"
          }`}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            type="button"
            key={c}
            onClick={() => setCategory(c)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              category === c ? "bg-gobbl-500 text-white" : "bg-roost-100 text-roost-500 hover:bg-roost-200"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border-2 border-roost-200 bg-roost-50 px-md py-3 text-sm text-roost-700 focus:border-gobbl-500 focus:outline-none"
      >
        <option value="" disabled>
          Pick a topic…
        </option>
        {filtered.map((t) => (
          <option key={t.id} value={t.id}>
            {t.title}
          </option>
        ))}
      </select>
    </div>
  );
}
