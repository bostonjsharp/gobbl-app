"use client";

import { useEffect, useRef, useState } from "react";

const BOX_SIZE = 200;
const TICKS_PER_PHASE = 40; // 40 × 100ms = 4 s
const PHASES_PER_CYCLE = 4;
const TOTAL_CYCLES = 4;
const TOTAL_TICKS = TOTAL_CYCLES * PHASES_PER_CYCLE * TICKS_PER_PHASE; // 640

const PHASE_META = [
  { label: "Inhale",  color: "#1F4937" }, // forest
  { label: "Hold",    color: "#E4A547" }, // ochre
  { label: "Exhale",  color: "#8B6914" }, // gobbl
  { label: "Hold",    color: "#E4A547" }, // ochre
] as const;

function dotPosition(tick: number): { x: number; y: number } {
  const phase = Math.floor((tick % (PHASES_PER_CYCLE * TICKS_PER_PHASE)) / TICKS_PER_PHASE);
  const progress = (tick % TICKS_PER_PHASE) / (TICKS_PER_PHASE - 1);
  switch (phase) {
    case 0: return { x: progress * BOX_SIZE, y: 0 };
    case 1: return { x: BOX_SIZE, y: progress * BOX_SIZE };
    case 2: return { x: BOX_SIZE - progress * BOX_SIZE, y: BOX_SIZE };
    case 3: return { x: 0, y: BOX_SIZE - progress * BOX_SIZE };
    default: return { x: 0, y: 0 };
  }
}

export function BoxBreathing({ onComplete }: { onComplete: () => void }) {
  const [tick, setTick] = useState(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const id = setInterval(() => {
      setTick((t) => {
        const next = t + 1;
        if (next >= TOTAL_TICKS) {
          clearInterval(id);
          onCompleteRef.current();
          return t;
        }
        return next;
      });
    }, 100);
    return () => clearInterval(id);
  }, []);

  const phaseIndex = Math.floor((tick % (PHASES_PER_CYCLE * TICKS_PER_PHASE)) / TICKS_PER_PHASE);
  const tickInPhase = tick % TICKS_PER_PHASE;
  const cycle = Math.floor(tick / (PHASES_PER_CYCLE * TICKS_PER_PHASE));
  const secondsLeft = Math.ceil((TICKS_PER_PHASE - tickInPhase) / 10);
  const phase = PHASE_META[phaseIndex];
  const { x, y } = dotPosition(tick);

  return (
    <div className="flex flex-col items-center gap-8 px-4 py-6">
      <div className="text-center">
        <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">
          Cycle {cycle + 1} of {TOTAL_CYCLES}
        </div>
        <div
          className="mt-1 font-display text-2xl font-bold tracking-[-0.02em] transition-colors duration-300"
          style={{ color: phase.color }}
        >
          {phase.label}
        </div>
        <div className="mt-0.5 font-mono text-4xl font-bold tabular-nums text-ink">
          {secondsLeft}
        </div>
      </div>

      {/* Box */}
      <div
        className="relative shrink-0 rounded-2xl border-2 border-line bg-surface"
        style={{ width: BOX_SIZE + 32, height: BOX_SIZE + 32 }}
      >
        {/* Dot — positioned relative to the inner BOX_SIZE area (16px padding each side) */}
        <div
          className="absolute h-4 w-4 rounded-full shadow-md transition-colors duration-300"
          style={{
            left: x + 16,
            top: y + 16,
            transform: "translate(-50%, -50%)",
            backgroundColor: phase.color,
          }}
        />
      </div>

      <p className="text-center font-body text-sm text-ink-soft">
        Breathe with the dot as it travels around the box.
      </p>
    </div>
  );
}
