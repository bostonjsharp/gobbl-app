"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/Button";
import {
  SURVEY_QUESTIONS,
  isAnswerValid,
  type SurveyQuestion,
  type RankedChoiceQuestion,
} from "@/lib/survey/questions";

export default function OnboardingSurveyPage() {
  const { update } = useSession();
  const [step, setStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const question = SURVEY_QUESTIONS[step];
  const isLast = step === SURVEY_QUESTIONS.length - 1;
  const currentAnswer = responses[question.key] ?? "";
  const canAdvance = isAnswerValid(question, currentAnswer);

  function setAnswer(value: string) {
    setResponses((prev) => ({ ...prev, [question.key]: value }));
  }

  async function handleNext() {
    if (!isLast) {
      setStep((s) => s + 1);
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/onboarding/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responses }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Could not save survey");
        setSubmitting(false);
        return;
      }
      await update({ onboardingCompletedAt: data.onboardingCompletedAt });
      window.location.href = "/dashboard";
    } catch {
      setError("Network error");
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-roost-50 px-4 py-16">
      <div className="w-full max-w-md">
        <header className="mb-6 text-center">
          <h1 className="font-display text-2xl font-bold text-roost-700">
            Quick intro
          </h1>
          <p className="mt-1 text-sm text-roost-500">
            A few questions before you start.
          </p>
        </header>

        <ProgressDots total={SURVEY_QUESTIONS.length} current={step} />

        <div className="mt-8">
          <h2 className="mb-4 font-display text-lg font-semibold text-roost-700">
            {question.prompt}
          </h2>
          <QuestionInput
            question={question}
            value={currentAnswer}
            onChange={setAnswer}
          />
        </div>

        {error && <p className="mt-4 text-sm text-plume-500">{error}</p>}

        <div className="mt-8 flex justify-between gap-3">
          <Button
            variant="secondary"
            disabled={step === 0 || submitting}
            onClick={() => setStep((s) => s - 1)}
          >
            Back
          </Button>
          <Button disabled={!canAdvance || submitting} onClick={handleNext}>
            {submitting ? "Saving..." : isLast ? "Finish" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ProgressDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`h-2 w-2 rounded-full transition-colors ${
            i <= current ? "bg-gobbl-500" : "bg-roost-200"
          }`}
        />
      ))}
    </div>
  );
}

function QuestionInput({
  question,
  value,
  onChange,
}: {
  question: SurveyQuestion;
  value: string;
  onChange: (v: string) => void;
}) {
  if (question.type === "single-choice") {
    return (
      <div className="flex flex-col gap-2">
        {question.options.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`rounded-xl border-2 px-4 py-3 text-left text-sm font-semibold transition-colors ${
                selected
                  ? "border-gobbl-500 bg-gobbl-500/10 text-gobbl-700"
                  : "border-roost-200 bg-white text-roost-700 hover:border-gobbl-300"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    );
  }

  if (question.type === "ranked-choice") {
    return <RankedChoiceInput question={question} value={value} onChange={onChange} />;
  }

  return (
    <div className="flex flex-col gap-1">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, question.maxLength))}
        maxLength={question.maxLength}
        rows={3}
        className="rounded-xl border-2 border-roost-200 bg-white px-md py-3 text-sm text-roost-700 focus:border-gobbl-500 focus:outline-none"
        placeholder="Type your answer…"
      />
      <span className="text-right text-xs text-roost-400">
        {value.length}/{question.maxLength}
      </span>
    </div>
  );
}

function RankedChoiceInput({
  question,
  value,
  onChange,
}: {
  question: RankedChoiceQuestion;
  value: string;
  onChange: (v: string) => void;
}) {
  const defaultOrder = question.items.map((i) => i.value);
  let currentOrder: string[];
  try {
    const parsed: unknown = JSON.parse(value);
    currentOrder = Array.isArray(parsed) ? (parsed as string[]) : defaultOrder;
  } catch {
    currentOrder = defaultOrder;
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = currentOrder.indexOf(active.id as string);
      const newIndex = currentOrder.indexOf(over.id as string);
      const next = arrayMove(currentOrder, oldIndex, newIndex);
      onChange(JSON.stringify(next));
    }
  }

  const itemMap = Object.fromEntries(question.items.map((i) => [i.value, i]));

  // Emit the default order on first render so the answer is immediately valid
  if (!value) {
    onChange(JSON.stringify(defaultOrder));
  }

  return (
    <div className="flex flex-col gap-1">
      <p className="mb-2 text-xs text-roost-400">
        Drag to reorder — #1 is who you&apos;d most like to talk to.
      </p>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={currentOrder} strategy={verticalListSortingStrategy}>
          {currentOrder.map((val, idx) => {
            const item = itemMap[val];
            return (
              <SortableItem key={val} id={val} rank={idx + 1} label={item.label} sublabel={item.sublabel} />
            );
          })}
        </SortableContext>
      </DndContext>
    </div>
  );
}

function SortableItem({
  id,
  rank,
  label,
  sublabel,
}: {
  id: string;
  rank: number;
  label: string;
  sublabel?: string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`flex cursor-grab touch-none items-center gap-3 rounded-xl border-2 bg-white px-4 py-3 transition-shadow active:cursor-grabbing ${
        isDragging
          ? "border-gobbl-500 shadow-lg opacity-80"
          : "border-roost-200 hover:border-gobbl-300"
      }`}
    >
      <span className="w-5 shrink-0 text-center text-xs font-bold text-gobbl-500">
        {rank}
      </span>
      <div className="flex-1 min-w-0">
        <span className="text-sm font-semibold text-roost-700">{label}</span>
        {sublabel && (
          <span className="ml-2 text-xs text-roost-400">{sublabel}</span>
        )}
      </div>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="shrink-0 text-roost-300">
        <circle cx="5" cy="4" r="1.5" />
        <circle cx="11" cy="4" r="1.5" />
        <circle cx="5" cy="8" r="1.5" />
        <circle cx="11" cy="8" r="1.5" />
        <circle cx="5" cy="12" r="1.5" />
        <circle cx="11" cy="12" r="1.5" />
      </svg>
    </div>
  );
}
