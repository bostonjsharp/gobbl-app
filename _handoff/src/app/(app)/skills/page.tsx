"use client";

import { FlatTurkey } from "@/components/gamification/FlatTurkey";

// Five canonical civility-skill paths. Wire `progress` / `level` to real data
// once a /api/skills endpoint exists; today the values are static placeholders.
const PATHS = [
  { num: "01", title: "Active Listening",     sub: "Hear what they actually said.",        progress: 100, level: "Mastered",  tone: "forest" },
  { num: "02", title: "Evidence & Sources",   sub: "Cite, don't guess.",                   progress: 80,  level: "Lv. 4 of 5", tone: "primary" },
  { num: "03", title: "Constructive Framing", sub: "Build, don't blame.",                  progress: 40,  level: "Lv. 2 of 5", tone: "ochre" },
  { num: "04", title: "Empathy Drills",       sub: "Sit with the other side.",             progress: 20,  level: "Lv. 1 of 5", tone: "rust" },
  { num: "05", title: "Holding Your Ground",  sub: "Disagree without raising heat.",       progress: 0,   level: "Locked",     tone: "muted", locked: true },
] as const;

const TONE_BG: Record<string, string> = {
  forest:  "bg-forest-100 text-forest-700",
  primary: "bg-primary-soft text-gobbl-700",
  ochre:   "bg-ochre-soft text-golden-700",
  rust:    "bg-plume-100 text-plume-700",
  muted:   "bg-line text-ink-muted",
};
const TONE_BAR: Record<string, string> = {
  forest:  "bg-forest-500",
  primary: "bg-primary",
  ochre:   "bg-ochre",
  rust:    "bg-plume-500",
  muted:   "bg-ink-muted",
};
const TONE_FG: Record<string, string> = {
  forest:  "text-forest-600",
  primary: "text-primary",
  ochre:   "text-golden-700",
  rust:    "text-plume-500",
  muted:   "text-ink-muted",
};

export default function SkillsPage() {
  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">
            Skill paths
          </div>
          <h1 className="mt-1.5 font-display text-[32px] font-bold leading-none tracking-[-0.03em]">
            Sharpen
            <br />
            your gobble.
          </h1>
        </div>
        <FlatTurkey stage={4} size={60} />
      </div>

      {/* Active path */}
      <div className="relative overflow-hidden rounded-3xl bg-ink p-5 text-bg">
        <div className="pointer-events-none absolute -bottom-7 -right-7 opacity-15">
          <FlatTurkey stage={6} size={160} />
        </div>
        <div className="relative">
          <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-ochre">
            Currently learning
          </div>
          <div className="mt-1.5 font-display text-[22px] font-bold tracking-[-0.02em]">
            Steelmanning
          </div>
          <div className="mt-1 font-body text-[13px] text-bg/70">
            Make their argument stronger before you respond.
          </div>
          <div className="mt-3.5">
            <div className="h-1.5 overflow-hidden rounded-full bg-white/15">
              <div className="h-full w-[60%] rounded-full bg-ochre" />
            </div>
            <div className="mt-1.5 flex justify-between">
              <span className="font-mono text-[10px] text-bg/55">3 of 5 lessons</span>
              <span className="font-mono text-[10px] text-ochre">Continue →</span>
            </div>
          </div>
        </div>
      </div>

      {/* All paths */}
      <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">
        All paths
      </div>
      <div className="flex flex-col gap-2.5">
        {PATHS.map((p) => (
          <div
            key={p.title}
            className={`rounded-2xl border border-line bg-surface p-4 ${p.locked ? "opacity-60" : ""}`}
          >
            <div className="flex items-center gap-3.5">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl font-display text-lg font-bold tracking-[-0.02em] ${TONE_BG[p.tone]}`}
              >
                {p.num}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-display text-base font-bold tracking-[-0.02em]">{p.title}</div>
                <div className="mt-0.5 font-body text-xs text-ink-soft">{p.sub}</div>
              </div>
              <div
                className={`whitespace-nowrap font-mono text-[10px] font-semibold uppercase tracking-[0.06em] ${TONE_FG[p.tone]}`}
              >
                {p.level}
              </div>
            </div>
            <div className="mt-3 h-[5px] overflow-hidden rounded-full bg-bg">
              <div
                className={`h-full rounded-full ${TONE_BAR[p.tone]} transition-[width] duration-700`}
                style={{ width: `${p.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
