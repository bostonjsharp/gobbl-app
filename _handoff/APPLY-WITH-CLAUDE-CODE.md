# Applying this handoff with Claude Code

## TL;DR

1. **Drop the entire `_handoff/` folder into your repo root.**
2. **From the repo root, run `claude`.**
3. **Paste the prompt below in one message.** Don't paraphrase — Claude Code follows it most reliably verbatim.
4. **Review the diffs, accept the ones you like, then commit.**

---

## The prompt

Copy everything between the lines and paste it into Claude Code:

---

```
I have a design-system migration bundle at `_handoff/` in this repo. It contains
port-ready Next.js files plus an HTML/JSX design reference. Your job is to apply
it to this codebase in two passes, verifying after each.

START BY READING:
  1. _handoff/README.md  (full migration spec — token map, screen behavior, backend changes)
  2. _handoff/design-references/Gobbl UI.html  (open in a browser if you can; otherwise
     skim the inline JSX in _handoff/design-references/harvest*.jsx for visual specs)

THEN DO THIS IN ORDER:

──── PASS 1 · FOUNDATION ────────────────────────────────────────────────

Replace or add these files, copying from `_handoff/` to the same path in the repo:

  REPLACE  tailwind.config.ts
  REPLACE  src/app/layout.tsx
  REPLACE  src/app/globals.css
  REPLACE  src/components/ui/Button.tsx
  REPLACE  src/components/ui/Card.tsx
  REPLACE  src/components/ui/Input.tsx
  NEW      src/components/ui/Badge.tsx
  NEW      src/components/ui/Chip.tsx
  NEW      src/components/gamification/FlatTurkey.tsx

Then:
  - Run `npm run build` (or `npm run dev` if build is slow) and confirm it compiles.
  - Do NOT touch any other file in this pass.
  - If `<Card>` was called with old props like `glow` or `hover` somewhere, the new
    `<Card>` API supports `hover` and adds `active`, `inverted`, `bare`. `glow` is
    gone — fix any callsite errors by removing it (it was decorative).

REPORT BEFORE CONTINUING: One-line summary of what changed in Pass 1 + the build status.

──── PASS 2 · SCREENS ──────────────────────────────────────────────────

Now replace or add the screen-level files:

  REPLACE  src/components/layout/BottomNav.tsx
  REPLACE  src/components/layout/TopAppBar.tsx

  REPLACE  src/components/gamification/XPBar.tsx
  REPLACE  src/components/gamification/StreakCounter.tsx
  NEW      src/components/gamification/LevelUpModal.tsx

  REPLACE  src/components/dashboard/StatsCard.tsx
  REPLACE  src/components/dashboard/DailyChallenge.tsx

  REPLACE  src/components/chat/ChatInterface.tsx
  REPLACE  src/components/chat/MessageBubble.tsx

  NEW      src/lib/prompts/flipBelief.ts

  REPLACE  src/app/(app)/dashboard/page.tsx
  REPLACE  src/app/(app)/profile/page.tsx
  REPLACE  src/app/(app)/skills/page.tsx
  REPLACE  src/app/(app)/shop/page.tsx
  REPLACE  src/app/(app)/chat/page.tsx
  REPLACE  src/app/(app)/chat/setup/page.tsx
  REPLACE  src/app/(app)/chat/[id]/page.tsx

Then make these BACKEND adjustments (see _handoff/README.md "Backend changes needed"):

  1. In `src/app/api/user/route.ts`, add `beliefKey: user.beliefKey` to the
     JSON response so the client can compute Robert's flipped politics.

  2. In `src/app/api/debates/route.ts`, compute the debate's beliefKey on
     the server using `flipBelief(user.beliefKey)` from the new lib file,
     instead of trusting the client-sent value. (Client still sends it as
     a hint, but server should overwrite.)

Then audit and tidy:

  - Search the project for `<TurkeyAvatar` usages. The new `<FlatTurkey>` is
    the replacement. Most callsites should now use FlatTurkey via the new
    page files; if any other component still imports TurkeyAvatar, list them
    so I can decide whether to migrate or keep both during a transition.

  - Search for any remaining `material-symbols-outlined` class usage. The
    new code uses inline SVG. List files that still depend on it.

  - Search for imports of `DifficultyPicker` or `TopicDropdown`. The new
    `/chat/page.tsx` doesn't use them. If they're orphaned, list them for
    deletion (don't delete unless I confirm).

  - Search for any compile errors or TypeScript issues introduced by the
    new code; fix obvious ones (missing `formatTopicForDebate` import etc.).

Finally:
  - Run `npm run build` and confirm it compiles cleanly.
  - Run `npm run dev` and confirm at minimum the /dashboard and /chat routes load.

REPORT AT END:
  - One-line summary of what changed in Pass 2
  - Build status
  - Any orphaned files (TurkeyAvatar, DifficultyPicker, TopicDropdown, Icon
    component if unused) that I should decide on
  - Any TODOs you skipped — e.g. if `BELIEFS["lean-left"]` typos or
    `beliefKey` not yet on the User Prisma model

CONSTRAINTS:
  - Do not invent visual changes. The design references and the port-ready
    files in _handoff/ are the source of truth.
  - Preserve all data plumbing (useSession, useRouter redirects, fetch
    calls, loading states) — the port-ready pages already match the existing
    API shape, you just need to copy them.
  - Do NOT delete `src/components/gamification/TurkeyAvatar.tsx` even if it
    becomes orphaned. Flag it; I'll decide.
  - Don't run database migrations. The only DB-level change `beliefKey` on
    User already exists in the onboarding flow.
```

---

## After Claude Code finishes

1. **Verify the screens look right.** Visit `/dashboard`, `/profile`, `/skills`, `/shop`, `/chat`. Pull up the `_handoff/design-references/Gobbl UI.html` design canvas side-by-side as a reference.

2. **Test the level-up modal.** Manually edit `sessionStorage["gobbl:lastLevel"]` in dev tools to a value lower than your current level, refresh `/dashboard`, and the modal should appear.

3. **Test a debate end-to-end.** `/chat` → pick a topic → pick difficulty → confirm Robert's politics are auto-set in the green note → start → exchange messages → finish.

4. **If something looks off**, drop the screenshot back to the chat thread that produced this handoff and I'll patch the port-ready file.

## What's intentionally NOT in this package

- `/leaderboard` — kept as-is. If you want it styled too, ask in chat and I'll add it.
- `/onboarding/survey` — kept as-is. Setting `beliefKey` there is already wired.
- The `Icon.tsx` primitive — all new code uses inline SVG. If anything outside the migrated files still uses it, it'll keep working until you migrate those screens.
- Marketing pages (`/`, `/login`, `/register`) — only the authenticated app surfaces are touched.
- Animations beyond the four declared in tailwind.config (`fade-in`, `slide-up`, `level-pulse`, `score-tick`, `shimmer`). If you want spring-based interactions later, layer in Framer Motion separately.
