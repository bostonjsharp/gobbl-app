# UI Tweaks + Onboarding Survey Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hardcode the top bar to "Gobbl", strip category pills from the chat topic section, and add a required onboarding survey gated by NextAuth middleware.

**Architecture:** Two cosmetic edits in existing client components. New onboarding flow uses a `surveyResponses` JSON column + `onboardingCompletedAt` timestamp on `User`, a paginated stepper page at `/onboarding/survey`, a `POST /api/onboarding/survey` endpoint, and Next.js middleware that reads `onboardingCompletedAt` from the NextAuth JWT to redirect un-onboarded users.

**Tech Stack:** Next.js 14 (App Router, client components), React 18, TypeScript, Tailwind CSS, Prisma + PostgreSQL, NextAuth v4 (JWT strategy).

**Spec reference:** `docs/superpowers/specs/2026-05-19-ui-tweaks-and-onboarding-survey-design.md`

**Testing note:** This project has no automated test framework configured (no `test` script in `package.json`). Verification is via `npm run dev` and a browser. Each task includes a concrete manual verification step.

---

## Task 1: Hardcode top bar title to "Gobbl"

**Files:**
- Modify: `src/components/layout/TopAppBar.tsx`

- [ ] **Step 1: Edit TopAppBar.tsx**

Replace the entire file contents with:

```tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { TurkeyAvatar } from "@/components/gamification/TurkeyAvatar";
import type { EquippedCosmetics } from "@/lib/shop";

interface UserSummary {
  level: number;
  featherBalance: number;
  equippedCosmetics: EquippedCosmetics;
}

export function TopAppBar() {
  const { status } = useSession();
  const [user, setUser] = useState<UserSummary | null>(null);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/user")
      .then((r) => r.json())
      .then((data) =>
        setUser({
          level: data.level,
          featherBalance: data.featherBalance,
          equippedCosmetics: data.equippedCosmetics,
        }),
      )
      .catch(() => {});
  }, [status]);

  return (
    <header className="sticky top-0 z-40 flex h-[72px] items-center justify-between bg-roost-50 px-margin-mobile shadow-[0px_4px_12px_rgba(141,110,99,0.12)]">
      <Link href="/profile" className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gobbl-500/20 overflow-hidden">
        {user ? (
          <TurkeyAvatar level={user.level} size="sm" equipped={user.equippedCosmetics} animate={false} />
        ) : (
          <span className="text-xl">🥚</span>
        )}
      </Link>
      <h1 className="font-display text-2xl font-bold tracking-tight text-gobbl-500">
        Gobbl
      </h1>
      <Link
        href="/shop"
        className="flex items-center gap-1 rounded-full bg-roost-100 px-3 py-1.5 font-display text-sm font-semibold text-gobbl-500 transition-colors hover:bg-roost-200"
      >
        <span>{(user?.featherBalance ?? 0).toLocaleString()}</span>
        <span>🪶</span>
      </Link>
    </header>
  );
}
```

Note: removed the `usePathname` import, `TITLES` map, and `titleFor` helper — they were only used for the dynamic title.

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Verify in browser**

Run `npm run dev` if not already running. Sign in. Navigate between `/dashboard`, `/chat`, `/skills`, `/shop`, `/profile`, `/leaderboard`. Confirm the top bar reads **"Gobbl"** on every page.

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/TopAppBar.tsx
git commit -m "feat(topbar): always display 'Gobbl' regardless of route"
```

---

## Task 2: Remove category filter pills from TopicDropdown

**Files:**
- Modify: `src/components/chat/TopicDropdown.tsx`

- [ ] **Step 1: Edit TopicDropdown.tsx**

Replace the entire file contents with:

```tsx
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
```

Note: removed the `CATEGORIES`/`Topic` imports, `category` state, `useState`/`useMemo`, and the filter pill row. Added `w-full` to the `<select>` so it fills the section now that no pills constrain layout.

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Verify in browser**

In the dev server, navigate to `/chat`. Confirm the Topic section shows only the **"Topic"** label and the dropdown — no category filter pills (All / Political / etc.). Open the dropdown and confirm all topics are listed. Pick a difficulty and a topic; confirm the **"Start debate"** button enables and routes to `/chat/setup`.

- [ ] **Step 4: Commit**

```bash
git add src/components/chat/TopicDropdown.tsx
git commit -m "feat(chat): drop category filter pills from topic dropdown"
```

---

## Task 3: Add survey fields to User schema

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: Add the two new fields**

In `prisma/schema.prisma`, locate the `User` model. Add these two fields just after the existing `equippedCosmetics  Json?` line:

```prisma
  surveyResponses        Json?
  onboardingCompletedAt  DateTime?
```

The final `User` model should look like:

```prisma
model User {
  id                     String          @id @default(cuid())
  username               String          @unique
  passwordHash           String
  xp                     Int             @default(0)
  featherBalance         Int             @default(0)
  level                  Int             @default(1)
  civilityScore          Float           @default(0)
  currentStreak          Int             @default(0)
  longestStreak          Int             @default(0)
  lastActiveDate         DateTime?
  equippedCosmetics      Json?
  surveyResponses        Json?
  onboardingCompletedAt  DateTime?
  createdAt              DateTime        @default(now())
  debates                Debate[]
  badges                 UserBadge[]
  inventory              UserInventory[]
}
```

- [ ] **Step 2: Push the schema to the database and regenerate the client**

Run: `npm run db:push`
Expected: Prisma reports that the database is now in sync and the client is regenerated. No interactive prompts.

If the command asks for confirmation about data loss (it should NOT — both new fields are optional), abort and re-check that both fields end with `?`.

- [ ] **Step 3: Verify TypeScript picks up the new fields**

Run: `npx tsc --noEmit`
Expected: no errors. The generated Prisma client now includes the two new optional fields on `User`.

- [ ] **Step 4: Commit**

```bash
git add prisma/schema.prisma
git commit -m "feat(db): add surveyResponses and onboardingCompletedAt to User"
```

---

## Task 4: Put `onboardingCompletedAt` on the NextAuth JWT

**Files:**
- Modify: `src/lib/auth.ts`

- [ ] **Step 1: Update auth.ts**

Replace the entire file contents with:

```ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./db";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
        });
        if (!user) return null;

        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) return null;

        return { id: user.id, name: user.username };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { onboardingCompletedAt: true },
        });
        token.onboardingCompletedAt = dbUser?.onboardingCompletedAt?.toISOString() ?? null;
      }
      if (trigger === "update" && session && typeof session === "object") {
        const next = (session as { onboardingCompletedAt?: string }).onboardingCompletedAt;
        if (next) token.onboardingCompletedAt = next;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
```

The changes are:
1. `jwt` callback now also loads `onboardingCompletedAt` from the DB on initial sign-in.
2. `jwt` callback handles `trigger === "update"` to refresh the token after the user completes the survey.

The cast pattern follows the existing `(session.user as { id?: string }).id = ...` style — no module augmentation needed.

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Verify nothing breaks at runtime**

Restart `npm run dev` (the auth module is loaded at startup). Sign out and sign back in with an existing account. Confirm dashboard loads normally — no token errors in the browser or server console.

The middleware that *uses* this new token field will be added in Task 8, so for now this change is invisible at runtime.

- [ ] **Step 4: Commit**

```bash
git add src/lib/auth.ts
git commit -m "feat(auth): include onboardingCompletedAt on JWT"
```

---

## Task 5: Define survey questions as config

**Files:**
- Create: `src/lib/survey/questions.ts`

- [ ] **Step 1: Create the questions config file**

Create `src/lib/survey/questions.ts` with:

```ts
export type SingleChoiceQuestion = {
  key: string;
  type: "single-choice";
  prompt: string;
  options: { value: string; label: string }[];
};

export type ShortTextQuestion = {
  key: string;
  type: "short-text";
  prompt: string;
  maxLength: number;
};

export type SurveyQuestion = SingleChoiceQuestion | ShortTextQuestion;

export const SURVEY_QUESTIONS: SurveyQuestion[] = [
  {
    key: "political_affiliation",
    type: "single-choice",
    prompt: "Where do you see yourself politically?",
    options: [
      { value: "strong_left",  label: "Strongly left" },
      { value: "lean_left",    label: "Lean left" },
      { value: "center",       label: "Center" },
      { value: "lean_right",   label: "Lean right" },
      { value: "strong_right", label: "Strongly right" },
      { value: "prefer_not",   label: "Prefer not to say" },
    ],
  },
  {
    key: "discuss_frequency",
    type: "single-choice",
    prompt: "How often do you discuss politics with people who disagree with you?",
    options: [
      { value: "never",     label: "Never" },
      { value: "rarely",    label: "Rarely" },
      { value: "sometimes", label: "Sometimes" },
      { value: "often",     label: "Often" },
    ],
  },
  {
    key: "top_issue",
    type: "short-text",
    prompt: "What issue matters most to you right now?",
    maxLength: 120,
  },
];

export function isAnswerValid(question: SurveyQuestion, answer: string | undefined): boolean {
  if (!answer) return false;
  if (question.type === "single-choice") {
    return question.options.some((opt) => opt.value === answer);
  }
  return answer.length > 0 && answer.length <= question.maxLength;
}
```

`isAnswerValid` will be used by both the UI (to enable/disable Next) and the API route (to validate the submission).

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/survey/questions.ts
git commit -m "feat(survey): add onboarding question definitions"
```

---

## Task 6: Add the survey submission API route

**Files:**
- Create: `src/app/api/onboarding/survey/route.ts`

- [ ] **Step 1: Create the API route**

Create `src/app/api/onboarding/survey/route.ts` with:

```ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { SURVEY_QUESTIONS, isAnswerValid } from "@/lib/survey/questions";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { responses?: Record<string, string> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const responses = body?.responses ?? {};

  const fieldErrors: Record<string, string> = {};
  for (const question of SURVEY_QUESTIONS) {
    const answer = responses[question.key];
    if (!isAnswerValid(question, answer)) {
      fieldErrors[question.key] = "Required";
    }
  }
  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json(
      { error: "Validation failed", fieldErrors },
      { status: 400 },
    );
  }

  const existing = await prisma.user.findUnique({
    where: { id: userId },
    select: { onboardingCompletedAt: true },
  });
  if (existing?.onboardingCompletedAt) {
    return NextResponse.json(
      { error: "Survey already completed" },
      { status: 409 },
    );
  }

  const now = new Date();
  await prisma.user.update({
    where: { id: userId },
    data: {
      surveyResponses: responses,
      onboardingCompletedAt: now,
    },
  });

  return NextResponse.json({ onboardingCompletedAt: now.toISOString() });
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Smoke-test the endpoint manually**

Restart the dev server. While signed in, open the browser dev tools console and run:

```js
fetch("/api/onboarding/survey", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ responses: {} }),
}).then(r => r.json()).then(console.log);
```

Expected: `{ error: "Validation failed", fieldErrors: { political_affiliation: "Required", discuss_frequency: "Required", top_issue: "Required" } }` with HTTP 400.

Then run a valid submission:

```js
fetch("/api/onboarding/survey", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ responses: { political_affiliation: "center", discuss_frequency: "sometimes", top_issue: "test" } }),
}).then(r => r.json()).then(console.log);
```

Expected: `{ onboardingCompletedAt: "<iso string>" }` with HTTP 200.

Run it a second time. Expected: `{ error: "Survey already completed" }` with HTTP 409.

After confirming, **manually reset the test user** so subsequent tasks can re-test the flow:

```bash
npx prisma studio
```

In Prisma Studio, find your test user row and clear `surveyResponses` and `onboardingCompletedAt` to null. Save.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/onboarding/survey/route.ts
git commit -m "feat(survey): add POST /api/onboarding/survey"
```

---

## Task 7: Build the paginated survey page

**Files:**
- Create: `src/app/onboarding/survey/page.tsx`

- [ ] **Step 1: Create the survey page**

Create `src/app/onboarding/survey/page.tsx` with:

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import {
  SURVEY_QUESTIONS,
  isAnswerValid,
  type SurveyQuestion,
} from "@/lib/survey/questions";

export default function OnboardingSurveyPage() {
  const router = useRouter();
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
      router.push("/dashboard");
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
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Verify the page renders manually**

In the dev server, navigate directly to `/onboarding/survey` (you must be signed in). Confirm:

- Page renders with three progress dots, the first filled in gobbl-500
- Step 1 shows political affiliation with 6 option buttons
- Selecting an option highlights it
- **Next** button is disabled until an option is selected
- **Back** button is disabled on step 1
- Clicking Next advances to step 2 (discuss frequency, 4 options)
- Clicking Next advances to step 3 (short-text textarea with char counter)
- The textarea enforces 120 chars
- On step 3, button text changes to **Finish**
- Clicking Finish submits and redirects to `/dashboard`
- Once back on `/dashboard`, manually re-visit `/onboarding/survey` and confirm it loads — the gate doesn't exist yet, so the page is accessible. (The gate lands in Task 8.)

Reset the test user via Prisma Studio (clear `surveyResponses` and `onboardingCompletedAt`) before moving on.

- [ ] **Step 4: Commit**

```bash
git add src/app/onboarding/survey/page.tsx
git commit -m "feat(survey): add paginated onboarding survey page"
```

---

## Task 8: Gate `(app)` routes with middleware

**Files:**
- Create: `src/middleware.ts`

- [ ] **Step 1: Create the middleware**

Create `src/middleware.ts` with:

```ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth;
    const { pathname } = req.nextUrl;

    if (pathname.startsWith("/onboarding/")) {
      return NextResponse.next();
    }

    if (!token?.onboardingCompletedAt) {
      const url = req.nextUrl.clone();
      url.pathname = "/onboarding/survey";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  },
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/chat/:path*",
    "/skills/:path*",
    "/shop/:path*",
    "/profile/:path*",
    "/leaderboard/:path*",
    "/onboarding/:path*",
  ],
};
```

`withAuth` from `next-auth/middleware` enforces that the user is signed in (redirecting to `/` if not) before our function runs. The function then checks the survey completion flag from the token.

Including `/onboarding/:path*` in the matcher means signed-out users hitting `/onboarding/survey` directly are bounced to `/` by `withAuth` (good); signed-in users with completed surveys bouncing back to `/onboarding/survey` after completion is also blocked by the early `pathname.startsWith("/onboarding/")` return (also good).

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Restart the dev server**

Middleware changes require restarting `npm run dev`. Stop and restart.

- [ ] **Step 4: End-to-end verification**

Confirm the test user still has `onboardingCompletedAt = null` (use Prisma Studio if unsure). Then:

1. Sign in as the test user. Expected: you are redirected to `/onboarding/survey`.
2. Try navigating directly to `/dashboard`. Expected: redirected back to `/onboarding/survey`.
3. Try `/chat`, `/profile`, `/shop`, `/skills`, `/leaderboard` directly. Expected: each redirects to `/onboarding/survey`.
4. Complete the survey. Expected: redirected to `/dashboard`, page loads normally.
5. Now navigate to `/onboarding/survey` directly. Expected: the page still renders (we don't actively bounce completed users off the page). The API call would 409 if they tried to re-submit. Acceptable for now per the spec.
6. Sign out, sign back in. Expected: lands on `/dashboard` directly (no survey re-prompt) because `onboardingCompletedAt` is now persisted and loaded by the `jwt` callback.
7. Register a brand new user via `/`. Expected: after registration completes, the auto-signIn lands them on `/dashboard` momentarily, then middleware redirects them to `/onboarding/survey`. Complete it. Expected: routed to `/dashboard`.

- [ ] **Step 5: Commit**

```bash
git add src/middleware.ts
git commit -m "feat(onboarding): gate app routes on survey completion"
```

---

## Task 9: Final sweep

- [ ] **Step 1: Confirm top-bar tweak holds across new routes**

Visit `/dashboard`, `/chat`, `/skills`, `/shop`, `/profile`, `/leaderboard`. Confirm the title is **"Gobbl"** on every page.

- [ ] **Step 2: Confirm chat topic section**

Visit `/chat`. Confirm the Topic section shows only the **"Topic"** label and the dropdown — no category pills.

- [ ] **Step 3: Confirm onboarding gate**

Use Prisma Studio to set `onboardingCompletedAt = null` on the test user, sign out, sign in. Confirm immediate redirect to `/onboarding/survey`. Complete it. Confirm reroute to `/dashboard`.

- [ ] **Step 4: Confirm linting passes**

Run: `npm run lint`
Expected: no errors. Fix any reported issues in the touched files before considering the plan complete.

- [ ] **Step 5: Confirm production build succeeds**

Run: `npm run build`
Expected: build completes without errors. (This also re-runs `prisma db push` which should be a no-op.)

No final commit unless step 4 produced lint fixes.

---

## File summary

```
new:
  src/lib/survey/questions.ts                              (Task 5)
  src/app/api/onboarding/survey/route.ts                   (Task 6)
  src/app/onboarding/survey/page.tsx                       (Task 7)
  src/middleware.ts                                        (Task 8)

modified:
  src/components/layout/TopAppBar.tsx                      (Task 1)
  src/components/chat/TopicDropdown.tsx                    (Task 2)
  prisma/schema.prisma                                     (Task 3)
  src/lib/auth.ts                                          (Task 4)
```
