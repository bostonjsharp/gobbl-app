"use client";

import { ModuleCard } from "@/components/skills/ModuleCard";

export default function SkillsPage() {
  return (
    <div className="flex flex-col gap-lg">
      <div>
        <h2 className="font-display text-2xl font-bold text-roost-700">Skill Modules</h2>
        <p className="text-sm text-roost-500">
          Coming soon — practice specific civility skills.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-md">
        <ModuleCard
          emoji="🎯"
          title="Respectful Tone"
          description="Active practice mode"
          size="lg"
        />
        <ModuleCard
          emoji="🧠"
          title="Evidence-Based Reasoning"
          description="Back your claims"
        />
        <ModuleCard
          emoji="❤️"
          title="Empathy"
          description="See the other side"
        />
        <ModuleCard
          emoji="🤝"
          title="Constructive Framing"
          description="Build bridges, not walls"
          size="wide"
        />
      </div>
    </div>
  );
}
