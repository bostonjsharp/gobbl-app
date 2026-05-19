# UI Tweaks + Onboarding Survey — Design

**Date:** 2026-05-19
**Branch:** `ui-overhaul`
**Status:** Draft

## Overview

Three changes bundled into two sub-projects on the existing `ui-overhaul` branch:

1. **Cosmetic tweaks** — small UI corrections to the top bar and chat entry page.
2. **Onboarding survey** — a required, paginated survey shown after registration. Captures political affiliation plus two priming questions. Designed to grow (more questions, future skill-stat scoring).

These are bundled into one spec because both are UI-tier changes on the same branch and share no data dependencies.

## Sub-project 1: Cosmetic tweaks

### 1a. Top bar title

The top bar (`src/components/layout/TopAppBar.tsx`) currently switches its title based on the current route (`Chat`, `Skills`, `Shop`, etc.). The title should always read **"Gobbl"**.

**Change:** delete the `TITLES` map and `titleFor()` helper. Hardcode `"Gobbl"` in the `<h1>`.

**Risk:** none. The avatar (left) and feather balance (right) remain. Nothing else reads `TITLES` or `titleFor`.

### 1b. Chat topic section

The chat entry page (`src/app/(app)/chat/page.tsx`) renders the `TopicDropdown` component (`src/components/chat/TopicDropdown.tsx`), which currently shows category filter pills (All / Political / Social / etc.) above a `<select>` dropdown.

**Change:** remove the category filter pills (and the `category` state + `useMemo` that powers them). The `<select>` lists all topics directly. Keep the existing **"Topic"** label above the dropdown on the entry page.

**Risk:** none. The pills are presentation-only; topic data structures (`TOPICS`, `CATEGORIES`) are unchanged so other consumers are unaffected.

## Sub-project 2: Onboarding survey

### Behavior

After a user registers and signs in, they are redirected to `/onboarding/survey` and cannot reach any `(app)` route until the survey is completed. The survey is required (no skip button); the only bailout for the affiliation question is a "Prefer not to say" option.

After completion, the user is redirected to `/dashboard`. Survey responses are not editable after submission (placeholder scope — can add an edit UI later).

### Survey content

Three questions, defined in `src/lib/survey/questions.ts` as data:

```ts
export type SurveyQuestion =
  | { key: string; type: "single-choice"; prompt: string; options: { value: string; label: string }[] }
  | { key: string; type: "short-text"; prompt: string; maxLength: number };

export const SURVEY_QUESTIONS: SurveyQuestion[] = [
  {
    key: "political_affiliation",
    type: "single-choice",
    prompt: "Where do you see yourself politically?",
    options: [
      { value: "strong_left", label: "Strongly left" },
      { value: "lean_left",   label: "Lean left" },
      { value: "center",      label: "Center" },
      { value: "lean_right",  label: "Lean right" },
      { value: "strong_right",label: "Strongly right" },
      { value: "prefer_not",  label: "Prefer not to say" },
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
```

The placeholder copy can evolve in this file without touching the page or API.

### Data model

Add two fields to the `User` model in `prisma/schema.prisma`:

```prisma
surveyResponses        Json?
onboardingCompletedAt  DateTime?
```

`surveyResponses` stores the answers as `{ [questionKey]: string }`. Stable question `key`s let a future scoring function read responses by name without schema churn.

`onboardingCompletedAt` is the gate flag and the timestamp in one — null means the user hasn't completed the survey.

This mirrors the existing `equippedCosmetics: Json?` pattern on the same model.

### Routing

- **New:** `src/app/onboarding/survey/page.tsx` — outside the `(app)` route group so it gets a clean layout without the `TopAppBar` / `BottomNav`. Client component, paginated stepper.
- **New:** `src/app/api/onboarding/survey/route.ts` — `POST` accepts `{ responses: Record<string, string> }`, validates against `SURVEY_QUESTIONS`, writes to the authenticated user, and sets `onboardingCompletedAt = now()`.

### Gating (middleware)

The `(app)/layout.tsx` is a client component and can't gate server-side cleanly. Use Next.js middleware instead.

- Add `onboardingCompletedAt` to the NextAuth JWT in `src/lib/auth.ts`:
  - In the `jwt` callback, when `user` is present (initial sign-in), read `onboardingCompletedAt` from the DB by user ID and put it on the token. This is one extra DB call per sign-in, which is acceptable.
  - After the user completes the survey, the page calls `useSession().update({ onboardingCompletedAt: <iso string> })`. The `jwt` callback handles `trigger === "update"` by merging the new value into the token. This refreshes the token client-side without needing the user to sign out and back in.
- **New:** `src/middleware.ts` — matches all routes inside the `(app)` route group. If `req.nextauth.token.onboardingCompletedAt` is missing, redirect to `/onboarding/survey`. Use `withAuth` from `next-auth/middleware` so it also enforces authentication.
- The `/onboarding/survey` route itself requires auth but explicitly bypasses the completion check.

### Survey UI — paginated stepper

`/onboarding/survey/page.tsx` renders one question at a time:

- Header: "Quick intro questions" + subtitle
- Progress indicator: dot row showing current step (e.g. `● ● ○` for step 2 of 3)
- Current question prompt
- Input control:
  - `single-choice` → a vertical list of large tappable option rows (matches the mobile theme used elsewhere in the app)
  - `short-text` → a labeled `<textarea>` with character counter
- Footer: **Back** button (disabled on first step) and **Next** button (disabled until current question has a valid answer). Final step's button reads **Finish**.

State is held in component state as `Record<questionKey, answer>`. On **Finish**, `POST` to `/api/onboarding/survey`, then `update()` the session, then `router.push("/dashboard")`.

No skip. If the user closes the tab mid-survey, on next visit middleware sends them back to `/onboarding/survey` and they start over (acceptable for a placeholder; can persist partial state later if drop-off becomes a problem).

### Edge cases

- **Existing users without `onboardingCompletedAt`** — the field will be null after the migration. They'll be redirected into the survey the next time they navigate to an `(app)` route. Acceptable: this is a development branch and existing users are test accounts.
- **Re-submission** — the API route rejects with 409 if `onboardingCompletedAt` is already set on the user. Prevents accidental overwrites if the page is re-submitted; we'll lift this restriction when the editable-from-profile feature lands.
- **Empty/invalid responses** — the API validates that every `SURVEY_QUESTIONS` key has an answer, that single-choice answers match a known `value`, and that short-text answers respect `maxLength`. Returns 400 with a per-question error map on failure; the client surfaces inline errors.

### Out of scope (explicitly)

- Skill-stat scoring from survey responses (deferred until skill stats land — storage format is forward-compatible).
- Editing/retaking the survey from the profile page.
- Multi-survey support (more than one survey instance per user).
- A scoring stub file — would be dead code.

## File summary

```
modified:
  prisma/schema.prisma                       (+2 fields on User)
  src/lib/auth.ts                            (jwt callback adds onboardingCompletedAt)
  src/components/layout/TopAppBar.tsx        (hardcoded title)
  src/components/chat/TopicDropdown.tsx      (drop category pills)

new:
  src/middleware.ts
  src/lib/survey/questions.ts
  src/app/onboarding/survey/page.tsx
  src/app/api/onboarding/survey/route.ts
  docs/superpowers/specs/2026-05-19-ui-tweaks-and-onboarding-survey-design.md   (this file)
```

## Testing

- Manual: register a new account → confirm redirect to `/onboarding/survey` → complete all 3 questions → confirm redirect to `/dashboard` → confirm top bar reads "Gobbl" on every route → confirm chat entry page shows the topic dropdown without category pills.
- Manual: log out / log in with the same user → confirm no survey re-prompt.
- Manual: attempt to navigate to `/dashboard` directly without completing → confirm redirect to `/onboarding/survey`.
- Manual: attempt to POST `/api/onboarding/survey` twice → confirm second call returns 409.
