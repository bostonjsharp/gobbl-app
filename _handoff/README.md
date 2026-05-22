# Gobbl — Harvest direction · Full UI implementation handoff

This package contains everything Claude Code needs to migrate the Gobbl Next.js app from its current "warm Material" look to the **Harvest** design direction: confident terracotta + ochre + forest, Bricolage Grotesque display, DM Sans body, and flat illustrated turkeys.

## About the files in this bundle

This bundle contains **two kinds** of files:

1. **Port-ready Next.js source** under `src/` and `tailwind.config.ts` — these are drop-in replacements written in TypeScript with Tailwind, against your existing API shape (`/api/user`, `/api/shop`, `/api/debates`, `/api/chat`). Copy them to the matching paths in your repo.

2. **Design references** under `design-references/` — the original HTML + JSX prototype the design was developed in. Treat these as **specs**, not code to ship. Open `Gobbl UI.html` in a browser to see the full design canvas (all 12 screens, pan + zoom). Use the JSX files (`harvest.jsx`, `harvest-extras.jsx`, `harvest-shop.jsx`, `harvest-motion.jsx`) to resolve visual ambiguities — they have all spacing/color/copy decisions inlined.

## Fidelity

**High-fidelity.** Colors, type, spacing, and copy are final. The port-ready files match the design references pixel-for-pixel where possible. Where they don't, the design reference is the source of truth.

## Apply order

The package is structured so you can apply it in **two passes** — foundation first, screens second. This minimizes the chance of breaking the running app during a token migration.

### Pass 1 · Foundation (low-risk, every page picks up new look)

```
tailwind.config.ts                          → REPLACE
src/app/layout.tsx                          → REPLACE
src/app/globals.css                         → REPLACE
src/components/ui/Button.tsx                → REPLACE
src/components/ui/Card.tsx                  → REPLACE
src/components/ui/Input.tsx                 → REPLACE
src/components/ui/Badge.tsx                 → NEW
src/components/ui/Chip.tsx                  → NEW
src/components/gamification/FlatTurkey.tsx  → NEW
```

After Pass 1, run `npm run dev`. Every existing screen now has the new fonts, palette, and primitives. Some old screens may look slightly off (they still use emoji turkeys, old shop layout, old chat) — that's expected; Pass 2 fixes it.

**What about the existing `TurkeyAvatar.tsx`?** Leave it. It still works (its callers haven't been updated). After Pass 2, most callers will use `FlatTurkey` and you can delete the old file.

### Pass 2 · Screens (the actual UI rewrite)

```
src/components/layout/BottomNav.tsx                → REPLACE  (Flock → Shop, new icons, new active state)
src/components/layout/TopAppBar.tsx                → REPLACE  (greeting + feather chip; no center logo)

src/components/gamification/XPBar.tsx              → REPLACE  (mono labels, primary fill, near-level gradient)
src/components/gamification/StreakCounter.tsx      → REPLACE
src/components/gamification/LevelUpModal.tsx       → NEW       (used by dashboard on level-up)

src/components/dashboard/StatsCard.tsx             → REPLACE  (display weight, tone prop, optional unit/delta)
src/components/dashboard/DailyChallenge.tsx        → REPLACE  (inverted ink card with chips + ochre CTA)

src/components/chat/ChatInterface.tsx              → REPLACE  (new bubbles, coach chips, pill input, ink send btn)
src/components/chat/MessageBubble.tsx              → REPLACE
                                                     (DifficultyPicker & TopicDropdown are no longer used by /chat
                                                      — delete after Pass 2 if no other importers.)

src/lib/prompts/flipBelief.ts                      → NEW       (Robert's politics = opposite of user's onboarding belief)

src/app/(app)/dashboard/page.tsx                   → REPLACE
src/app/(app)/profile/page.tsx                     → REPLACE
src/app/(app)/skills/page.tsx                      → REPLACE
src/app/(app)/shop/page.tsx                        → REPLACE
src/app/(app)/chat/page.tsx                        → REPLACE   (now the combined topic+difficulty setup)
src/app/(app)/chat/setup/page.tsx                  → REPLACE   (now a thin redirect to /chat)
src/app/(app)/chat/[id]/page.tsx                   → REPLACE
```

After Pass 2: the entire user-facing app is on the Harvest direction.

## Major UX changes (worth highlighting)

1. **Flock tab removed.** Bottom nav is now `Home · Debate · Skills · Shop · You`. The leaderboard still exists at `/leaderboard` and is linked from the Profile page.

2. **No more ideology selector before debates.** Robert's politics are computed from the user's onboarding belief (`User.beliefKey`), flipped to the opposite side (see `src/lib/prompts/flipBelief.ts`). The setup screen shows a small forest-green callout explaining what Robert's running, not a selector.

3. **`/chat/setup` collapses into `/chat`.** The chooser and confirmation are one combined screen now. The setup route becomes a thin redirect for any deep links that still point at it.

4. **Daily Gobble card flips contrast.** The dashboard hero ("Today's Gobble") is now an ink-on-bg card with a faded turkey silhouette and ochre CTA — replaces the previous golden gradient.

5. **Level-up celebration is a full-screen modal**, not a toast. The dashboard detects a level change via `sessionStorage["gobbl:lastLevel"]` and renders `<LevelUpModal />`.

6. **All Material Symbols replaced with inline SVG.** No external icon font is loaded anymore. The font-link tag was removed from `layout.tsx`. The `<Icon>` primitive in `src/components/ui/Icon.tsx` is unused by these new files and can stay or be deleted at your discretion.

7. **Turkey avatars are real SVG illustrations.** `FlatTurkey` replaces emoji `TurkeyAvatar` across every screen. 8 stages: Egg → Hatchling → Poult → Youngster → Tom → Gobbler → Grand Gobbler → Thunderbird.

## Backend changes needed (lightweight)

These are the only API/database adjustments to make Pass 2 work end-to-end:

1. **Expose `beliefKey` on `/api/user`.**
   The user's onboarding belief is needed client-side to compute Robert's flipped position. Add to the `GET /api/user` response.

   ```ts
   // src/app/api/user/route.ts
   return NextResponse.json({
     // ...existing fields,
     beliefKey: user.beliefKey,  // ← add this
   });
   ```

2. **Drop `beliefKey` from the `POST /api/debates` request body validation** — it's now sent automatically by the client (computed from the user's onboarding belief, not picked in the UI). The server should still trust the client-sent value or, better, compute it server-side from the user's stored belief. The latter is more robust:

   ```ts
   // src/app/api/debates/route.ts (server side)
   import { flipBelief } from "@/lib/prompts/flipBelief";
   const user = await db.user.findUnique({ where: { id: session.user.id } });
   const beliefKey = flipBelief(user.beliefKey);  // ignore client-provided value
   ```

3. **Per-dimension civility scores (optional).** The Profile page currently fans the rolling civility average out into 5 dimensions with small intentional variance (see `civilityBreakdown()` in `profile/page.tsx`). If the DB persists per-dimension scores, wire them through — the UI will pick them up unchanged. If not, the placeholder reads sensibly.

## Design tokens (full reference)

### Colors

The palette is light by default with a `.dark` class that flips a CSS-variable set. Existing Tailwind class names (`bg-gobbl-500`, `text-roost-700`, `bg-golden-100`, `bg-plume-500`) keep working — only the values changed. Plus new semantic aliases:

```
bg, surface, surface-2     — page backgrounds
ink, ink-soft, ink-muted   — text foreground hierarchy
line                       — borders / hairlines
primary, primary-soft      — terracotta CTA + tint
forest-fg, forest-soft     — civility / success accent
ochre, ochre-soft          — feather currency, highlights
```

Use `bg-primary text-bg`, `border-line`, `text-ink-soft`, etc. in new code. They flip with `.dark`.

### Typography

```
font-display  — Bricolage Grotesque (variable, opsz 12..96, wght 400-800)
font-body     — DM Sans (default; declared on <body>)
font-mono     — JetBrains Mono (stats, scores, timestamps, eyebrows)
```

Display sizes have negative tracking baked in (`-0.035em` at the top of the scale). Use `text-display-2xl|xl|lg|md|sm` for headings, `text-eyebrow` for the mono uppercase eyebrow labels.

Always wrap numeric runs in `.num-tabular` so columns and counters don't dance during animations.

### Border radii

```
DEFAULT  14px   (general)
sm       8px
md       12px
lg       18px
xl       24px   (cards)
2xl      28px   (hero cards)
3xl      36px   (mobile phone bezels / hero panels)
full     pill
```

### Shadows

```
shadow-soft   — default card shadow, warm-toned
shadow-lift   — pressable / focused / floating CTA
shadow-ring   — ochre glow for level-up moments
```

### Motion

Tailwind classes available out of the box:
- `animate-fade-in` (0.4s)
- `animate-slide-up` (0.4s cubic-bezier(0.16,1,0.3,1))
- `animate-level-pulse` (1.4s — the turkey scale + ochre glow)
- `animate-score-tick` (0.7s slide-in for newly-arrived stat numbers)
- `animate-shimmer` (1.4s linear infinite — for XP bar fills)

Existing `animate-wiggle`, `animate-float`, `animate-hatch`, etc. are preserved.

## Screen-by-screen behavior

### Dashboard (`/dashboard`)

- Top eyebrow + "Ready to talk turkey?" display heading
- Hero card: large `FlatTurkey` at current stage + XP bar with "+N to next level"
- Three-up stat row (Civility / Streak / Debates)
- `DailyChallenge` — inverted ink card, ochre CTA, three difficulty chips (current selection highlighted), background turkey silhouette
- Recent debates list (top 3) linking to `/chat/[id]`
- On mount: detect level change via `sessionStorage["gobbl:lastLevel"]`; render `<LevelUpModal />` if user.level > previous

### Profile (`/profile`)

- Hero card with ochre radial wash, large `FlatTurkey`, username, join date, mini-stat trio
- Evolution timeline: 4-col grid of all 8 stages; locked stages are grayscale at 35% opacity
- Civility-by-dimension: 5 bars with mono numeric values
- Badges grid: 4-col aspect-square cards, earned = colored disc, unearned = grayed
- Action list: "View the Flock" → `/leaderboard`, "Fly the Coop" → `signOut`

### Skills (`/skills`)

- Header with eyebrow + display heading + small turkey illustration
- "Currently learning" ink card (Steelmanning, 3/5 lessons, ochre progress)
- "All paths" list — 5 path cards with numbered tile (01..05), title, sub, level chip, progress bar
- Last path ("Holding Your Ground") is locked at 60% opacity

> The current skills implementation is a placeholder ("Coming soon"). This screen replaces it with a proper paths layout. Wire to a real `/api/skills` once it exists.

### Shop (`/shop`)

- Header: "Bazaar" eyebrow + display heading + ochre feather balance pill
- Hero preview: `FlatTurkey` + current outfit chips (each chip is a one-tap unequip)
- Filter tabs (`Chip` pills): All / Backgrounds / Hats / Faces / Looks
- Items grid (2-col): preview tile with emoji + category badge; equipped state = forest border + check; owned = "Equip" dark button; not owned = feather price + primary "Buy" button

### Chat setup (`/chat`)

- Top row: back button + "New debate" eyebrow
- "Set up your debate" display heading
- 01 Topic: featured topic card (border-primary) + 4 quick-pick rows
- Robert auto-flip note (forest tint) — explains today's politics
- 02 Difficulty: 3 cards (Friendly Cluck / Spirited Strut / Full Gobble), each with a stage turkey + XP reward + colored selected state
- Sticky "Start the debate" CTA above the bottom nav

### Debate arena (`/chat/[id]`)

- Header: back · ochre turkey glyph · "Robert · {ideology}" · "● {difficulty}" · End button
- Topic pill (truncated full topic)
- Live civility meter — gradient bar (forest→ochre), mono numeric value
- Scroll region of `MessageBubble`s (user = ink solid; Robert = white border, ochre glyph avatar)
- Coach chips above the input (Be specific / Ask a question / etc.) — selected chip = ochre
- Pill-shaped input with ink send button
- Completed debates show as view-only transcript

## Assets

No image assets — everything is inline SVG or system. Fonts load via `next/font/google`.

## Files in this package

```
_handoff/
├── README.md                                  (this file)
├── APPLY-WITH-CLAUDE-CODE.md                  (master prompt to feed Claude Code)
├── tailwind.config.ts
├── design-references/
│   ├── Gobbl UI.html                          ← open in a browser for the full design canvas
│   ├── design-canvas.jsx
│   ├── turkeys-flat.jsx
│   ├── harvest.jsx                            (dashboard, profile, skills, desktop)
│   ├── harvest-extras.jsx                     (debate arena, topic setup, level-up, dark variant)
│   ├── harvest-shop.jsx
│   └── harvest-motion.jsx                     (annotated motion spec sheet)
└── src/
    ├── app/
    │   ├── layout.tsx                         (root — fonts)
    │   ├── globals.css                        (CSS vars for tokens, animations)
    │   └── (app)/
    │       ├── dashboard/page.tsx
    │       ├── profile/page.tsx
    │       ├── skills/page.tsx
    │       ├── shop/page.tsx
    │       ├── chat/
    │       │   ├── page.tsx                   (combined topic+difficulty setup)
    │       │   ├── setup/page.tsx             (thin redirect)
    │       │   └── [id]/page.tsx              (debate arena)
    │       └── (the existing leaderboard/page.tsx is preserved — not in this bundle)
    ├── components/
    │   ├── ui/
    │   │   ├── Button.tsx
    │   │   ├── Card.tsx
    │   │   ├── Input.tsx
    │   │   ├── Badge.tsx
    │   │   └── Chip.tsx
    │   ├── layout/
    │   │   ├── BottomNav.tsx
    │   │   └── TopAppBar.tsx
    │   ├── gamification/
    │   │   ├── FlatTurkey.tsx
    │   │   ├── XPBar.tsx
    │   │   ├── StreakCounter.tsx
    │   │   └── LevelUpModal.tsx
    │   ├── dashboard/
    │   │   ├── StatsCard.tsx
    │   │   └── DailyChallenge.tsx
    │   └── chat/
    │       ├── ChatInterface.tsx
    │       └── MessageBubble.tsx
    └── lib/
        └── prompts/
            └── flipBelief.ts
```

## How to apply with Claude Code

See `APPLY-WITH-CLAUDE-CODE.md` for the exact prompt to paste — it walks Claude Code through Pass 1, verification, then Pass 2, with explicit success criteria for each pass.
