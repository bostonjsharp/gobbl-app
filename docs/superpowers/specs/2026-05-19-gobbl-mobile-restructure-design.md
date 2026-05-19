# Gobbl Mobile Restructure — Design

**Date:** 2026-05-19
**Status:** Approved for planning

## Goal

Restructure the Gobbl web app into a mobile-first experience that previews how the eventual mobile app will look and feel, while continuing to ship as a Vercel-hosted Next.js web app. The team needs a shareable URL today that looks like a real mobile app when viewed at phone dimensions and remains usable on desktop.

This is primarily a **structural + visual overhaul**. Most app functionality (auth, debates with Robert, civility scoring, shop, gamification) is kept as-is. Some features (Skill Modules) are scaffolded as placeholders for later work.

## Scope

**In scope:**
- 5-page mobile structure with bottom nav: Dashboard, Chat, Skill Modules, Shop, Profile
- New theme: warm autumn palette, Quicksand + Nunito Sans, Material Symbols icons
- Mobile-frame layout that caps content width on desktop
- Reskin of existing Dashboard, Arena (→ Chat), Shop, Profile pages
- New `/skills` placeholder page
- Leaderboard moved off bottom nav, accessible via Profile menu button
- Old `/arena/*` routes redirect to `/chat/*`

**Out of scope:**
- API changes (`/api/*` routes are untouched)
- Database schema changes
- Dark mode design (mockup is light-only; existing `dark:` variants kept so nothing crashes)
- Real Skill Modules functionality (placeholder shell only)
- Native mobile build (Capacitor/Expo) — separate later decision
- Replacing emoji-based avatars with real assets (planned future work, not now)

## Architecture

### Routing

| Current | New | Notes |
|---|---|---|
| `/` | `/` | Landing/auth unchanged |
| `/dashboard` | `/dashboard` | Restyled |
| `/arena` | `/chat` | Renamed + reskinned (difficulty + topic chooser) |
| `/arena/setup` | `/chat/setup` | Kept, restyled (still picks Robert's belief preset) |
| `/arena/[id]` | `/chat/[id]` | Renamed + restyled (in-debate view) |
| `/shop` | `/shop` | Restyled |
| `/profile` | `/profile` | Restyled, gains menu list at bottom |
| `/leaderboard` | `/leaderboard` | Route kept; reached via Profile button |
| — | `/skills` | New placeholder |

**Redirects:** `/arena`, `/arena/setup`, and `/arena/[id]` 308-redirect to their `/chat` equivalents so existing debate links keep working. Implement via `next.config.js` `redirects()`.

### Components

**New components** under `src/components/`:

- `layout/MobileFrame.tsx` — centered ≤480px column wrapper with cream background filling the viewport.
- `layout/TopAppBar.tsx` — sticky 72px top bar: avatar (left) → `/profile`, page title (center), feather pill (right) → `/shop`. Hidden on `/`.
- `layout/BottomNav.tsx` — sticky 80px bottom nav with 5 tabs and Material Symbols icons. Hidden on `/` and `/chat/[id]`.
- `chat/DifficultyPicker.tsx` — three pill buttons for Friendly Cluck / Spirited Strut / Full Gobble.
- `chat/TopicDropdown.tsx` — dropdown over `TOPICS` from `lib/topics.ts`, with optional category filter chip row.
- `skills/ModuleCard.tsx` — non-interactive bento card with "Coming soon" badge.
- `ui/Icon.tsx` — wrapper that renders `<span class="material-symbols-outlined">{name}</span>` with optional `filled` prop.

**Kept components (restyled in place):**
- `gamification/*` (TurkeyAvatar, XPBar, StreakCounter, BadgeGrid, LevelBadge)
- `dashboard/*` (DailyChallenge, StatsCard)
- `chat/ChatInterface.tsx`, `chat/MessageBubble.tsx`, `chat/ScoreSummary.tsx`
- `leaderboard/RankingTable.tsx`
- `ui/Button.tsx`, `ui/Card.tsx`, `ui/Input.tsx`, `ui/Providers.tsx`

**Removed:**
- `ui/NavBar.tsx` (replaced by `BottomNav` + `TopAppBar`)

### Root layout

Use a Next.js **route group** to opt the landing/auth page out of the mobile shell:

- `src/app/(app)/layout.tsx` — renders `<MobileFrame>` containing `<TopAppBar />`, `<main>{children}</main>`, and `<BottomNav />` in that order. All three sit inside the 480px column so on desktop the bars stay phone-width.
- `src/app/(app)/dashboard/`, `(app)/chat/`, `(app)/skills/`, `(app)/shop/`, `(app)/profile/`, `(app)/leaderboard/` — authenticated pages move under this group.
- `src/app/page.tsx` and `src/app/layout.tsx` stay at the root for the landing/auth experience (no bars, no frame).

The bars themselves contain logic to hide on the in-debate view (`/chat/[id]`) — checked via `usePathname()`.

### API

Untouched. `/api/debates/*` keeps its name even though the UI calls it Chat — internal-only.

## Theme & Design Tokens

Strategy: **remap existing Tailwind color names to the mockup palette** so existing code keeps working without sweeping color-class rewrites. Treat `gobbl`, `roost`, `golden`, `plume` as semantic tokens.

### Color remap (in `tailwind.config.ts`)

| Token | New value | Mockup role |
|---|---|---|
| `gobbl-50` | `#fdf9f0` | surface-bright / cream |
| `gobbl-100` | `#fff8f0` | surface tint |
| `gobbl-200` | `#ffdbcf` | primary-fixed |
| `gobbl-300` | `#ffb59a` | primary-fixed-dim |
| `gobbl-400` | `#cd4700` | primary-container |
| `gobbl-500` | `#a43700` | **primary** (buttons, links, headings) |
| `gobbl-600` | `#802a00` | on-primary-fixed-variant (hover) |
| `gobbl-700`–`950` | progressively darker browns | |
| `roost-50` | `#fdf9f0` | page bg |
| `roost-100` | `#f7f3ea` | surface-container-low |
| `roost-200` | `#ece8df` | surface-container-high (borders) |
| `roost-300` | `#e3bfb2` | outline-variant |
| `roost-500` | `#5a4138` | on-surface-variant (secondary text) |
| `roost-700`–`900` | `#1c1c17` | on-background (primary text) |
| `golden-400` | `#ffba38` | secondary-fixed-dim |
| `golden-500` | `#feb300` | secondary-container (feathers/accents) |
| `plume-*` | unchanged | burgundy kept for errors/destructive |

Dark mode is class-based (`darkMode: "class"`) and no dark class is toggled anywhere, so existing `dark:` variants in component code are effectively dead in this pass. They are not removed (cleanup is noise for this overhaul); a real dark theme is future work.

### Typography

Add to `app/layout.tsx` via `next/font/google`:
- **Quicksand** (weights 600, 700) — headings, labels, page titles
- **Nunito Sans** (weights 400, 600, 700) — body text

Default body font: Nunito Sans 16px/24px. Headings use Quicksand. Add a Tailwind plugin entry or font-family utility classes (`font-display`, `font-body`) to apply them.

### Icons

Add Material Symbols Outlined via Google Fonts link in `<head>` of `app/layout.tsx`:

```html
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
```

`<Icon name="..." filled={false} />` wrapper renders `<span class="material-symbols-outlined">{name}</span>` with font-variation-settings controlling fill state.

Brand emoji (🦃, 🪶, 🥚, level avatars) stay where they're part of voice — Material icons only for UI affordances (nav, chevrons, search, etc.).

### Spacing & radius

Add to `tailwind.config.ts` (alongside the existing scale):
- `spacing`: `xs:4px`, `sm:8px`, `md:16px`, `lg:24px`, `xl:40px`, `gutter-mobile:12px`, `margin-mobile:20px`, `unit:4px`
- `borderRadius`: `DEFAULT:1rem`, `lg:2rem`, `xl:3rem`, `full:9999px`

### Animations

All existing keyframes (`feather-fall`, `hatch`, `strut`, `gobble`, `float`, `wiggle`) kept. No new animations.

## Layout

### MobileFrame

- Outer: `min-h-screen w-full bg-roost-50` (cream)
- Inner: `mx-auto max-w-[480px] min-h-screen relative shadow-[0_0_24px_rgba(0,0,0,0.06)]`
- On viewports < 480px: column fills edge-to-edge (real mobile / DevTools mobile view)
- On wider viewports: column centers with soft shadow forming a "device" silhouette
- Content slot inside the column receives top/bottom padding to clear app bars

### TopAppBar

- Position: `sticky top-0`, full width of the frame, height 72px (`pt-sm pb-sm`)
- Background: `bg-roost-50` with bottom shadow `0px 4px 12px rgba(141,110,99,0.12)`
- Layout: `flex justify-between items-center px-margin-mobile`
  - **Left:** `<TurkeyAvatar size="sm" />` with current user's level + equipped cosmetics — 40px round, `border-2 border-primary/20`. Click → `/profile`.
  - **Center:** page title in `font-display-lg text-headline-lg-mobile text-primary`. Titles: "Gobbl" (dashboard), "Chat", "Skills", "Shop", "Profile".
  - **Right:** feather pill — `flex items-center gap-xs text-primary font-label-md px-md py-xs bg-surface-container-low rounded-full` showing `{balance} Feathers 🪶`. Click → `/shop`.
- Hidden when no session (landing page).

### BottomNav

- Position: `sticky bottom-0`, full width, height 80px
- Background: `bg-roost-50` with top border `border-t border-roost-200`
- 5 equal tabs: `flex justify-around items-center h-full`
- Each tab: stacked `<Icon>` (24px) + label (12px Quicksand semibold)
- Active state: primary color `#a43700`, filled icon variant
- Inactive: `on-surface-variant` `#5a4138`, outlined icon
- Tap targets ≥48px

| Tab | Path | Icon | Label |
|---|---|---|---|
| Dashboard | `/dashboard` | `home` | Home |
| Chat | `/chat` | `chat_bubble` | Chat |
| Skills | `/skills` | `school` | Skills |
| Shop | `/shop` | `storefront` | Shop |
| Profile | `/profile` | `person` | Profile |

Hidden on `/` and `/chat/[id]` (full-screen debate view).

## Pages

### Dashboard (`/dashboard`)

- Greeting header — "Ready to talk turkey, {username}?" + flavor line with link to `/shop`.
- Hero card — `TurkeyAvatar` (lg, equipped) + `XPBar` + "X XP until next evolution". Rounded-2xl bento card, `bg-roost-100`.
- Stats grid — 2x2 bento of small cards: Feathers, Civility Score, Debates count, `StreakCounter`.
- Daily Gobble — `DailyChallenge` component, restyled as the mockup's featured large card with topic title, category chip, "Start" button → `/chat/setup?daily=true`.
- Recent Discussions — list of recent debates, restyled cards. Links go to `/chat/[id]`.
- **Removed:** top-right "Let's Talk Turkey" CTA (redundant with bottom nav + Daily Gobble card).

### Chat entry (`/chat`)

Replaces the current Arena topic-grid view.

- Header: "Pick your match" + subtitle.
- `<DifficultyPicker>` — three stacked pill buttons:
  - 🐣 Friendly Cluck (warm, listens well)
  - 🦃 Spirited Strut (engaged, direct)
  - 🌩️ Full Gobble (confrontational, immovable)
- `<TopicDropdown>` — dropdown listing all `TOPICS` from `lib/topics.ts`, with optional category chip filter row above it.
- Start button — full-width, primary, disabled until both selected. Click → `/chat/setup?topic={id}&difficulty={level}`.

### Chat setup (`/chat/setup`)

Kept mostly as-is — still the step that picks Robert's political belief preset. Restyled to match. URL params (`topic`, `difficulty`, `daily=true`) work the same.

### Chat debate (`/chat/[id]`)

- Uses existing `ChatInterface`, `MessageBubble`, `ScoreSummary` — restyled to match mockup chat style.
- Bottom nav hidden (full-screen).
- Top app bar shows the topic name as title; left icon is a back button → `/chat`.

### Skill Modules (`/skills`) — placeholder shell

- Header: "Skill Modules" + subtitle "Coming soon — practice specific civility skills."
- Bento grid of 4 non-interactive `<ModuleCard>` placeholders with "Coming soon" badge:
  - Large featured: 🎯 Respectful Tone — "Active practice mode"
  - Medium: 🧠 Evidence-Based Reasoning
  - Medium: ❤️ Empathy
  - Wide: 🤝 Constructive Framing
- Code comment notes that modules are still in design.

### Shop (`/shop`)

- Hero card: `TurkeyAvatar` (xl, equipped) preview with decorative feather corner element. Rounded-2xl, `bg-roost-100`.
- Feather balance is shown in `TopAppBar`; current page's standalone balance card is removed.
- Category bento grid — keep `Hats`, `Backgrounds`, `Face`, `Accessories` slots, but rendered as bento sections per mockup (Hats large, others medium). Within each, item cards keep all current buy/equip/unequip logic.
- All purchase logic untouched.

### Profile (`/profile`)

- Hero card: large `TurkeyAvatar`, username, "Roosting since {date}", `XPBar`.
- Stats bento grid: Feathers, Total Debates, Civil Rate, Streak.
- Trophy Roost: `BadgeGrid`, restyled with locked badges greyed out.
- Civility Reputation: kept if `civilityScore > 0`, restyled.
- **New: Menu list** at bottom — rows with icon + label + chevron:
  - 🏆 View the Flock → `/leaderboard`
  - 🚪 Fly the Coop → sign out
  - Future items go here (settings, etc.)

### Leaderboard (`/leaderboard`)

- Route kept. Reached via Profile menu, not bottom nav.
- Restyled to match the new theme; existing `RankingTable` component reused.
- Top app bar shows back chevron → `/profile`.

### Landing/auth (`/`)

- Unchanged. No top app bar, no bottom nav.

## Testing & verification

- Manual smoke test in DevTools at iPhone 12 mini, iPhone 14 Pro Max, and desktop (1440px) viewports.
- Verify all 5 bottom nav routes load with bottom nav visible.
- Verify `/chat/[id]` hides bottom nav.
- Verify `/arena/*` redirects to `/chat/*` (test with an existing debate ID).
- Verify auth flow at `/` shows no app bar / nav.
- Existing functionality (start a debate, score, purchase, equip) is unchanged — smoke-test one path end-to-end.

## Known follow-ups (out of scope here)

- Replace emoji avatars with real avatar/cosmetic assets supporting deeper customization
- Build real Skill Modules functionality
- Dedicated dark mode design pass
- Decision on native mobile path (Capacitor wrap of this web app, vs Expo/React Native port)
