# Gobbl Mobile Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Spec:** `docs/superpowers/specs/2026-05-19-gobbl-mobile-restructure-design.md`

**Goal:** Restructure the Gobbl web app into a 5-page mobile-first experience (Dashboard, Chat, Skills, Shop, Profile) with a bottom nav, mobile frame, and new warm-autumn theme — preserving all existing functionality.

**Architecture:** Next.js 14 App Router. Authenticated pages move into a `(app)` route group with a nested layout that renders `<MobileFrame>` wrapping `<TopAppBar>` + `<main>` + `<BottomNav>`. Tailwind palette names are kept but remapped to mockup colors so existing color classes resolve to the new visual system without sweeping rewrites. The Arena routes are renamed to `/chat/*` with redirects from `/arena/*`.

**Tech Stack:** Next.js 14 (App Router), React 18, TypeScript 5, Tailwind CSS 3, NextAuth, Prisma.

**Verification model:** This repo has no test infrastructure (`package.json` has no test script, no `tests/` dir). Each task uses **build + type check + manual browser verification** in place of unit tests:
- Type check: `npx tsc --noEmit`
- Visual verification: `npm run dev`, navigate to the URL, observe expected behavior in DevTools mobile view (iPhone 12 mini, 390×844) and desktop (1440px)

**Branch:** Work happens on `ui-overhaul`. Commit after every task.

---

## File Structure

**New files:**
- `src/components/layout/MobileFrame.tsx` — centered ≤480px column wrapper
- `src/components/layout/TopAppBar.tsx` — sticky top bar
- `src/components/layout/BottomNav.tsx` — sticky bottom nav
- `src/components/ui/Icon.tsx` — Material Symbols wrapper
- `src/components/chat/DifficultyPicker.tsx` — 3 pill buttons
- `src/components/chat/TopicDropdown.tsx` — topic select + category filter
- `src/components/skills/ModuleCard.tsx` — placeholder bento card
- `src/app/(app)/layout.tsx` — nested layout with frame + bars
- `src/app/(app)/skills/page.tsx` — new placeholder page

**Files moved (folder relocation, no logic change at move time):**
- `src/app/dashboard/` → `src/app/(app)/dashboard/`
- `src/app/arena/` → `src/app/(app)/chat/` (rename + relocate)
- `src/app/shop/` → `src/app/(app)/shop/`
- `src/app/profile/` → `src/app/(app)/profile/`
- `src/app/leaderboard/` → `src/app/(app)/leaderboard/`

**Files modified:**
- `tailwind.config.ts` — color remap + spacing/radius tokens
- `src/app/globals.css` — selection color works after remap; no edits required unless visual issue
- `src/app/layout.tsx` — add Quicksand + Nunito Sans, Material Symbols link, remove NavBar (after `(app)` layout is in place)
- `next.config.js` — add `/arena*` → `/chat*` redirects
- `src/app/page.tsx` — references to `/dashboard` unchanged; remove the body-class assumption if any conflicts
- `src/components/dashboard/DailyChallenge.tsx` — update `/arena/setup` link to `/chat/setup`
- `src/components/dashboard/StatsCard.tsx` — restyle
- Each (app)/<page>/page.tsx — restyled to new theme

**Files deleted:**
- `src/components/ui/NavBar.tsx` (replaced by `BottomNav` + `TopAppBar`)

---

## Task 1: Theme tokens — Tailwind palette remap + spacing/radius

**Files:**
- Modify: `tailwind.config.ts`

- [ ] **Step 1.1: Replace the `theme.extend.colors` block in `tailwind.config.ts`**

Replace the entire `colors` object inside `theme.extend` with:

```ts
colors: {
  gobbl: {
    50:  "#fdf9f0",
    100: "#fff8f0",
    200: "#ffdbcf",
    300: "#ffb59a",
    400: "#cd4700",
    500: "#a43700",
    600: "#802a00",
    700: "#6b2300",
    800: "#4a1800",
    900: "#380d00",
    950: "#1a0500",
  },
  plume: {
    50:  "#fdf2f8",
    100: "#fce7f3",
    200: "#fbcfe8",
    300: "#f472b6",
    400: "#db2777",
    500: "#9f1239",
    600: "#881337",
    700: "#701a2e",
    800: "#5c1525",
    900: "#4a0e1e",
    950: "#2d0712",
  },
  roost: {
    50:  "#fdf9f0",
    100: "#f7f3ea",
    200: "#ece8df",
    300: "#e3bfb2",
    400: "#b89a6e",
    500: "#5a4138",
    600: "#4a3527",
    700: "#1c1c17",
    800: "#1c1c17",
    900: "#1c1c17",
    950: "#0f0f0c",
  },
  golden: {
    50:  "#fffdf0",
    100: "#fff9cc",
    200: "#fff085",
    300: "#ffe44d",
    400: "#ffba38",
    500: "#feb300",
    600: "#b39500",
    700: "#806b00",
    800: "#594a00",
    900: "#332b00",
  },
},
```

- [ ] **Step 1.2: Add `spacing` and `borderRadius` to `theme.extend`**

Inside `theme.extend` (after the `colors` block), add:

```ts
spacing: {
  unit: "4px",
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "40px",
  "gutter-mobile": "12px",
  "margin-mobile": "20px",
},
borderRadius: {
  DEFAULT: "1rem",
  lg: "2rem",
  xl: "3rem",
  full: "9999px",
},
```

Note: `borderRadius.DEFAULT` overrides Tailwind's default `rounded` value. Existing uses of `rounded-xl` (current default `0.75rem`) will become `3rem`. This is intentional — large pill-y radii match the mockup. If any specific component looks broken, swap to `rounded-md` (still `0.375rem`) or a specific value at that spot.

- [ ] **Step 1.3: Type-check**

Run: `npx tsc --noEmit`
Expected: PASS (no type errors introduced — this is a config change)

- [ ] **Step 1.4: Build to verify Tailwind compiles**

Run: `npm run dev` in one terminal. Open http://localhost:3000. Page should still render (visuals may look slightly off — that's expected).
Expected: No compile errors in the dev server output. Stop the dev server.

- [ ] **Step 1.5: Commit**

```bash
git add tailwind.config.ts
git commit -m "feat(theme): remap palette to mockup colors, add spacing/radius tokens"
```

---

## Task 2: Add fonts (Quicksand + Nunito Sans) + Material Symbols icon font

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 2.1: Replace the contents of `src/app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Quicksand, Nunito_Sans } from "next/font/google";
import { Providers } from "@/components/ui/Providers";
import { NavBar } from "@/components/ui/NavBar";
import "./globals.css";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-quicksand",
});

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-nunito-sans",
});

export const metadata: Metadata = {
  title: "Gobbl - Talk Turkey. Build Bridges.",
  description: "Gamified civil discourse training powered by AI. Grow your turkey with XP, spend feathers in the Bazaar, and reduce polarization through practice.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${quicksand.variable} ${nunitoSans.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className="min-h-screen antialiased font-body">
        <Providers>
          <NavBar />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
```

Note: `<NavBar />` is left in place for now. It will be removed in Task 9 once the new bars are wired up via the `(app)` layout. This keeps the app navigable during interim tasks.

- [ ] **Step 2.2: Add font-family utilities to `tailwind.config.ts`**

Inside `theme.extend`, add a `fontFamily` block (place it after `borderRadius`):

```ts
fontFamily: {
  display: ["var(--font-quicksand)", "ui-sans-serif", "system-ui", "sans-serif"],
  body: ["var(--font-nunito-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
},
```

- [ ] **Step 2.3: Add Material Symbols base style to `globals.css`**

Append to `src/app/globals.css`:

```css
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  user-select: none;
}
.material-symbols-outlined.filled {
  font-variation-settings: 'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 24;
}
```

- [ ] **Step 2.4: Type-check**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 2.5: Visual verification**

Run: `npm run dev`. Open http://localhost:3000. Body text should now be Nunito Sans. Confirm fonts loaded in DevTools → Network → Fonts.
Expected: Two Google Fonts requests (Quicksand, Nunito Sans) succeed.

- [ ] **Step 2.6: Commit**

```bash
git add src/app/layout.tsx tailwind.config.ts src/app/globals.css
git commit -m "feat(theme): add Quicksand + Nunito Sans fonts and Material Symbols"
```

---

## Task 3: Icon wrapper component

**Files:**
- Create: `src/components/ui/Icon.tsx`

- [ ] **Step 3.1: Create `src/components/ui/Icon.tsx`**

```tsx
interface IconProps {
  name: string;
  filled?: boolean;
  className?: string;
}

export function Icon({ name, filled = false, className = "" }: IconProps) {
  return (
    <span
      className={`material-symbols-outlined${filled ? " filled" : ""} ${className}`}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}
```

- [ ] **Step 3.2: Type-check**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3.3: Commit**

```bash
git add src/components/ui/Icon.tsx
git commit -m "feat(ui): add Material Symbols Icon wrapper"
```

---

## Task 4: Rename `/arena` → `/chat` + add redirects + update internal links

This is the rename-in-place pass. Folder relocation into `(app)` happens in Task 5.

**Files:**
- Move: `src/app/arena/` → `src/app/chat/`
- Modify: `next.config.js`
- Modify: `src/components/dashboard/DailyChallenge.tsx` (link)
- Modify: `src/app/dashboard/page.tsx` (links to `/arena` and `/arena/[id]`)
- Modify: `src/app/chat/setup/page.tsx` (the moved file, internal `router.replace("/arena")` → `/chat`)
- Modify: `src/app/chat/page.tsx` (internal `router.push` for setup)
- Modify: `src/app/page.tsx` if it references `/arena` (it doesn't, but verify)

- [ ] **Step 4.1: Rename the folder**

Run from repo root:
```bash
git mv src/app/arena src/app/chat
```

- [ ] **Step 4.2: Update internal Link/router references**

Search for every occurrence of `/arena` in `src/`:
```bash
grep -rn "/arena" src/
```

Expected matches and the change to make in each:

- `src/components/dashboard/DailyChallenge.tsx:41` — `<Link href="/arena/setup?daily=true">` → `<Link href="/chat/setup?daily=true">`
- `src/app/dashboard/page.tsx:91` — `<Link href="/arena">` → `<Link href="/chat">`
- `src/app/dashboard/page.tsx:147` — `` href={`/arena/${debate.id}`} `` → `` href={`/chat/${debate.id}`} ``
- `src/app/chat/page.tsx` (formerly arena/page.tsx) — `router.replace("/arena/setup?daily=true")` → `router.replace("/chat/setup?daily=true")` and `router.push(\`/arena/setup?topic=...\`)` → `router.push(\`/chat/setup?topic=...\`)`
- `src/app/chat/setup/page.tsx` — `router.replace("/arena")` → `router.replace("/chat")`

After edits, re-run:
```bash
grep -rn "/arena" src/
```
Expected: no matches.

- [ ] **Step 4.3: Add `/arena*` → `/chat*` redirects in `next.config.js`**

Replace `next.config.js` contents:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/arena",
        destination: "/chat",
        permanent: true,
      },
      {
        source: "/arena/:path*",
        destination: "/chat/:path*",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
```

- [ ] **Step 4.4: Type-check**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 4.5: Visual verification**

Run: `npm run dev`. Log in. Visit:
- http://localhost:3000/chat — Arena topic grid loads
- http://localhost:3000/arena — redirects to /chat
- http://localhost:3000/arena/setup?topic=min-wage — redirects to /chat/setup?topic=min-wage

Expected: All three behaviors work. Click "Daily Gobble" on dashboard — goes to `/chat/setup?daily=true`.

- [ ] **Step 4.6: Commit**

```bash
git add src/app/chat src/components/dashboard/DailyChallenge.tsx src/app/dashboard/page.tsx next.config.js
git commit -m "refactor: rename /arena routes to /chat with 308 redirects"
```

(Note: `git mv` is tracked automatically; the staged changes will include the deleted `src/app/arena` entries.)

---

## Task 5: Move authenticated pages into `(app)` route group

This is purely a folder reorganization. URLs do not change (route groups don't affect URLs).

**Files:**
- Move: `src/app/dashboard/` → `src/app/(app)/dashboard/`
- Move: `src/app/chat/` → `src/app/(app)/chat/`
- Move: `src/app/profile/` → `src/app/(app)/profile/`
- Move: `src/app/shop/` → `src/app/(app)/shop/`
- Move: `src/app/leaderboard/` → `src/app/(app)/leaderboard/`

- [ ] **Step 5.1: Create the route group directory**

Run:
```bash
mkdir -p "src/app/(app)"
```

- [ ] **Step 5.2: Move each authenticated page folder**

Run (note: `(app)` must be quoted on some shells):
```bash
git mv src/app/dashboard "src/app/(app)/dashboard"
git mv src/app/chat "src/app/(app)/chat"
git mv src/app/profile "src/app/(app)/profile"
git mv src/app/shop "src/app/(app)/shop"
git mv src/app/leaderboard "src/app/(app)/leaderboard"
```

- [ ] **Step 5.3: Type-check**

Run: `npx tsc --noEmit`
Expected: PASS (imports use `@/...` alias which is path-agnostic to route groups)

- [ ] **Step 5.4: Visual verification**

Run: `npm run dev`. Log in. Visit each route — all should still work:
- /dashboard
- /chat, /chat/setup, /chat/<some-debate-id>
- /shop
- /profile
- /leaderboard

Expected: All routes render. NavBar (the old top nav) still shows because root layout is unchanged.

- [ ] **Step 5.5: Commit**

```bash
git add "src/app/(app)"
git commit -m "refactor: move authenticated pages into (app) route group"
```

---

## Task 6: MobileFrame component

**Files:**
- Create: `src/components/layout/MobileFrame.tsx`

- [ ] **Step 6.1: Create `src/components/layout/MobileFrame.tsx`**

```tsx
import { ReactNode } from "react";

interface MobileFrameProps {
  children: ReactNode;
}

export function MobileFrame({ children }: MobileFrameProps) {
  return (
    <div className="min-h-screen w-full bg-roost-100">
      <div className="relative mx-auto flex min-h-screen max-w-[480px] flex-col bg-roost-50 shadow-[0_0_24px_rgba(0,0,0,0.06)]">
        {children}
      </div>
    </div>
  );
}
```

Outer div: viewport-wide cream-tinted background that fills space around the column on desktop. Inner div: the phone-shaped column (480px max, centered). The frame becomes invisible on narrow viewports because the column fills full width.

- [ ] **Step 6.2: Type-check**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 6.3: Commit**

```bash
git add src/components/layout/MobileFrame.tsx
git commit -m "feat(layout): add MobileFrame wrapper component"
```

---

## Task 7: BottomNav component

**Files:**
- Create: `src/components/layout/BottomNav.tsx`

- [ ] **Step 7.1: Create `src/components/layout/BottomNav.tsx`**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";

const TABS = [
  { href: "/dashboard", icon: "home", label: "Home" },
  { href: "/chat", icon: "chat_bubble", label: "Chat" },
  { href: "/skills", icon: "school", label: "Skills" },
  { href: "/shop", icon: "storefront", label: "Shop" },
  { href: "/profile", icon: "person", label: "Profile" },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 z-40 flex h-20 items-stretch border-t border-roost-200 bg-roost-50">
      {TABS.map((tab) => {
        const active = pathname === tab.href || pathname.startsWith(tab.href + "/");
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-1 flex-col items-center justify-center gap-1 transition-colors ${
              active ? "text-gobbl-500" : "text-roost-500 hover:text-gobbl-500"
            }`}
            aria-current={active ? "page" : undefined}
          >
            <Icon name={tab.icon} filled={active} className="text-[24px]" />
            <span className="font-display text-[12px] font-semibold leading-none">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
```

- [ ] **Step 7.2: Type-check**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 7.3: Commit**

```bash
git add src/components/layout/BottomNav.tsx
git commit -m "feat(layout): add BottomNav with 5 tabs"
```

---

## Task 8: TopAppBar component

**Files:**
- Create: `src/components/layout/TopAppBar.tsx`

- [ ] **Step 8.1: Create `src/components/layout/TopAppBar.tsx`**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { TurkeyAvatar } from "@/components/gamification/TurkeyAvatar";
import type { EquippedCosmetics } from "@/lib/shop";

const TITLES: Record<string, string> = {
  "/dashboard": "Gobbl",
  "/chat": "Chat",
  "/skills": "Skills",
  "/shop": "Shop",
  "/profile": "Profile",
  "/leaderboard": "The Flock",
};

interface UserSummary {
  level: number;
  featherBalance: number;
  equippedCosmetics: EquippedCosmetics;
}

function titleFor(pathname: string): string {
  if (TITLES[pathname]) return TITLES[pathname];
  for (const key of Object.keys(TITLES)) {
    if (pathname.startsWith(key + "/")) return TITLES[key];
  }
  return "Gobbl";
}

export function TopAppBar() {
  const pathname = usePathname();
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
        {titleFor(pathname)}
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

- [ ] **Step 8.2: Type-check**

Run: `npx tsc --noEmit`
Expected: PASS. If `TurkeyAvatar` types complain about `size="sm"` or `equipped`, check `src/components/gamification/TurkeyAvatar.tsx` and match its prop shape exactly.

- [ ] **Step 8.3: Commit**

```bash
git add src/components/layout/TopAppBar.tsx
git commit -m "feat(layout): add TopAppBar with avatar, title, feather pill"
```

---

## Task 9: Wire MobileFrame + bars into `(app)/layout.tsx`, remove old NavBar

**Files:**
- Create: `src/app/(app)/layout.tsx`
- Modify: `src/app/layout.tsx` (remove NavBar import + render)
- Delete: `src/components/ui/NavBar.tsx`

- [ ] **Step 9.1: Create `src/app/(app)/layout.tsx`**

```tsx
"use client";

import { usePathname } from "next/navigation";
import { MobileFrame } from "@/components/layout/MobileFrame";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { BottomNav } from "@/components/layout/BottomNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDebateView = /^\/chat\/[^/]+$/.test(pathname) && pathname !== "/chat/setup";

  return (
    <MobileFrame>
      {!isDebateView && <TopAppBar />}
      <main className="flex-1 px-margin-mobile py-lg">{children}</main>
      {!isDebateView && <BottomNav />}
    </MobileFrame>
  );
}
```

The regex matches `/chat/<id>` (one segment after `/chat/`) and excludes `/chat/setup`. The in-debate view is full-screen.

- [ ] **Step 9.2: Replace `src/app/layout.tsx` (remove NavBar)**

```tsx
import type { Metadata } from "next";
import { Quicksand, Nunito_Sans } from "next/font/google";
import { Providers } from "@/components/ui/Providers";
import "./globals.css";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-quicksand",
});

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-nunito-sans",
});

export const metadata: Metadata = {
  title: "Gobbl - Talk Turkey. Build Bridges.",
  description: "Gamified civil discourse training powered by AI. Grow your turkey with XP, spend feathers in the Bazaar, and reduce polarization through practice.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${quicksand.variable} ${nunitoSans.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className="min-h-screen antialiased font-body">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

- [ ] **Step 9.3: Delete the old NavBar**

```bash
git rm src/components/ui/NavBar.tsx
```

- [ ] **Step 9.4: Type-check**

Run: `npx tsc --noEmit`
Expected: PASS — no other file imports `NavBar` (verify with `grep -rn "ui/NavBar" src/`; expected: no matches).

- [ ] **Step 9.5: Visual verification**

Run: `npm run dev`. Log in. Verify:
- /dashboard, /chat, /shop, /profile, /leaderboard — each shows top app bar + bottom nav, centered ≤480px column on desktop
- /skills — would 404 here; that's fine, page is added in Task 11
- /chat/<some-debate-id> — bottom nav and top bar are hidden
- / (landing) — no bars, no frame
- Switch DevTools to iPhone 12 mini — bars fill width, column is full-width

Expected: All authenticated pages show new shell. Pages themselves still look old (will restyle in later tasks). No NavBar shows anywhere.

- [ ] **Step 9.6: Commit**

```bash
git add "src/app/(app)/layout.tsx" src/app/layout.tsx
git commit -m "feat(layout): wire MobileFrame + TopAppBar + BottomNav, remove old NavBar"
```

---

## Task 10: Restyle Dashboard page

**Files:**
- Modify: `src/app/(app)/dashboard/page.tsx`
- Modify: `src/components/dashboard/StatsCard.tsx`
- Modify: `src/components/dashboard/DailyChallenge.tsx`

- [ ] **Step 10.1: Restyle `StatsCard`**

Replace `src/components/dashboard/StatsCard.tsx` contents:

```tsx
"use client";

interface StatsCardProps {
  icon: string;
  label: string;
  value: string | number;
  subtitle?: string;
  color?: string;
}

export function StatsCard({ icon, label, value, subtitle, color = "text-roost-700" }: StatsCardProps) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl bg-roost-100 p-md">
      <div className="flex items-center gap-2">
        <span className="text-xl">{icon}</span>
        <span className="font-display text-xs font-semibold uppercase tracking-wider text-roost-500">{label}</span>
      </div>
      <div className={`font-display text-2xl font-bold ${color}`}>{value}</div>
      {subtitle && <div className="text-xs text-roost-500">{subtitle}</div>}
    </div>
  );
}
```

- [ ] **Step 10.2: Restyle `DailyChallenge`**

Replace `src/components/dashboard/DailyChallenge.tsx` contents:

```tsx
"use client";

import Link from "next/link";
import { Button } from "../ui/Button";

interface DailyChallengeProps {
  topic: {
    id: string;
    title: string;
    description: string;
    category: string;
  };
  completed?: boolean;
}

export function DailyChallenge({ topic, completed = false }: DailyChallengeProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-golden-100 via-roost-50 to-roost-100 p-lg">
      <div className="absolute right-md top-md rounded-full bg-golden-500 px-3 py-1 text-xs font-bold text-roost-700 flex items-center gap-1">
        <span>{completed ? "✅" : "🌅"}</span> Daily Gobble
      </div>
      <div className="absolute -right-4 -bottom-4 text-8xl opacity-10 rotate-12 select-none">🦃</div>
      <div className="mb-1 font-display text-xs font-bold uppercase tracking-wider text-gobbl-500">
        {topic.category}
      </div>
      <h3 className="mb-1 font-display text-lg font-bold text-roost-700">{topic.title}</h3>
      <p className="mb-4 text-sm text-roost-500">{topic.description}</p>
      {completed ? (
        <div className="flex items-center gap-2 rounded-xl bg-roost-100 px-4 py-2.5">
          <span className="text-lg">🪶</span>
          <span className="text-sm font-semibold text-roost-700">
            Today&apos;s challenge complete! Come back tomorrow for a fresh topic.
          </span>
        </div>
      ) : (
        <Link href="/chat/setup?daily=true">
          <Button size="sm">Accept Challenge (+25 XP &amp; +30 🪶)</Button>
        </Link>
      )}
    </div>
  );
}
```

- [ ] **Step 10.3: Restyle the dashboard page**

Replace `src/app/(app)/dashboard/page.tsx` contents:

```tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { XPBar } from "@/components/gamification/XPBar";
import { StreakCounter } from "@/components/gamification/StreakCounter";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { DailyChallenge } from "@/components/dashboard/DailyChallenge";
import { TurkeyAvatarWithLabel } from "@/components/gamification/TurkeyAvatar";
import { getDailyTopic } from "@/lib/topics";
import type { EquippedCosmetics } from "@/lib/shop";

interface UserData {
  username: string;
  xp: number;
  featherBalance: number;
  level: number;
  equippedCosmetics: EquippedCosmetics;
  levelInfo: {
    level: number;
    name: string;
    xpForNext: number;
    xpProgress: number;
    progressPercent: number;
  };
  civilityScore: number;
  currentStreak: number;
  longestStreak: number;
  dailyCompleted: boolean;
  badges: string[];
  recentDebates: {
    id: string;
    topic: string;
    category: string;
    difficulty: string;
    score: number | null;
    xpEarned: number;
    feathersEarned: number;
    completedAt: string;
  }[];
}

export default function DashboardPage() {
  const { status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
      return;
    }
    if (status === "authenticated") {
      fetch("/api/user")
        .then((r) => r.json())
        .then(setUserData)
        .finally(() => setLoading(false));
    }
  }, [status, router]);

  if (loading || !userData) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="text-4xl animate-wiggle inline-block">🥚</span>
      </div>
    );
  }

  const dailyTopic = getDailyTopic();

  return (
    <div className="flex flex-col gap-lg">
      <div>
        <h1 className="font-display text-2xl font-bold text-roost-700">
          Ready to talk turkey, {userData.username}?
        </h1>
        <p className="text-sm text-roost-500">
          Your flock is waiting.{" "}
          <Link href="/shop" className="font-semibold text-gobbl-500 hover:underline">
            Visit the Bazaar
          </Link>{" "}
          to dress your turkey.
        </p>
      </div>

      <div className="flex items-center gap-md rounded-2xl bg-roost-100 p-md">
        <TurkeyAvatarWithLabel level={userData.level} size="lg" equipped={userData.equippedCosmetics} />
        <div className="flex-1">
          <XPBar
            current={userData.levelInfo.xpProgress}
            max={userData.levelInfo.xpForNext}
            level={userData.level}
            levelName={userData.levelInfo.name}
          />
          <p className="mt-1 text-xs text-roost-500">
            {userData.levelInfo.xpForNext > 0
              ? `${userData.levelInfo.xpForNext - userData.levelInfo.xpProgress} XP until next evolution`
              : "Maximum evolution reached! You are a Thunderbird!"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-md">
        <StatsCard icon="🪶" label="Feathers" value={userData.featherBalance.toLocaleString()} />
        <StatsCard
          icon="🎯"
          label="Civility"
          value={userData.civilityScore > 0 ? `${(userData.civilityScore * 10).toFixed(0)}/100` : "—"}
        />
        <StatsCard icon="💬" label="Debates" value={userData.recentDebates.length} />
        <div className="flex flex-col justify-center rounded-2xl bg-roost-100 p-md">
          <StreakCounter current={userData.currentStreak} longest={userData.longestStreak} />
        </div>
      </div>

      <DailyChallenge topic={dailyTopic} completed={userData.dailyCompleted} />

      {userData.recentDebates.length > 0 && (
        <Card>
          <h3 className="mb-md font-display font-bold text-roost-700 flex items-center gap-2">
            <span>📜</span> Recent Discussions
          </h3>
          <div className="flex flex-col gap-2">
            {userData.recentDebates.map((debate) => (
              <Link
                key={debate.id}
                href={`/chat/${debate.id}`}
                className="flex items-center justify-between rounded-xl bg-roost-100 px-md py-3 transition-colors hover:bg-roost-200"
              >
                <div className="min-w-0 flex-1 pr-3">
                  <div className="truncate font-medium text-roost-700">{debate.topic}</div>
                </div>
                {debate.score != null && (
                  <div className="shrink-0 text-lg font-bold tabular-nums text-gobbl-500">
                    {debate.score.toFixed(1)}
                  </div>
                )}
                {debate.score == null && (
                  <span className="shrink-0 text-xs text-roost-500">In progress</span>
                )}
              </Link>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
```

- [ ] **Step 10.4: Type-check**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 10.5: Visual verification**

Run: `npm run dev`. Log in. Visit /dashboard in DevTools iPhone view.
Expected: Greeting → Avatar+XP bento → 2x2 stats grid → Daily Gobble card → Recent discussions list. Colors warm-autumn. No `[Let's Talk Turkey]` top-right button.

- [ ] **Step 10.6: Commit**

```bash
git add "src/app/(app)/dashboard/page.tsx" src/components/dashboard/StatsCard.tsx src/components/dashboard/DailyChallenge.tsx
git commit -m "feat(dashboard): restyle to mobile mockup layout"
```

---

## Task 11: New Chat entry view (DifficultyPicker + TopicDropdown)

**Files:**
- Create: `src/components/chat/DifficultyPicker.tsx`
- Create: `src/components/chat/TopicDropdown.tsx`
- Modify: `src/app/(app)/chat/page.tsx` (full rewrite)

- [ ] **Step 11.1: Create `src/components/chat/DifficultyPicker.tsx`**

```tsx
"use client";

interface DifficultyOption {
  key: string;
  emoji: string;
  label: string;
  description: string;
}

const DIFFICULTIES: DifficultyOption[] = [
  { key: "Friendly Cluck", emoji: "🐣", label: "Friendly Cluck", description: "Warm, listens well" },
  { key: "Spirited Strut", emoji: "🦃", label: "Spirited Strut", description: "Engaged, direct" },
  { key: "Full Gobble", emoji: "🌩️", label: "Full Gobble", description: "Confrontational, immovable" },
];

interface DifficultyPickerProps {
  value: string | null;
  onChange: (value: string) => void;
}

export function DifficultyPicker({ value, onChange }: DifficultyPickerProps) {
  return (
    <div className="flex flex-col gap-3">
      {DIFFICULTIES.map((opt) => {
        const active = value === opt.key;
        return (
          <button
            key={opt.key}
            type="button"
            onClick={() => onChange(opt.key)}
            className={`flex items-center gap-md rounded-2xl border-2 p-md text-left transition-all ${
              active
                ? "border-gobbl-500 bg-gobbl-500/10"
                : "border-roost-200 bg-roost-50 hover:border-roost-300"
            }`}
          >
            <span className="text-3xl">{opt.emoji}</span>
            <div>
              <div className="font-display font-bold text-roost-700">{opt.label}</div>
              <div className="text-sm text-roost-500">{opt.description}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 11.2: Create `src/components/chat/TopicDropdown.tsx`**

```tsx
"use client";

import { TOPICS, CATEGORIES, type Topic } from "@/lib/topics";
import { useMemo, useState } from "react";

interface TopicDropdownProps {
  value: string | null;
  onChange: (topicId: string) => void;
}

export function TopicDropdown({ value, onChange }: TopicDropdownProps) {
  const [category, setCategory] = useState<string | null>(null);

  const filtered: Topic[] = useMemo(
    () => (category ? TOPICS.filter((t) => t.category === category) : TOPICS),
    [category],
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategory(null)}
          className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
            !category ? "bg-gobbl-500 text-white" : "bg-roost-100 text-roost-500 hover:bg-roost-200"
          }`}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            type="button"
            key={c}
            onClick={() => setCategory(c)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              category === c ? "bg-gobbl-500 text-white" : "bg-roost-100 text-roost-500 hover:bg-roost-200"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border-2 border-roost-200 bg-roost-50 px-md py-3 text-sm text-roost-700 focus:border-gobbl-500 focus:outline-none"
      >
        <option value="" disabled>
          Pick a topic…
        </option>
        {filtered.map((t) => (
          <option key={t.id} value={t.id}>
            {t.title}
          </option>
        ))}
      </select>
    </div>
  );
}
```

- [ ] **Step 11.3: Replace `src/app/(app)/chat/page.tsx`**

```tsx
"use client";

import { Suspense, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { DifficultyPicker } from "@/components/chat/DifficultyPicker";
import { TopicDropdown } from "@/components/chat/TopicDropdown";

function ChatEntryContent() {
  const { status } = useSession();
  const router = useRouter();
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [topicId, setTopicId] = useState<string | null>(null);

  if (status === "unauthenticated") {
    router.push("/");
    return null;
  }

  const canStart = !!difficulty && !!topicId;

  function start() {
    if (!canStart) return;
    router.push(`/chat/setup?topic=${topicId}&difficulty=${encodeURIComponent(difficulty!)}`);
  }

  return (
    <div className="flex flex-col gap-lg">
      <div>
        <h2 className="font-display text-2xl font-bold text-roost-700">Pick your match</h2>
        <p className="text-sm text-roost-500">Choose a challenge level, then a topic.</p>
      </div>

      <section>
        <h3 className="mb-3 font-display text-xs font-bold uppercase tracking-wider text-roost-500">
          Difficulty
        </h3>
        <DifficultyPicker value={difficulty} onChange={setDifficulty} />
      </section>

      <section>
        <h3 className="mb-3 font-display text-xs font-bold uppercase tracking-wider text-roost-500">
          Topic
        </h3>
        <TopicDropdown value={topicId} onChange={setTopicId} />
      </section>

      <Button size="lg" className="w-full" disabled={!canStart} onClick={start}>
        {canStart ? "Start debate" : "Pick difficulty and topic"}
      </Button>
    </div>
  );
}

export default function ChatEntryPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <span className="text-4xl animate-wiggle inline-block">🥚</span>
        </div>
      }
    >
      <ChatEntryContent />
    </Suspense>
  );
}
```

Note: The setup page (`/chat/setup`) already accepts both `topic` and `difficulty` URL params via its existing logic. Verify by reading `src/app/(app)/chat/setup/page.tsx` — it reads `searchParams.get("topic")` and uses `selectedDifficulty` initial state. If the setup page does not currently read `difficulty` from URL, add this small change in step 11.4.

- [ ] **Step 11.4: Make setup page read `difficulty` URL param if present**

Open `src/app/(app)/chat/setup/page.tsx`. Find the `useState` for `selectedDifficulty`:

```tsx
const [selectedDifficulty, setSelectedDifficulty] = useState("Friendly Cluck");
```

Change it to initialize from URL param:

```tsx
const initialDifficulty = searchParams.get("difficulty") ?? "Friendly Cluck";
const [selectedDifficulty, setSelectedDifficulty] = useState(initialDifficulty);
```

(`searchParams` is already defined in that file.)

- [ ] **Step 11.5: Type-check**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 11.6: Visual verification**

Run: `npm run dev`. Log in. Visit /chat.
Expected: Header → 3 stacked difficulty pills → category chips + topic dropdown → disabled "Start debate" button. Pick Spirited Strut + Healthcare → Universal Healthcare → button enables. Click → goes to /chat/setup?topic=universal-healthcare&difficulty=Spirited%20Strut with Spirited Strut pre-selected.

- [ ] **Step 11.7: Commit**

```bash
git add src/components/chat/DifficultyPicker.tsx src/components/chat/TopicDropdown.tsx "src/app/(app)/chat/page.tsx" "src/app/(app)/chat/setup/page.tsx"
git commit -m "feat(chat): replace topic grid with difficulty + topic dropdown entry view"
```

---

## Task 12: Restyle Chat setup + debate views (visual only)

Setup page logic stays. Restyle existing card/heading classes to match theme. Debate view (in-conversation) inherits the new theme automatically since it uses existing components — but verify it doesn't fight the layout.

**Files:**
- Modify: `src/app/(app)/chat/setup/page.tsx`
- Modify: `src/app/(app)/chat/[id]/page.tsx`
- Modify (if needed): `src/components/chat/ChatInterface.tsx`, `MessageBubble.tsx`, `ScoreSummary.tsx`

- [ ] **Step 12.1: Audit current setup page styles**

Open `src/app/(app)/chat/setup/page.tsx`. Replace any usage of:
- `max-w-5xl mx-auto px-4 py-8` wrapper → remove (the `(app)/layout.tsx` already provides padding)
- `text-3xl font-bold text-roost-900 dark:text-roost-50` → `font-display text-2xl font-bold text-roost-700`
- `bg-white border border-roost-200 dark:...` (card classes) → `bg-roost-100 rounded-2xl`
- `text-roost-500 dark:text-roost-400` → `text-roost-500`

The page logic (difficulty selection, ideology selection, start button) stays unchanged.

- [ ] **Step 12.2: Audit debate view styles**

Open `src/app/(app)/chat/[id]/page.tsx`. Same cleanup pass: remove outer `max-w` wrappers, swap white-card classes for `bg-roost-100`, font-display for headings. Since this view hides the top/bottom bars (per `(app)/layout.tsx`), it should also remove its own internal `mt-16` style spacers if any (verify by reading the file).

Inspect `ChatInterface.tsx`, `MessageBubble.tsx`, `ScoreSummary.tsx` and apply the same light pass:
- Message bubbles: `bg-gobbl-500 text-white` for user messages, `bg-roost-100 text-roost-700` for Robert
- Score summary card: `bg-roost-100 rounded-2xl`

- [ ] **Step 12.3: Type-check**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 12.4: Visual verification**

Run: `npm run dev`. Log in. Visit /chat, pick a difficulty + topic, click Start. Setup page loads with new theme. Click "Begin debate" — debate view loads in full-screen mode (no bars). Send a message — bubbles render in new theme.

- [ ] **Step 12.5: Commit**

```bash
git add "src/app/(app)/chat/setup/page.tsx" "src/app/(app)/chat/[id]/page.tsx" src/components/chat
git commit -m "feat(chat): restyle setup and debate views to mobile theme"
```

---

## Task 13: Skills placeholder page

**Files:**
- Create: `src/components/skills/ModuleCard.tsx`
- Create: `src/app/(app)/skills/page.tsx`

- [ ] **Step 13.1: Create `src/components/skills/ModuleCard.tsx`**

```tsx
interface ModuleCardProps {
  emoji: string;
  title: string;
  description: string;
  size?: "lg" | "md" | "wide";
}

export function ModuleCard({ emoji, title, description, size = "md" }: ModuleCardProps) {
  const sizeClasses =
    size === "lg"
      ? "col-span-2 min-h-[160px]"
      : size === "wide"
        ? "col-span-2 min-h-[100px]"
        : "min-h-[140px]";
  return (
    <div
      className={`relative flex flex-col justify-between overflow-hidden rounded-2xl bg-roost-100 p-md ${sizeClasses}`}
    >
      <div className="absolute right-2 top-2 rounded-full bg-golden-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-roost-700">
        Coming soon
      </div>
      <div className="text-4xl">{emoji}</div>
      <div>
        <h3 className="font-display font-bold text-roost-700">{title}</h3>
        <p className="text-xs text-roost-500">{description}</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 13.2: Create `src/app/(app)/skills/page.tsx`**

```tsx
"use client";

import { ModuleCard } from "@/components/skills/ModuleCard";

// Skill modules are still in design. This page renders placeholder
// bento cards so the team can see the layout while real modules are built.
export default function SkillsPage() {
  return (
    <div className="flex flex-col gap-lg">
      <div>
        <h2 className="font-display text-2xl font-bold text-roost-700">Skill Modules</h2>
        <p className="text-sm text-roost-500">
          Coming soon — practice specific civility skills.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-md">
        <ModuleCard
          emoji="🎯"
          title="Respectful Tone"
          description="Active practice mode"
          size="lg"
        />
        <ModuleCard
          emoji="🧠"
          title="Evidence-Based Reasoning"
          description="Back your claims"
        />
        <ModuleCard
          emoji="❤️"
          title="Empathy"
          description="See the other side"
        />
        <ModuleCard
          emoji="🤝"
          title="Constructive Framing"
          description="Build bridges, not walls"
          size="wide"
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 13.3: Type-check**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 13.4: Visual verification**

Run: `npm run dev`. Visit /skills.
Expected: Header → 2-column bento grid with 4 cards. The "Respectful Tone" card is large (spans 2 cols), "Constructive Framing" is wide (spans 2 cols, shorter). Each has a golden "Coming soon" pill.

- [ ] **Step 13.5: Commit**

```bash
git add src/components/skills "src/app/(app)/skills"
git commit -m "feat(skills): add placeholder skill modules page"
```

---

## Task 14: Restyle Shop page

Keep all purchase/equip logic. Remove the standalone feather balance (now in TopAppBar). Restyle hero + sections.

**Files:**
- Modify: `src/app/(app)/shop/page.tsx`

- [ ] **Step 14.1: Open `src/app/(app)/shop/page.tsx` and make these targeted changes**

(Full file rewrite, replacing the existing component body but preserving all state, hooks, and handlers.)

Replace the JSX returned at the bottom of the component (starting from the early-return `if (loading || !data)` block onward) with:

```tsx
  if (loading || !data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="text-4xl animate-wiggle inline-block">🛒</span>
      </div>
    );
  }

  const itemsBySlot = SHOP_SLOTS.map((slot) => ({
    slot,
    label: SLOT_LABEL[slot],
    items: data.items.filter((i) => i.slot === slot),
  }));

  return (
    <div className="flex flex-col gap-lg">
      <div>
        <h2 className="font-display text-2xl font-bold text-roost-700">The Bazaar</h2>
        <p className="text-sm text-roost-500">
          Spend feathers on flair. XP drives your level; feathers are only for the shop.
        </p>
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-roost-100 p-lg">
        <div className="absolute -right-6 -top-6 text-7xl opacity-10 select-none rotate-12">🪶</div>
        <h2 className="mb-3 font-display text-xs font-bold uppercase tracking-wider text-roost-500">
          Preview
        </h2>
        <div className="flex items-center gap-md">
          <TurkeyAvatar level={data.level} size="xl" equipped={data.equipped} />
          <div className="text-sm text-roost-500">
            <p className="font-medium text-roost-700">Your turkey right now</p>
            <p className="mt-1 text-xs">Equip one item per category.</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-plume-100 px-4 py-3 text-sm text-plume-700">{error}</div>
      )}

      <div className="flex flex-col gap-xl">
        {itemsBySlot.map(({ slot, label, items }) => (
          <section key={slot}>
            <h2 className="mb-md font-display font-bold text-roost-700">{label}</h2>
            <div className="grid grid-cols-2 gap-md">
              {items.map((item) => {
                const isEquipped = data.equipped[slot] === item.id;
                const disabledBuy = busyId === item.id || (!item.canAfford && !item.owned);
                return (
                  <div
                    key={item.id}
                    className={`flex flex-col gap-2 rounded-2xl bg-roost-100 p-md ${
                      item.owned ? "ring-2 ring-gobbl-500/40" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-3xl" aria-hidden>
                        {item.emoji}
                      </div>
                      <div className="text-right text-sm">
                        <div className="font-display font-bold text-roost-700">{item.name}</div>
                        <div className="text-xs text-gobbl-500">{item.price.toLocaleString()} 🪶</div>
                      </div>
                    </div>
                    <div className="mt-auto flex flex-wrap gap-2">
                      {!item.owned && (
                        <Button
                          size="sm"
                          disabled={disabledBuy}
                          onClick={() => buy(item.id)}
                          className="flex-1"
                        >
                          {busyId === item.id ? "…" : "Buy"}
                        </Button>
                      )}
                      {item.owned && (
                        <>
                          {!isEquipped && (
                            <Button
                              size="sm"
                              variant="secondary"
                              disabled={busyId === `eq-${slot}`}
                              onClick={() => equip(slot, item.id)}
                            >
                              Equip
                            </Button>
                          )}
                          {isEquipped && (
                            <Button
                              size="sm"
                              variant="secondary"
                              disabled={busyId === `eq-${slot}`}
                              onClick={() => equip(slot, null)}
                            >
                              Unequip
                            </Button>
                          )}
                          <span className="self-center text-xs font-medium text-gobbl-500">Owned</span>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
```

The imports for `Card` are no longer used inside this component — remove the import if eslint complains. The standalone feather balance card is gone (now in TopAppBar).

- [ ] **Step 14.2: Type-check**

Run: `npx tsc --noEmit`
Expected: PASS. Remove unused `Card` import if flagged.

- [ ] **Step 14.3: Visual verification**

Run: `npm run dev`. Visit /shop.
Expected: Header → hero preview card with avatar → sections per slot (Backgrounds, Hats, Face, Accessories) → 2-column item grid. Buy/Equip/Unequip works. Feather balance only appears in top app bar.

- [ ] **Step 14.4: Commit**

```bash
git add "src/app/(app)/shop/page.tsx"
git commit -m "feat(shop): restyle to mobile bento layout, drop standalone feather card"
```

---

## Task 15: Restyle Profile (with menu) + Leaderboard

**Files:**
- Modify: `src/app/(app)/profile/page.tsx`
- Modify: `src/app/(app)/leaderboard/page.tsx`

- [ ] **Step 15.1: Replace `src/app/(app)/profile/page.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { XPBar } from "@/components/gamification/XPBar";
import { BadgeGrid } from "@/components/gamification/BadgeGrid";
import { StreakCounter } from "@/components/gamification/StreakCounter";
import { TurkeyAvatarWithLabel } from "@/components/gamification/TurkeyAvatar";
import { Icon } from "@/components/ui/Icon";
import type { EquippedCosmetics } from "@/lib/shop";

interface UserData {
  username: string;
  xp: number;
  featherBalance: number;
  level: number;
  equippedCosmetics: EquippedCosmetics;
  levelInfo: {
    level: number;
    name: string;
    xpForNext: number;
    xpProgress: number;
    progressPercent: number;
  };
  civilityScore: number;
  currentStreak: number;
  longestStreak: number;
  badges: string[];
  recentDebates: {
    id: string;
    topic: string;
    score: number | null;
    xpEarned: number;
    feathersEarned: number;
    completedAt: string;
    difficulty: string;
  }[];
  createdAt: string;
}

export default function ProfilePage() {
  const { status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
      return;
    }
    if (status === "authenticated") {
      fetch("/api/user")
        .then((r) => r.json())
        .then(setUserData)
        .finally(() => setLoading(false));
    }
  }, [status, router]);

  if (loading || !userData) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="text-4xl animate-wiggle inline-block">🥚</span>
      </div>
    );
  }

  const totalDebates = userData.recentDebates.length;
  const civilDebates = userData.recentDebates.filter((d) => d.score != null && d.score >= 7).length;
  const winRate = totalDebates > 0 ? Math.round((civilDebates / totalDebates) * 100) : 0;

  return (
    <div className="flex flex-col gap-lg">
      <Card className="bg-roost-100">
        <div className="flex flex-col items-center gap-md sm:flex-row sm:items-start">
          <TurkeyAvatarWithLabel level={userData.level} size="lg" equipped={userData.equippedCosmetics} />
          <div className="flex-1 w-full text-center sm:text-left">
            <h1 className="font-display text-2xl font-bold text-roost-700">{userData.username}</h1>
            <p className="mb-3 text-xs text-roost-500">
              Roosting since {new Date(userData.createdAt).toLocaleDateString()}
            </p>
            <XPBar
              current={userData.levelInfo.xpProgress}
              max={userData.levelInfo.xpForNext}
              level={userData.level}
              levelName={userData.levelInfo.name}
            />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-md">
        <div className="rounded-2xl bg-roost-100 p-md text-center">
          <div className="font-display text-2xl font-bold text-golden-500">
            {userData.featherBalance.toLocaleString()}
          </div>
          <div className="text-xs text-roost-500">🪶 Feathers</div>
        </div>
        <div className="rounded-2xl bg-roost-100 p-md text-center">
          <div className="font-display text-2xl font-bold text-roost-700">{totalDebates}</div>
          <div className="text-xs text-roost-500">Total Debates</div>
        </div>
        <div className="rounded-2xl bg-roost-100 p-md text-center">
          <div className="font-display text-2xl font-bold text-gobbl-500">{winRate}%</div>
          <div className="text-xs text-roost-500">Civil Rate (7+)</div>
        </div>
        <div className="flex items-center justify-center rounded-2xl bg-roost-100 p-md">
          <StreakCounter current={userData.currentStreak} longest={userData.longestStreak} />
        </div>
      </div>

      <Card>
        <h3 className="mb-md font-display font-bold text-roost-700 flex items-center gap-2">
          <span>🏆</span> Trophy Roost
        </h3>
        <BadgeGrid earnedBadges={userData.badges} />
      </Card>

      {userData.civilityScore > 0 && (
        <Card>
          <h3 className="mb-3 font-display font-bold text-roost-700">Civility Reputation</h3>
          <div className="flex items-center gap-4">
            <div className="font-display text-4xl font-bold text-gobbl-500">
              {(userData.civilityScore * 10).toFixed(0)}
            </div>
            <div>
              <div className="text-sm font-medium text-roost-700">out of 100</div>
              <div className="text-xs text-roost-500">Rolling average of recent debates</div>
            </div>
          </div>
        </Card>
      )}

      <div className="overflow-hidden rounded-2xl bg-roost-100">
        <Link
          href="/leaderboard"
          className="flex items-center justify-between px-md py-4 hover:bg-roost-200 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">🏆</span>
            <span className="font-display font-semibold text-roost-700">View the Flock</span>
          </div>
          <Icon name="chevron_right" className="text-roost-500" />
        </Link>
        <div className="border-t border-roost-200" />
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex w-full items-center justify-between px-md py-4 hover:bg-roost-200 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">🚪</span>
            <span className="font-display font-semibold text-plume-500">Fly the Coop</span>
          </div>
          <Icon name="chevron_right" className="text-roost-500" />
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 15.2: Replace `src/app/(app)/leaderboard/page.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { RankingTable, RankEntry } from "@/components/leaderboard/RankingTable";

const SORT_OPTIONS = [
  { key: "xp", label: "XP", icon: "⭐" },
  { key: "civility", label: "Civility", icon: "🎯" },
  { key: "streak", label: "Migration", icon: "🦅" },
];

export default function LeaderboardPage() {
  const { status } = useSession();
  const router = useRouter();
  const [sortBy, setSortBy] = useState("xp");
  const [data, setData] = useState<RankEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
      return;
    }
    if (status === "authenticated") {
      setLoading(true);
      fetch(`/api/leaderboard?sort=${sortBy}`)
        .then((r) => r.json())
        .then(setData)
        .finally(() => setLoading(false));
    }
  }, [status, sortBy, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="text-4xl animate-wiggle inline-block">🥚</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-lg">
      <div>
        <h2 className="font-display text-2xl font-bold text-roost-700">🏆 The Flock</h2>
        <p className="text-sm text-roost-500">See who&apos;s strutting their stuff in civil discourse</p>
      </div>

      <div className="flex justify-center gap-2">
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setSortBy(opt.key)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition-all ${
              sortBy === opt.key
                ? "bg-gobbl-500 text-white"
                : "bg-roost-100 text-roost-500 hover:bg-roost-200"
            }`}
          >
            <span>{opt.icon}</span>
            <span>{opt.label}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <span className="text-3xl animate-wiggle inline-block">🥚</span>
        </div>
      ) : (
        <RankingTable entries={data} />
      )}
    </div>
  );
}
```

Verify that `RankingTable`'s prop name is `entries` — if the existing component uses a different prop name, adjust this line to match. Open `src/components/leaderboard/RankingTable.tsx` first to confirm. If the prop name differs, use the original.

- [ ] **Step 15.3: Type-check**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 15.4: Visual verification**

Run: `npm run dev`. Visit /profile.
Expected: Hero card with avatar + XP → 2x2 stats grid → Trophy Roost → Civility Reputation (if applicable) → menu list with "View the Flock" + "Fly the Coop". Click "View the Flock" — leaderboard loads with new theme. Click "Fly the Coop" — signs out and redirects to /.

- [ ] **Step 15.5: Commit**

```bash
git add "src/app/(app)/profile/page.tsx" "src/app/(app)/leaderboard/page.tsx"
git commit -m "feat(profile): restyle profile with menu list, restyle leaderboard"
```

---

## Task 16: Final smoke test + cleanup

**Files:**
- Possibly modify: any file with leftover `dark:` classes or old palette references that visually break

- [ ] **Step 16.1: Cross-page smoke test in DevTools mobile view (iPhone 12 mini)**

Run: `npm run dev`. Log in. Walk through every screen:

- [ ] / (landing/auth) — no bars, fits mobile width, hatch flow works
- [ ] /dashboard — top bar (avatar / "Gobbl" / feather pill), all sections render, bottom nav highlights "Home"
- [ ] /chat — entry view, difficulty + topic selection, start button enables
- [ ] /chat/setup — restyled setup, can pick ideology, "Begin debate"
- [ ] /chat/<id> — full-screen debate, **no top/bottom bars**, can send messages and see Robert respond
- [ ] /skills — placeholder grid, "Coming soon" badges visible
- [ ] /shop — preview hero, item grid, can buy/equip/unequip, feather balance only in top bar
- [ ] /profile — hero, stats, badges, menu list, sign-out works
- [ ] /leaderboard — sort pills, ranking table, accessed from profile menu
- [ ] /arena → redirects to /chat
- [ ] /arena/setup?topic=min-wage → redirects to /chat/setup?topic=min-wage

- [ ] **Step 16.2: Desktop smoke test (1440px viewport)**

In a maximized browser window, visit each authenticated route. Expected: content sits in a centered ~480px column with cream background filling the rest of the viewport. Soft shadow on the column.

- [ ] **Step 16.3: Fix any visual regressions discovered**

Common things to spot-fix:
- A button that's now too round (`rounded-DEFAULT = 1rem` is large) — swap to `rounded-md` if it looks wrong
- A card that's too tightly cramped — adjust padding
- Dark mode classes on a light-only page making text invisible — none should fire (no `.dark` class is added), but verify

Make targeted fixes and commit them as you go.

- [ ] **Step 16.4: Final commit (if any fixes were made)**

```bash
git add -A
git commit -m "fix(theme): polish visual regressions from restructure"
```

- [ ] **Step 16.5: Verify branch state**

Run: `git log --oneline ui-overhaul ^main`
Expected: a clean sequence of feat/refactor commits, one per task.

---

## Out of scope (deferred to future plans)

- Real Skill Modules functionality (the page is a placeholder shell only)
- Replacement of emoji-based avatars with proper avatar assets
- Dark mode design pass
- Native mobile build decision (Capacitor wrap vs Expo port)
