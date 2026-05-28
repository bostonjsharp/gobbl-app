"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ChatInterface, type FinishResult, type ChatMsg } from "@/components/chat/ChatInterface";
import { BoxBreathing } from "@/components/skills/BoxBreathing";

type Stage =
  | "loading"
  | "storyline"
  | "pre-stress"
  | "pre-chat-init"
  | "pre-chat"
  | "breathing"
  | "post-stress"
  | "post-chat-init"
  | "post-chat"
  | "results"
  | "already-complete";

const STRESS_LABELS: Record<number, string> = {
  1: "Calm",
  2: "Relaxed",
  3: "Neutral",
  4: "Tense",
  5: "Very stressed",
};

const SKILL_TOPIC = "Tell me about something in the news lately that's been bothering you.";

export default function BoxBreathingPage() {
  const router = useRouter();

  const [stage, setStage] = useState<Stage>("loading");
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Pre state
  const [preStress, setPreStress] = useState<number | null>(null);
  const [preDebateId, setPreDebateId] = useState<string | null>(null);
  const [preMessages, setPreMessages] = useState<ChatMsg[]>([]);
  const [preCivility, setPreCivility] = useState<number | null>(null);

  // Post state
  const [postStress, setPostStress] = useState<number | null>(null);
  const [postDebateId, setPostDebateId] = useState<string | null>(null);
  const [postMessages, setPostMessages] = useState<ChatMsg[]>([]);
  const [postCivility, setPostCivility] = useState<number | null>(null);

  // Load or create session on mount
  useEffect(() => {
    async function init() {
      const getRes = await fetch("/api/skills/sessions?skillKey=box-breathing");
      const getData = await getRes.json();
      const existing = getData.session;

      if (existing?.completedAt) {
        setSessionId(existing.id);
        setPreStress(existing.preStressRating);
        setPostStress(existing.postStressRating);
        setPreCivility(existing.preCivility);
        setPostCivility(existing.postCivility);
        setStage("already-complete");
        return;
      }

      if (existing) {
        setSessionId(existing.id);
        // Resume from last saved stage — but for simplicity restart from storyline
        // unless they made it past the chat stages
        setStage(existing.stage as Stage);
        if (existing.preStressRating) setPreStress(existing.preStressRating);
        if (existing.postStressRating) setPostStress(existing.postStressRating);
        if (existing.preCivility) setPreCivility(existing.preCivility);
        if (existing.postCivility) setPostCivility(existing.postCivility);
        if (existing.preDebateId) {
          setPreDebateId(existing.preDebateId);
          await loadDebateMessages(existing.preDebateId, setPreMessages);
        }
        if (existing.postDebateId) {
          setPostDebateId(existing.postDebateId);
          await loadDebateMessages(existing.postDebateId, setPostMessages);
        }
        return;
      }

      const createRes = await fetch("/api/skills/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skillKey: "box-breathing" }),
      });
      const createData = await createRes.json();
      setSessionId(createData.session.id);
      setStage("storyline");
    }
    init().catch(() => setStage("storyline"));
  }, []);

  async function loadDebateMessages(debateId: string, setter: (msgs: ChatMsg[]) => void) {
    const res = await fetch(`/api/debates?id=${debateId}`);
    const data = await res.json();
    if (data.messages) {
      setter(data.messages.map((m: { role: string; content: string; civilityScore: number | null }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
        civilityScore: m.civilityScore,
      })));
    }
  }

  async function patchSession(fields: Record<string, unknown>) {
    if (!sessionId) return;
    await fetch(`/api/skills/sessions/${sessionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });
  }

  async function advanceTo(next: Stage) {
    setStage(next);
    await patchSession({ stage: next });
  }

  async function initChat(isPost: boolean) {
    const res = await fetch("/api/debates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic: SKILL_TOPIC, category: "Skill", difficulty: "Friendly Cluck" }),
    });
    const data = await res.json();
    const msgs: ChatMsg[] = [{ role: "assistant", content: data.openingMessage }];
    if (isPost) {
      setPostDebateId(data.id);
      setPostMessages(msgs);
      await patchSession({ postDebateId: data.id, stage: "post-chat" });
      setStage("post-chat");
    } else {
      setPreDebateId(data.id);
      setPreMessages(msgs);
      await patchSession({ preDebateId: data.id, stage: "pre-chat" });
      setStage("pre-chat");
    }
  }

  async function handlePreFinish(result: FinishResult) {
    const civility = result.overallScore;
    setPreCivility(civility);
    await patchSession({ preCivility: civility, stage: "breathing" });
    setStage("breathing");
  }

  async function handlePostFinish(result: FinishResult) {
    const civility = result.overallScore;
    setPostCivility(civility);
    const now = new Date().toISOString();
    await patchSession({ postCivility: civility, completedAt: now, stage: "results" });
    setStage("results");
  }

  // ──────────────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────────────

  if (stage === "loading") {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-line">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-primary" />
        </div>
      </div>
    );
  }

  if (stage === "storyline") {
    return (
      <SkillShell
        title="Box Breathing"
        onBack={() => router.push("/skills")}
        progress={0}
        progressLabel="Skill intro"
      >
        <div className="flex flex-1 flex-col justify-between px-5 py-6">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">
              Skill 01
            </div>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-[-0.02em]">
              Box Breathing
            </h2>
            <p className="mt-1.5 font-body text-sm text-ink-soft">
              Calm your nervous system before you respond.
            </p>
            <div className="mt-6 rounded-2xl border border-line bg-surface p-4">
              <p className="font-body text-sm leading-relaxed text-ink">
                When emotions run hot in an argument, your ability to think clearly drops.
                Box breathing resets your nervous system in under two minutes — so you can
                return to the conversation grounded, not reactive.
              </p>
              <p className="mt-3 font-body text-sm leading-relaxed text-ink">
                In this session you&apos;ll have a short conversation, breathe through four
                cycles of box breathing, then have the same conversation again. We&apos;ll
                measure what changes.
              </p>
            </div>
          </div>
          <div className="pt-4">
            <Button className="w-full" onClick={() => advanceTo("pre-stress")}>
              Begin
            </Button>
          </div>
        </div>
      </SkillShell>
    );
  }

  if (stage === "pre-stress") {
    return (
      <SkillShell
        title="Pre-check"
        onBack={() => advanceTo("storyline")}
        progress={1}
        progressLabel="Step 1 of 4"
      >
        <StressRating
          label="Before we start — how stressed do you feel right now?"
          value={preStress}
          onChange={setPreStress}
          onNext={async () => {
            await patchSession({ preStressRating: preStress, stage: "pre-chat-init" });
            setStage("pre-chat-init");
            await initChat(false);
          }}
        />
      </SkillShell>
    );
  }

  if (stage === "pre-chat-init") {
    return (
      <SkillShell title="Pre-check" onBack={() => advanceTo("pre-stress")} progress={1} progressLabel="Step 1 of 4">
        <div className="flex flex-1 items-center justify-center">
          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-line">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-primary" />
          </div>
        </div>
      </SkillShell>
    );
  }

  if (stage === "pre-chat" && preDebateId) {
    return (
      <SkillShell
        title="Pre-check conversation"
        onBack={undefined}
        progress={1}
        progressLabel="Step 1 of 4"
        noPadding
      >
        <ChatInterface
          debateId={preDebateId}
          initialMessages={preMessages}
          maxTurns={4}
          onFinish={handlePreFinish}
        />
      </SkillShell>
    );
  }

  if (stage === "breathing") {
    return (
      <SkillShell
        title="Box Breathing"
        onBack={undefined}
        progress={2}
        progressLabel="Step 2 of 4"
      >
        <BoxBreathing onComplete={() => advanceTo("post-stress")} />
      </SkillShell>
    );
  }

  if (stage === "post-stress") {
    return (
      <SkillShell
        title="Post-check"
        onBack={undefined}
        progress={3}
        progressLabel="Step 3 of 4"
      >
        <StressRating
          label="After breathing — how stressed do you feel now?"
          value={postStress}
          onChange={setPostStress}
          onNext={async () => {
            await patchSession({ postStressRating: postStress, stage: "post-chat-init" });
            setStage("post-chat-init");
            await initChat(true);
          }}
        />
      </SkillShell>
    );
  }

  if (stage === "post-chat-init") {
    return (
      <SkillShell title="Post-check" onBack={undefined} progress={3} progressLabel="Step 3 of 4">
        <div className="flex flex-1 items-center justify-center">
          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-line">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-primary" />
          </div>
        </div>
      </SkillShell>
    );
  }

  if (stage === "post-chat" && postDebateId) {
    return (
      <SkillShell
        title="Post-check conversation"
        onBack={undefined}
        progress={3}
        progressLabel="Step 3 of 4"
        noPadding
      >
        <ChatInterface
          debateId={postDebateId}
          initialMessages={postMessages}
          maxTurns={4}
          onFinish={handlePostFinish}
        />
      </SkillShell>
    );
  }

  if (stage === "results" || stage === "already-complete") {
    return (
      <SkillShell
        title="Results"
        onBack={() => router.push("/skills")}
        progress={4}
        progressLabel="Complete"
      >
        <Results
          preStress={preStress}
          postStress={postStress}
          preCivility={preCivility}
          postCivility={postCivility}
          onDone={() => router.push("/skills")}
        />
      </SkillShell>
    );
  }

  // Fallback for resume edge cases
  return (
    <SkillShell title="Box Breathing" onBack={() => router.push("/skills")} progress={0} progressLabel="">
      <div className="flex flex-1 items-center justify-center px-5">
        <Button className="w-full" onClick={() => advanceTo("storyline")}>
          Start over
        </Button>
      </div>
    </SkillShell>
  );
}

// ──────────────────────────────────────────────────
// Sub-components
// ──────────────────────────────────────────────────

function SkillShell({
  title,
  onBack,
  progress,
  progressLabel,
  noPadding = false,
  children,
}: {
  title: string;
  onBack?: () => void;
  progress: number; // 0-4
  progressLabel: string;
  noPadding?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex shrink-0 items-center gap-2.5 border-b border-line bg-surface px-4 py-3">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-bg"
            aria-label="Back"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ) : (
          <div className="h-9 w-9" />
        )}
        <div className="flex-1 text-center">
          <div className="font-body text-sm font-bold">{title}</div>
          <div className="font-mono text-[10px] text-ink-muted">{progressLabel}</div>
        </div>
        <div className="h-9 w-9" />
      </div>

      {/* Progress dots */}
      <div className="flex shrink-0 justify-center gap-2 border-b border-line bg-surface px-4 py-2.5">
        {[1, 2, 3, 4].map((n) => (
          <span
            key={n}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              n <= progress ? "w-6 bg-primary" : "w-1.5 bg-line"
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <div className={`flex flex-1 min-h-0 flex-col ${noPadding ? "" : "overflow-y-auto"}`}>
        {children}
      </div>
    </div>
  );
}

function StressRating({
  label,
  value,
  onChange,
  onNext,
}: {
  label: string;
  value: number | null;
  onChange: (v: number) => void;
  onNext: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col justify-between px-5 py-6">
      <div>
        <p className="font-body text-base font-semibold text-ink">{label}</p>
        <div className="mt-6 flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              className={`flex flex-1 flex-col items-center gap-1.5 rounded-xl border-2 py-3 transition-colors ${
                value === n
                  ? "border-primary bg-primary-soft"
                  : "border-line bg-surface hover:border-primary/50"
              }`}
            >
              <span className="text-xl">{["😌", "🙂", "😐", "😟", "😤"][n - 1]}</span>
              <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.06em] text-ink-muted">
                {n}
              </span>
            </button>
          ))}
        </div>
        {value !== null && (
          <p className="mt-3 text-center font-body text-sm text-ink-soft">
            {STRESS_LABELS[value]}
          </p>
        )}
      </div>
      <div className="pt-4">
        <Button className="w-full" disabled={value === null} onClick={onNext}>
          Next
        </Button>
      </div>
    </div>
  );
}

function Results({
  preStress,
  postStress,
  preCivility,
  postCivility,
  onDone,
}: {
  preStress: number | null;
  postStress: number | null;
  preCivility: number | null;
  postCivility: number | null;
  onDone: () => void;
}) {
  const stressDelta = preStress !== null && postStress !== null ? postStress - preStress : null;
  const civilityDelta =
    preCivility !== null && postCivility !== null ? postCivility - preCivility : null;

  function deltaLabel(delta: number | null, lowerIsBetter: boolean) {
    if (delta === null) return "—";
    if (delta === 0) return "No change";
    const improved = lowerIsBetter ? delta < 0 : delta > 0;
    const sign = delta > 0 ? "+" : "";
    return `${sign}${delta.toFixed(lowerIsBetter ? 0 : 1)} ${improved ? "↑" : "↓"}`;
  }

  function deltaColor(delta: number | null, lowerIsBetter: boolean) {
    if (delta === null || delta === 0) return "text-ink-muted";
    const improved = lowerIsBetter ? delta < 0 : delta > 0;
    return improved ? "text-forest-600" : "text-plume-500";
  }

  return (
    <div className="flex flex-1 flex-col justify-between overflow-y-auto px-5 py-6">
      <div className="flex flex-col gap-4">
        <div className="text-center">
          <div className="font-display text-xl font-bold">Great work.</div>
          <p className="mt-1 font-body text-sm text-ink-soft">
            Here&apos;s what changed after box breathing.
          </p>
        </div>

        {/* Stress delta */}
        <div className="rounded-2xl border border-line bg-surface p-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-muted">
            Stress level
          </div>
          <div className="mt-2 flex items-center justify-between gap-2">
            <div className="text-center">
              <div className="font-mono text-xs text-ink-muted">Before</div>
              <div className="font-display text-2xl font-bold">{preStress ?? "—"}</div>
              {preStress && (
                <div className="font-body text-xs text-ink-soft">{STRESS_LABELS[preStress]}</div>
              )}
            </div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0 text-ink-muted">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="text-center">
              <div className="font-mono text-xs text-ink-muted">After</div>
              <div className="font-display text-2xl font-bold">{postStress ?? "—"}</div>
              {postStress && (
                <div className="font-body text-xs text-ink-soft">{STRESS_LABELS[postStress]}</div>
              )}
            </div>
            <div className={`text-right font-display text-lg font-bold ${deltaColor(stressDelta, true)}`}>
              {deltaLabel(stressDelta, true)}
            </div>
          </div>
        </div>

        {/* Civility delta */}
        <div className="rounded-2xl border border-line bg-surface p-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-muted">
            Conversation civility
          </div>
          <div className="mt-2 flex items-center justify-between gap-2">
            <div className="text-center">
              <div className="font-mono text-xs text-ink-muted">Before</div>
              <div className="font-display text-2xl font-bold">
                {preCivility !== null ? preCivility.toFixed(1) : "—"}
              </div>
            </div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0 text-ink-muted">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="text-center">
              <div className="font-mono text-xs text-ink-muted">After</div>
              <div className="font-display text-2xl font-bold">
                {postCivility !== null ? postCivility.toFixed(1) : "—"}
              </div>
            </div>
            <div className={`text-right font-display text-lg font-bold ${deltaColor(civilityDelta, false)}`}>
              {deltaLabel(civilityDelta, false)}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <Button className="w-full" onClick={onDone}>
          Back to Skills
        </Button>
      </div>
    </div>
  );
}
