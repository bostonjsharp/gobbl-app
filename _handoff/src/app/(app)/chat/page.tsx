"use client";

import { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { FlatTurkey } from "@/components/gamification/FlatTurkey";
import { TOPICS, getDailyTopic, formatTopicForDebate, type Topic } from "@/lib/topics";
import { DIFFICULTIES } from "@/lib/gamification";
import { describeFlip, flipBelief } from "@/lib/prompts/flipBelief";
import { parseBeliefKey, type BeliefKey } from "@/lib/prompts/beliefs";

// Map difficulty key → stage avatar + tone for the picker.
const DIFFICULTY_META: Record<string, { stage: number; tone: "forest" | "primary" | "rust"; xp: number }> = {
  "Friendly Cluck": { stage: 3, tone: "forest",  xp: 60  },
  "Spirited Strut": { stage: 5, tone: "primary", xp: 120 },
  "Full Gobble":    { stage: 7, tone: "rust",    xp: 200 },
};

const TONE_BG: Record<string, string> = {
  forest:  "bg-forest-100",
  primary: "bg-primary-soft",
  rust:    "bg-plume-100",
};
const TONE_FG: Record<string, string> = {
  forest:  "text-forest-600",
  primary: "text-primary",
  rust:    "text-plume-500",
};
const TONE_BORDER: Record<string, string> = {
  forest:  "border-forest-500",
  primary: "border-primary",
  rust:    "border-plume-500",
};

function SetupContent() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDaily = searchParams.get("daily") === "true";
  const topicId = searchParams.get("topic");

  const initialDifficulty = searchParams.get("difficulty") ?? "Spirited Strut";
  const [selectedDifficulty, setSelectedDifficulty] = useState(initialDifficulty);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(
    isDaily ? null : (topicId ?? null),
  );
  const [userBelief, setUserBelief] = useState<BeliefKey | null>(null);
  const [loading, setLoading] = useState(false);

  const topic: Topic | null = (() => {
    if (isDaily) return getDailyTopic();
    if (!selectedTopicId) return null;
    return TOPICS.find((t) => t.id === selectedTopicId) ?? null;
  })();

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/"); return; }
    if (status === "authenticated") {
      fetch("/api/user").then((r) => r.json()).then((data) => {
        setUserBelief(parseBeliefKey(data.beliefKey));
      });
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <FlatTurkey stage={1} size="md" animate />
      </div>
    );
  }

  // Top 4 topics to surface as quick picks (rotate weekly if you want).
  const featuredTopics = TOPICS.slice(0, 4);

  const startDebate = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      const res = await fetch("/api/debates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: formatTopicForDebate(topic),
          category: topic.category,
          difficulty: selectedDifficulty,
          beliefKey: flipBelief(userBelief),  // ← auto-flipped from onboarding
          isDaily,
        }),
      });
      if (!res.ok) throw new Error("Failed to start");
      const data = await res.json();
      router.push(`/chat/${data.id}`);
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 pb-24">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface"
          aria-label="Back"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-muted">
          {isDaily ? "Daily Gobble" : "New debate"}
        </div>
        <div className="h-9 w-9" />
      </div>

      <div>
        <h1 className="font-display text-[38px] font-bold leading-none tracking-[-0.035em]">
          Set up your debate.
        </h1>
        <p className="mt-2 font-body text-sm text-ink-soft">
          Pick a topic and how hard you want Robert to push back.
        </p>
      </div>

      {/* 01 Topic */}
      <section>
        <div className="mb-2.5 flex items-baseline justify-between">
          <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">
            01 — Topic
          </div>
          <span className="font-body text-xs font-semibold text-primary">
            Browse all {TOPICS.length} →
          </span>
        </div>

        {topic ? (
          <div className="relative rounded-2xl border-2 border-primary bg-surface p-4">
            <div className="font-mono text-[9px] uppercase tracking-[0.1em] text-primary">
              {topic.category} {isDaily && "· Daily"}
            </div>
            <div className="mt-1.5 font-display text-[20px] font-bold tracking-[-0.02em]">
              {topic.title}
            </div>
            <div className="mt-1 font-body text-xs text-ink-soft">
              {isDaily ? "+50 feathers · daily bonus" : topic.description}
            </div>
            <div className="absolute right-3.5 top-3.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4 10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
        ) : null}

        {!isDaily && (
          <div className="mt-2 flex flex-col gap-1.5">
            {featuredTopics.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedTopicId(t.id)}
                className={`flex items-center justify-between rounded-xl border bg-surface px-3.5 py-3 transition-colors ${
                  selectedTopicId === t.id
                    ? "border-primary"
                    : "border-line hover:border-ink-muted"
                }`}
              >
                <span className="font-body text-[13px] font-medium">{t.title}</span>
                <span className="font-mono text-[10px] text-ink-muted">→</span>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Robert auto-flip note */}
      <div className="flex items-center gap-3 rounded-2xl border border-forest-300/40 bg-forest-100 px-3.5 py-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-forest-500 text-white">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M21 7L12 17l-4-4M3 12l4 4M14 7l3 3"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-body text-xs font-bold text-forest-700">
            Robert opposes you today.
          </div>
          <div className="mt-0.5 font-body text-[11px] text-ink-soft">
            {describeFlip(userBelief)}
          </div>
        </div>
      </div>

      {/* 02 Difficulty */}
      <section>
        <div className="mb-2.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">
          02 — Difficulty
        </div>
        <div className="flex flex-col gap-2.5">
          {DIFFICULTIES.map((d) => {
            const meta = DIFFICULTY_META[d.key];
            const selected = selectedDifficulty === d.key;
            return (
              <button
                key={d.key}
                type="button"
                onClick={() => setSelectedDifficulty(d.key)}
                className={`relative flex items-center gap-3.5 rounded-2xl border-2 bg-surface p-3.5 text-left transition-colors ${
                  selected ? TONE_BORDER[meta.tone] : "border-line hover:border-ink-muted"
                }`}
              >
                <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${TONE_BG[meta.tone]}`}>
                  <FlatTurkey stage={meta.stage} size={50} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className={`font-display text-base font-bold tracking-[-0.02em] ${TONE_FG[meta.tone]}`}>
                    {d.label}
                  </div>
                  <div className="mt-0.5 font-body text-xs text-ink-soft">{d.description}</div>
                </div>
                <div className={`whitespace-nowrap font-mono text-[11px] font-semibold ${TONE_FG[meta.tone]}`}>
                  +{meta.xp} XP
                </div>
                {selected && (
                  <div
                    className={`absolute -top-2 right-3.5 rounded-full px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.08em] text-white`}
                    style={{ background: `var(--tw-color, currentColor)` }}
                  >
                    <span className={TONE_FG[meta.tone]}>Selected</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Sticky CTA */}
      <div className="fixed inset-x-0 bottom-20 z-20 px-5 pb-3 pt-2">
        <div className="mx-auto max-w-md">
          <Button
            size="lg"
            className="w-full shadow-lift"
            onClick={startDebate}
            disabled={!topic || loading}
            loading={loading}
          >
            {topic ? "Start the debate" : "Pick a topic to continue"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ChatSetupPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[60vh] items-center justify-center">
        <FlatTurkey stage={1} size="md" animate />
      </div>
    }>
      <SetupContent />
    </Suspense>
  );
}
