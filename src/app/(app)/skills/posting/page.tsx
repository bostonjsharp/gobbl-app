"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { BoxBreathing } from "@/components/skills/BoxBreathing";
import { ComposableTurkey } from "@/components/turkey-parts/ComposableTurkey";
import { FlatTurkeyGlyph } from "@/components/gamification/FlatTurkey";
import { getPresidentConfig } from "@/lib/turkey-parts/characters";

// ─── Types ────────────────────────────────────────────────────────────────────

type Stage =
  | "loading"
  | "intro"
  | "statement-1-loading"
  | "statement-1"
  | "pre-post"
  | "breathing"
  | "statement-2-loading"
  | "statement-2"
  | "post-post"
  | "completing"
  | "reward"
  | "already-complete";

const TOPIC_LABELS: Record<string, string> = {
  civil_rights:        "Civil Rights",
  climate_environment: "Climate & Environment",
  crime_safety:        "Crime & Safety",
  economy_jobs:        "Economy & Jobs",
  education:           "Education",
  foreign_policy:      "Foreign Policy",
  healthcare:          "Healthcare",
  immigration:         "Immigration",
};

const MAX_POST_CHARS = 280;

// ─── Main page ────────────────────────────────────────────────────────────────

export default function PostingSkillPage() {
  const router = useRouter();

  const [stage, setStage]               = useState<Stage>("loading");
  const [sessionId, setSessionId]       = useState<string | null>(null);
  const [politicianKey, setPoliticianKey] = useState("trump");
  const [topicKey, setTopicKey]         = useState("economy_jobs");
  const [statement1, setStatement1]     = useState("");
  const [statement2, setStatement2]     = useState("");
  const [prePostText, setPrePostText]   = useState("");
  const [postPostText, setPostPostText] = useState("");
  const [feathersEarned, setFeathersEarned] = useState(0);
  const [submitting, setSubmitting]     = useState(false);

  const presidentConfig = getPresidentConfig(politicianKey, 88);
  const topicLabel = TOPIC_LABELS[topicKey] ?? topicKey;

  // ── Init ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    async function init() {
      // Fetch user's skill context (top issue + least-fav politician)
      const [ctxRes, sessionRes] = await Promise.all([
        fetch("/api/skills/context"),
        fetch("/api/skills/sessions?skillKey=posting"),
      ]);
      const ctx  = await ctxRes.json();
      const data = await sessionRes.json();

      if (ctx.topIssue)      setTopicKey(ctx.topIssue);
      if (ctx.politicianKey) setPoliticianKey(ctx.politicianKey);

      const existing = data.session;
      if (existing?.completedAt) {
        setSessionId(existing.id);
        setFeathersEarned(existing.feathersEarned ?? 40);
        setStage("already-complete");
        return;
      }
      if (existing) {
        setSessionId(existing.id);
        if (existing.statement1)   setStatement1(existing.statement1);
        if (existing.statement2)   setStatement2(existing.statement2);
        if (existing.prePostText)  setPrePostText(existing.prePostText);
        if (existing.postPostText) {
          setPostPostText(existing.postPostText);
        } else if (existing.prePostText) {
          setPostPostText(existing.prePostText);
        }
        // Resume at a sensible stage
        const s = existing.stage as Stage;
        setStage(["statement-1", "pre-post", "breathing", "statement-2", "post-post"].includes(s) ? s : "intro");
        return;
      }

      // Fresh session
      const createRes = await fetch("/api/skills/sessions", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ skillKey: "posting" }),
      });
      const created = await createRes.json();
      setSessionId(created.session.id);
      setStage("intro");
    }
    init().catch(() => setStage("intro"));
  }, []);

  // ── Helpers ───────────────────────────────────────────────────────────────

  async function patch(fields: Record<string, unknown>) {
    if (!sessionId) return;
    await fetch(`/api/skills/sessions/${sessionId}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(fields),
    });
  }

  async function loadStatement(num: 1 | 2) {
    setStage(num === 1 ? "statement-1-loading" : "statement-2-loading");
    const res = await fetch("/api/skills/president-statement", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ politicianKey, topicKey, statementNumber: num }),
    });
    const data = await res.json();
    const text = data.statement as string;
    if (num === 1) {
      setStatement1(text);
      await patch({ statement1: text, stage: "statement-1" });
      setStage("statement-1");
    } else {
      setStatement2(text);
      setPostPostText(prePostText); // seed edit with original post
      await patch({ statement2: text, postPostText: prePostText, stage: "statement-2" });
      setStage("statement-2");
    }
  }

  async function submitPrePost() {
    setSubmitting(true);
    await patch({ prePostText, stage: "breathing" });
    setSubmitting(false);
    setStage("breathing");
  }

  async function submitFinalPost() {
    if (!sessionId) return;
    setSubmitting(true);

    // Score both posts; fall back to 5 if scoring fails
    let preCivility = 5;
    let postCivility = 5;
    try {
      const [preRes, postRes] = await Promise.all([
        fetch("/api/skills/score-post", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ text: prePostText, context: statement1 }),
        }),
        fetch("/api/skills/score-post", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ text: postPostText, context: statement2 }),
        }),
      ]);
      if (preRes.ok)  { const d = await preRes.json();  preCivility  = d.civility  ?? 5; }
      if (postRes.ok) { const d = await postRes.json(); postCivility = d.civility ?? 5; }
    } catch { /* use defaults */ }

    await patch({ postPostText, preCivility, postCivility });
    setStage("completing");

    try {
      const completeRes = await fetch(`/api/skills/sessions/${sessionId}/complete`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ preCivility, postCivility }),
      });
      const text = await completeRes.text();
      const reward = text ? (JSON.parse(text) as { feathersEarned?: number }) : {};
      setFeathersEarned(reward.feathersEarned ?? 40);
    } catch {
      setFeathersEarned(40);
    }

    setSubmitting(false);
    setStage("reward");
  }

  // ── Stage renders ─────────────────────────────────────────────────────────

  if (stage === "loading" || stage === "completing") {
    return (
      <Shell title="Posting" onBack={undefined} step={0}>
        <div className="flex flex-1 items-center justify-center">
          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-line">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-primary" />
          </div>
        </div>
      </Shell>
    );
  }

  if (stage === "intro") {
    return (
      <Shell title="Posting" onBack={() => router.push("/skills")} step={0}>
        <div className="flex flex-1 flex-col justify-between overflow-y-auto px-5 py-6">
          <div className="flex flex-col items-center gap-5 text-center">
            <ComposableTurkey {...presidentConfig} sizePx={120} />
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">
                Skill 01 · {topicLabel}
              </div>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-[-0.02em]">
                Posting
              </h2>
              <p className="mt-2 font-body text-sm leading-relaxed text-ink-soft">
                The President is about to make a statement about {topicLabel.toLowerCase()}.
                You&apos;ll write a post in response — then breathe — then write again.
                See what changes.
              </p>
            </div>
            <div className="w-full rounded-2xl border border-line bg-surface px-4 py-3 text-left">
              <div className="font-mono text-[9px] uppercase tracking-[0.1em] text-ink-muted">How it works</div>
              <ol className="mt-2 flex flex-col gap-1.5">
                {[
                  "Watch The President's statement",
                  "Write your reaction as a post",
                  "Do a quick breathing exercise",
                  "Watch The President again",
                  "Edit or rewrite your post",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-2 font-body text-xs text-ink">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary-soft font-mono text-[9px] font-bold text-gobbl-700">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <div className="pt-6">
            <Button className="w-full" onClick={() => loadStatement(1)}>
              Watch the statement
            </Button>
          </div>
        </div>
      </Shell>
    );
  }

  if (stage === "statement-1-loading" || stage === "statement-2-loading") {
    return (
      <Shell title="Posting" onBack={undefined} step={stage === "statement-1-loading" ? 1 : 3}>
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <ComposableTurkey {...presidentConfig} sizePx={80} />
          <p className="font-body text-sm text-ink-soft">The President is speaking…</p>
          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-line">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-plume-500" />
          </div>
        </div>
      </Shell>
    );
  }

  if (stage === "statement-1" || stage === "statement-2") {
    const isFirst   = stage === "statement-1";
    const statement = isFirst ? statement1 : statement2;
    const stepNum   = isFirst ? 1 : 3;

    return (
      <Shell title="Posting" onBack={undefined} step={stepNum}>
        <div className="flex flex-1 flex-col justify-between overflow-y-auto px-4 py-5">
          {/* TV card */}
          <div className="overflow-hidden rounded-2xl border-2 border-red-600 bg-[#080810]">
            {/* Breaking news banner */}
            <div className="flex items-center gap-2 bg-red-600 px-3 py-1.5">
              <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white">
                Breaking News
              </span>
            </div>

            {/* Content */}
            <div className="flex items-start gap-4 p-5">
              <div className="shrink-0">
                <ComposableTurkey {...presidentConfig} sizePx={88} />
              </div>
              <div className="min-w-0 flex-1 pt-1">
                <div className="mb-2 font-mono text-[9px] uppercase tracking-[0.1em] text-red-400">
                  The President on {topicLabel}
                </div>
                <p className="font-body text-[15px] leading-snug text-white">
                  &ldquo;{statement}&rdquo;
                </p>
              </div>
            </div>

            {/* Ticker */}
            <div className="border-t border-red-600/25 bg-red-600/10 px-3 py-1.5">
              <span className="font-mono text-[9px] text-red-400">
                Live · {topicLabel.toUpperCase()} · The President Speaks
              </span>
            </div>
          </div>

          <div className="mt-5">
            <Button
              className="w-full"
              onClick={() => {
                if (isFirst) {
                  patch({ stage: "pre-post" });
                  setStage("pre-post");
                } else {
                  patch({ stage: "post-post" });
                  setStage("post-post");
                }
              }}
            >
              {isFirst ? "Write your post" : "Edit your post"}
            </Button>
          </div>
        </div>
      </Shell>
    );
  }

  if (stage === "pre-post") {
    return (
      <Shell title="Posting" onBack={undefined} step={1}>
        <PostComposer
          value={prePostText}
          onChange={setPrePostText}
          prompt={`What do you think about what The President said about ${topicLabel.toLowerCase()}?`}
          onSubmit={submitPrePost}
          submitting={submitting}
          submitLabel="Post"
        />
      </Shell>
    );
  }

  if (stage === "breathing") {
    return (
      <Shell title="Breathe" onBack={undefined} step={2}>
        <div className="flex flex-1 flex-col">
          <div className="shrink-0 px-4 pt-4">
            <p className="text-center font-body text-sm text-ink-soft">
              Take a moment. Breathe through this before you respond again.
            </p>
          </div>
          <BoxBreathing
            onComplete={async () => {
              await patch({ stage: "statement-2-loading" });
              await loadStatement(2);
            }}
          />
        </div>
      </Shell>
    );
  }

  if (stage === "post-post") {
    return (
      <Shell title="Posting" onBack={undefined} step={3}>
        <PostComposer
          value={postPostText}
          onChange={setPostPostText}
          prompt="You can edit your post now. Take your time."
          onSubmit={submitFinalPost}
          submitting={submitting}
          submitLabel="Submit"
          showOriginal={prePostText !== postPostText ? prePostText : undefined}
        />
      </Shell>
    );
  }

  if (stage === "reward" || stage === "already-complete") {
    return (
      <Shell title="Done" onBack={() => router.push("/skills")} step={4}>
        <RewardScreen feathers={feathersEarned} onDone={() => router.push("/skills")} />
      </Shell>
    );
  }

  return null;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Shell({
  title,
  onBack,
  step,
  children,
}: {
  title: string;
  onBack?: () => void;
  step: number; // 0–4
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
        <div className="flex-1 text-center font-body text-sm font-bold">{title}</div>
        <div className="h-9 w-9" />
      </div>

      {/* Progress bar (5 steps: intro, statement-1, pre-post, breathing+statement-2, post-post+reward) */}
      <div className="flex shrink-0 items-center gap-1.5 border-b border-line bg-surface px-4 py-2.5">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="flex-1">
            <div
              className={`h-1 rounded-full transition-all duration-500 ${
                n <= step ? "bg-primary" : "bg-line"
              }`}
            />
          </div>
        ))}
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

function PostComposer({
  value,
  onChange,
  prompt,
  onSubmit,
  submitting,
  submitLabel,
  showOriginal,
}: {
  value: string;
  onChange: (v: string) => void;
  prompt: string;
  onSubmit: () => void;
  submitting: boolean;
  submitLabel: string;
  showOriginal?: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const remaining   = MAX_POST_CHARS - value.length;

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  return (
    <div className="flex flex-1 flex-col justify-between px-4 py-5">
      <div className="flex flex-col gap-4">
        <p className="font-body text-sm font-semibold text-ink">{prompt}</p>

        {/* Original post reference (post-post stage) */}
        {showOriginal && (
          <div className="rounded-xl border border-line bg-bg p-3">
            <div className="mb-1 font-mono text-[9px] uppercase tracking-[0.1em] text-ink-muted">
              Your original post
            </div>
            <p className="font-body text-xs text-ink-soft">{showOriginal}</p>
          </div>
        )}

        {/* Composer */}
        <div className="overflow-hidden rounded-2xl border border-line bg-surface">
          {/* User row */}
          <div className="flex items-center gap-2.5 border-b border-line px-3 py-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-soft">
              <FlatTurkeyGlyph size={18} />
            </div>
            <span className="font-body text-xs font-semibold text-ink">You</span>
          </div>

          {/* Text area */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value.slice(0, MAX_POST_CHARS))}
            placeholder="What's on your mind?"
            rows={5}
            className="w-full resize-none bg-transparent px-3 py-3 font-body text-sm text-ink placeholder:text-ink-muted focus:outline-none"
          />

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-line px-3 py-2">
            <span
              className={`font-mono text-xs tabular-nums ${
                remaining < 20
                  ? remaining < 0
                    ? "text-plume-500"
                    : "text-golden-700"
                  : "text-ink-muted"
              }`}
            >
              {remaining}
            </span>
            <Button
              size="sm"
              disabled={!value.trim() || submitting || remaining < 0}
              loading={submitting}
              onClick={onSubmit}
            >
              {submitLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RewardScreen({ feathers, onDone }: { feathers: number; onDone: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex flex-1 flex-col items-center justify-between px-5 py-8">
      <div className="flex flex-col items-center gap-6">
        {/* Feather award */}
        <div
          className={`flex flex-col items-center gap-2 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-soft">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                fill="rgb(228 165 71)"
                stroke="rgb(228 165 71)"
                strokeWidth="1"
              />
            </svg>
          </div>
          <div className="text-center">
            <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">
              You earned
            </div>
            <div className="mt-0.5 font-display text-5xl font-bold tabular-nums text-primary">
              {feathers}
            </div>
            <div className="font-body text-base font-semibold text-ink-soft">Feathers</div>
          </div>
        </div>

        {/* Pardon point */}
        <div
          className={`flex items-center gap-2.5 rounded-2xl border border-line bg-surface px-4 py-3 transition-all duration-700 delay-300 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-forest-100">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="#1F4937" opacity="0.9" />
              <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <div className="font-body text-sm font-bold text-ink">+1 Pardon Point</div>
            <div className="font-body text-xs text-ink-muted">Skill completed</div>
          </div>
        </div>
      </div>

      <Button className="w-full" onClick={onDone}>
        Back to Skills
      </Button>
    </div>
  );
}
