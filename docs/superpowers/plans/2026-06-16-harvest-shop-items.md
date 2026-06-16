# Harvest Shop Items — SVG Cosmetics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace 11 emoji-based shop items with 27 SVG-rendered items and wire equipped items visually onto the turkey avatar at every point it appears in the app.

**Architecture:** Three core files form the layer: `shop.ts` (new catalog + slots), `ItemLayers.tsx` (27 SVG item renderers + `ItemLayer`), `AvatarWithItems.tsx` (compositor + `ItemProductShot`). All other changes are targeted call-site swaps. No DB schema changes — `equippedCosmetics` is already a JSON column.

**Tech Stack:** Next.js 14, React, TypeScript, Tailwind CSS, Prisma. No test framework exists — verification is `npx tsc --noEmit` + browser smoke check after each task.

**Spec:** `docs/superpowers/specs/2026-06-15-harvest-shop-items-design.md`  
**Design reference:** `_handoff/design-references/harvest-shop-items.jsx`

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| **Modify** | `src/lib/shop.ts` | New slot types, ShopItem interface, 27-item catalog |
| **Create** | `src/components/gamification/ItemLayers.tsx` | 27 SVG item renderers, `ITEM_RENDERERS` registry, `ItemLayer` |
| **Create** | `src/components/gamification/AvatarWithItems.tsx` | `AvatarWithItems` compositor, `ItemProductShot` |
| **Modify** | `src/app/(app)/shop/page.tsx` | Hero → `AvatarWithItems`, cards → `ItemProductShot`, slot labels |
| **Modify** | `src/app/(app)/dashboard/page.tsx` | Hero → `AvatarWithItems` |
| **Modify** | `src/app/(app)/profile/page.tsx` | Profile hero → `AvatarWithItems` |
| **Modify** | `src/components/leaderboard/RankingTable.tsx` | `TurkeyAvatar` → `AvatarWithItems` |
| **Modify** | `src/components/chat/ScoreSummary.tsx` | `TurkeyAvatar` → `AvatarWithItems` |
| **Modify** | `src/components/chat/ChatInterface.tsx` | Add `equippedCosmetics` to `FinishResult` |
| **Modify** | `src/app/api/chat/route.ts` | Return `equippedCosmetics` in finish response |

---

## Task 1: Update shop.ts — new slots, interface, and 27-item catalog

**Files:**
- Modify: `src/lib/shop.ts`

- [ ] **Step 1: Replace the entire file**

```ts
export type ShopSlot = "hat" | "face" | "neck" | "chest" | "cape" | "background";

export interface ShopItem {
  id: string;
  name: string;
  slot: ShopSlot;
  cost: number;
  accent: string;
  accentBg: string;
  isNew?: boolean;
  unlockAt?: number;
}

export const SHOP_SLOTS: ShopSlot[] = ["background", "cape", "hat", "face", "neck", "chest"];

export const SHOP_CATALOG: ShopItem[] = [
  // Hats
  { id: "mortarboard", name: "Scholar Cap",    slot: "hat",        cost: 250,  accent: "#1F4937", accentBg: "#D5DFD4" },
  { id: "crown",       name: "Tiny Crown",     slot: "hat",        cost: 800,  accent: "#E4A547", accentBg: "#FBE9C4", isNew: true },
  { id: "beanie",      name: "Knit Beanie",    slot: "hat",        cost: 180,  accent: "#7A2916", accentBg: "#F4D9CC" },
  { id: "tophat",      name: "Top Hat",        slot: "hat",        cost: 420,  accent: "#1A1612", accentBg: "#E8DDC6" },
  { id: "wizard",      name: "Wizard Hat",     slot: "hat",        cost: 650,  accent: "#1F4937", accentBg: "#D5DFD4" },
  { id: "beret",       name: "Painter Beret",  slot: "hat",        cost: 220,  accent: "#7A2916", accentBg: "#F4E3D5" },
  { id: "baseball",    name: "Ball Cap",       slot: "hat",        cost: 200,  accent: "#1F4937", accentBg: "#D5DFD4" },
  { id: "pumpkin",     name: "Pumpkin Lid",    slot: "hat",        cost: 320,  accent: "#C0461C", accentBg: "#FBE9C4", isNew: true },
  // Face
  { id: "aviators",   name: "Aviators",        slot: "face",       cost: 180,  accent: "#1A1612", accentBg: "#F4D9CC" },
  { id: "round",      name: "Wire Frames",     slot: "face",       cost: 160,  accent: "#1A1612", accentBg: "#D5DFD4" },
  { id: "monocle",    name: "Gold Monocle",    slot: "face",       cost: 380,  accent: "#E4A547", accentBg: "#FBE9C4" },
  { id: "eyepatch",   name: "Eye Patch",       slot: "face",       cost: 240,  accent: "#1A1612", accentBg: "#E8DDC6" },
  { id: "starshades", name: "Star Shades",     slot: "face",       cost: 300,  accent: "#C0461C", accentBg: "#F4D9CC" },
  // Neck
  { id: "bowtie",     name: "Bow Tie",         slot: "neck",       cost: 220,  accent: "#7A2916", accentBg: "#F4D9CC" },
  { id: "scarf",      name: "Striped Scarf",   slot: "neck",       cost: 340,  accent: "#1F4937", accentBg: "#D5DFD4" },
  { id: "pearls",     name: "Pearl Necklace",  slot: "neck",       cost: 540,  accent: "#F4E3D5", accentBg: "#FBE9C4" },
  // Chest
  { id: "sheriff",    name: "Sheriff Star",    slot: "chest",      cost: 280,  accent: "#E4A547", accentBg: "#FBE9C4" },
  { id: "medal",      name: "Gold Medal",      slot: "chest",      cost: 460,  accent: "#E4A547", accentBg: "#FBE9C4" },
  // Cape
  { id: "cape",       name: "Hero Cape",       slot: "cape",       cost: 520,  accent: "#C0461C", accentBg: "#F4D9CC" },
  { id: "wings",      name: "Spirit Wings",    slot: "cape",       cost: 900,  accent: "#1F4937", accentBg: "#D5DFD4", unlockAt: 6 },
  // Background
  { id: "forest",     name: "Forest Glade",    slot: "background", cost: 600,  accent: "#1F4937", accentBg: "#D5DFD4" },
  { id: "sunset",     name: "Sunset Glow",     slot: "background", cost: 700,  accent: "#C0461C", accentBg: "#FCE2C0" },
  { id: "cosmic",     name: "Cosmic Drift",    slot: "background", cost: 1200, accent: "#3A2D5C", accentBg: "#2A2440", unlockAt: 6 },
  { id: "dots",       name: "Polka Dots",      slot: "background", cost: 240,  accent: "#C0461C", accentBg: "#F4ECDD" },
  { id: "confetti",   name: "Confetti Party",  slot: "background", cost: 380,  accent: "#1F4937", accentBg: "#1F4937", isNew: true },
];

const catalogById = new Map(SHOP_CATALOG.map((item) => [item.id, item]));

export function getShopItem(itemId: string): ShopItem | undefined {
  return catalogById.get(itemId);
}

export function isValidItemId(itemId: string): boolean {
  return catalogById.has(itemId);
}

export type EquippedCosmetics = Partial<Record<ShopSlot, string>>;

export function parseEquippedCosmetics(raw: unknown): EquippedCosmetics {
  if (raw == null || typeof raw !== "object") return {};
  const o = raw as Record<string, unknown>;
  const out: EquippedCosmetics = {};
  for (const slot of SHOP_SLOTS) {
    const v = o[slot];
    if (typeof v === "string" && isValidItemId(v)) {
      const item = getShopItem(v);
      if (item && item.slot === slot) out[slot] = v;
    }
  }
  return out;
}

export function serializeEquippedCosmetics(equipped: EquippedCosmetics): EquippedCosmetics {
  const out: EquippedCosmetics = {};
  for (const slot of SHOP_SLOTS) {
    const id = equipped[slot];
    if (id && isValidItemId(id)) {
      const item = getShopItem(id);
      if (item && item.slot === slot) out[slot] = id;
    }
  }
  return out;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: zero errors from `src/lib/shop.ts`. Other files that import from `shop.ts` will have errors about the missing `emoji` property — those are expected and will be fixed in later tasks.

- [ ] **Step 3: Commit**

```bash
git add src/lib/shop.ts
git commit -m "feat(shop): replace emoji catalog with 27 SVG-keyed items and expand slots"
```

---

## Task 2: Create ItemLayers.tsx — all 27 SVG item renderers

**Files:**
- Create: `src/components/gamification/ItemLayers.tsx`

- [ ] **Step 1: Create the file with all renderers and exports**

```tsx
"use client";

import React from "react";

// ─── Hat items ────────────────────────────────────────────────────────────────

function HatMortarboard() {
  return (
    <g>
      <rect x="80" y="62" width="40" height="14" rx="2" fill="#1A1612"/>
      <rect x="80" y="72" width="40" height="4" fill="#2A2620"/>
      <path d="M62 62 L100 50 L138 62 L100 72 Z" fill="#1A1612"/>
      <path d="M62 62 L100 72 L138 62" stroke="#2A2620" strokeWidth="0.8" fill="none"/>
      <circle cx="100" cy="61" r="2.5" fill="#E4A547"/>
      <path d="M100 61 Q120 70 132 84" stroke="#E4A547" strokeWidth="1.4" fill="none"/>
      <ellipse cx="133" cy="86" rx="3" ry="5" fill="#E4A547"/>
      <ellipse cx="133" cy="86" rx="2" ry="3.5" fill="#C48838"/>
    </g>
  );
}

function HatCrown() {
  return (
    <g>
      <path d="M76 76 L82 60 L92 72 L100 54 L108 72 L118 60 L124 76 Z" fill="#E4A547"/>
      <rect x="76" y="74" width="48" height="6" fill="#C48838"/>
      <circle cx="84" cy="68" r="1.8" fill="#1F4937"/>
      <circle cx="100" cy="62" r="2.2" fill="#C0461C"/>
      <circle cx="116" cy="68" r="1.8" fill="#1F4937"/>
      <path d="M80 76 L84 66" stroke="#FFD86B" strokeWidth="1.2" strokeLinecap="round" opacity="0.9"/>
    </g>
  );
}

function HatBeanie() {
  return (
    <g>
      <path d="M76 78 Q76 52 100 50 Q124 52 124 78 Z" fill="#7A2916"/>
      <path d="M82 78 L83 60 M92 78 L93 55 M100 78 L100 53 M108 78 L107 55 M118 78 L117 60"
            stroke="#5A1810" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
      <rect x="74" y="74" width="52" height="8" rx="2" fill="#E4A547"/>
      <path d="M74 78 L126 78" stroke="#C48838" strokeWidth="0.8"/>
      <circle cx="100" cy="46" r="6" fill="#F4E3D5"/>
      <circle cx="98" cy="44" r="2" fill="#fff" opacity="0.7"/>
    </g>
  );
}

function HatTopHat() {
  return (
    <g>
      <ellipse cx="100" cy="76" rx="34" ry="4.5" fill="#1A1612"/>
      <path d="M82 76 L82 46 Q82 42 86 42 L114 42 Q118 42 118 46 L118 76 Z" fill="#1A1612"/>
      <ellipse cx="100" cy="44" rx="16" ry="2.5" fill="#2A2620"/>
      <rect x="82" y="66" width="36" height="6" fill="#C0461C"/>
      <rect x="86" y="46" width="2" height="22" fill="#3A2A1F" opacity="0.7"/>
    </g>
  );
}

function HatWizard() {
  return (
    <g>
      <ellipse cx="100" cy="78" rx="36" ry="5" fill="#1F4937"/>
      <path d="M80 78 Q92 78 102 30 Q118 78 120 78 Z" fill="#1F4937"/>
      <path d="M80 78 Q92 78 102 30" stroke="#15392C" strokeWidth="0.8" fill="none"/>
      <path d="M84 76 Q100 80 116 76 L114 70 Q100 74 86 70 Z" fill="#E4A547"/>
      <circle cx="98" cy="60" r="1.6" fill="#FFD86B"/>
      <circle cx="106" cy="52" r="1.2" fill="#FFD86B"/>
      <circle cx="100" cy="42" r="1" fill="#FFD86B"/>
      <path d="M93 67 L94 65 L95 67 L94 69 Z" fill="#FFD86B"/>
    </g>
  );
}

function HatBeret() {
  return (
    <g>
      <ellipse cx="98" cy="64" rx="26" ry="14" fill="#7A2916" transform="rotate(-8 98 64)"/>
      <path d="M76 70 Q98 80 124 70 Q120 78 100 80 Q80 78 76 70 Z" fill="#5A1810"/>
      <path d="M118 50 L122 44" stroke="#5A1810" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="124" cy="42" r="2" fill="#5A1810"/>
      <ellipse cx="86" cy="60" rx="9" ry="3" fill="#E4A547" opacity="0.3" transform="rotate(-12 86 60)"/>
    </g>
  );
}

function HatBaseball() {
  return (
    <g>
      <path d="M76 76 Q76 54 100 52 Q124 54 124 76 Z" fill="#1F4937"/>
      <path d="M88 76 Q90 56 100 52 M112 76 Q110 56 100 52" stroke="#15392C" strokeWidth="1" fill="none"/>
      <circle cx="100" cy="52" r="1.8" fill="#E4A547"/>
      <path d="M98 76 Q130 78 142 92 Q140 96 122 92 Q108 86 98 84 Z" fill="#15392C"/>
      <path d="M94 64 L106 64 L108 72 L92 72 Z" fill="#E4A547"/>
      <path d="M97 66 L103 66 M97 70 L103 70" stroke="#C48838" strokeWidth="1"/>
    </g>
  );
}

function HatPumpkin() {
  return (
    <g>
      <ellipse cx="100" cy="66" rx="26" ry="18" fill="#C0461C"/>
      <ellipse cx="90" cy="66" rx="9" ry="17" fill="#8E2F11"/>
      <ellipse cx="110" cy="66" rx="9" ry="17" fill="#8E2F11"/>
      <ellipse cx="100" cy="66" rx="6" ry="17" fill="#E4A547" opacity="0.35"/>
      <path d="M98 50 Q102 42 108 44" stroke="#1F4937" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <path d="M108 44 Q116 42 118 48 Q112 50 108 44 Z" fill="#1F4937"/>
      <ellipse cx="100" cy="82" rx="26" ry="3" fill="#000" opacity="0.12"/>
    </g>
  );
}

// ─── Face items ───────────────────────────────────────────────────────────────

function FaceAviators() {
  return (
    <g>
      <path d="M99 92 L101 92" stroke="#E4A547" strokeWidth="2" strokeLinecap="round"/>
      <path d="M83 90 Q83 86 92 86 Q102 86 101 90 Q100 102 92 102 Q84 102 83 90 Z" fill="#1A1612"/>
      <path d="M99 90 Q98 86 108 86 Q117 86 117 90 Q116 102 108 102 Q98 102 99 90 Z" fill="#1A1612"/>
      <path d="M85 88 Q92 85 100 87" stroke="#E4A547" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <path d="M100 87 Q108 85 115 88" stroke="#E4A547" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <ellipse cx="88" cy="91" rx="2.5" ry="1.4" fill="#fff" opacity="0.55"/>
      <ellipse cx="104" cy="91" rx="2.5" ry="1.4" fill="#fff" opacity="0.55"/>
    </g>
  );
}

function FaceRoundGlasses() {
  return (
    <g>
      <circle cx="92" cy="96" r="7.5" fill="rgba(255,255,255,0.18)" stroke="#1A1612" strokeWidth="1.8"/>
      <circle cx="108" cy="96" r="7.5" fill="rgba(255,255,255,0.18)" stroke="#1A1612" strokeWidth="1.8"/>
      <path d="M99.5 96 L100.5 96" stroke="#1A1612" strokeWidth="2"/>
      <path d="M88 93 Q90 91 92 92" stroke="#fff" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.7"/>
      <path d="M104 93 Q106 91 108 92" stroke="#fff" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.7"/>
    </g>
  );
}

function FaceMonocle() {
  return (
    <g>
      <circle cx="108" cy="96" r="9" fill="rgba(255,255,255,0.22)" stroke="#E4A547" strokeWidth="2"/>
      <path d="M108 105 Q108 116 96 122" stroke="#E4A547" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
      <path d="M104 92 Q106 90 109 91" stroke="#fff" strokeWidth="1.3" fill="none" strokeLinecap="round" opacity="0.8"/>
    </g>
  );
}

function FaceEyePatch() {
  return (
    <g>
      <path d="M82 86 Q88 88 100 87" stroke="#1A1612" strokeWidth="1.4" fill="none"/>
      <path d="M100 87 Q108 86 118 88 L116 100 Q108 105 100 102 Q102 95 100 87 Z" fill="#1A1612"/>
      <path d="M114 90 L112 96" stroke="#3A2A1F" strokeWidth="1" fill="none"/>
    </g>
  );
}

function FaceStarShades() {
  return (
    <g>
      <path d="M99 94 L101 94" stroke="#C0461C" strokeWidth="2"/>
      <g transform="translate(92 95)">
        <path d="M0 -7 L2 -2 L7.5 -2 L3 1.5 L5 7 L0 3.5 L-5 7 L-3 1.5 L-7.5 -2 L-2 -2 Z" fill="#C0461C"/>
      </g>
      <g transform="translate(108 95)">
        <path d="M0 -7 L2 -2 L7.5 -2 L3 1.5 L5 7 L0 3.5 L-5 7 L-3 1.5 L-7.5 -2 L-2 -2 Z" fill="#C0461C"/>
      </g>
      <circle cx="90" cy="93" r="1.2" fill="#fff" opacity="0.7"/>
      <circle cx="106" cy="93" r="1.2" fill="#fff" opacity="0.7"/>
    </g>
  );
}

// ─── Neck items ───────────────────────────────────────────────────────────────

function NeckBowTie() {
  return (
    <g>
      <path d="M84 115 L84 127 L98 121 Z" fill="#7A2916"/>
      <path d="M116 115 L116 127 L102 121 Z" fill="#7A2916"/>
      <rect x="96" y="117" width="8" height="8" rx="1.5" fill="#5A1810"/>
      <circle cx="88" cy="119" r="1" fill="#E4A547"/>
      <circle cx="90" cy="123" r="1" fill="#E4A547"/>
      <circle cx="112" cy="119" r="1" fill="#E4A547"/>
      <circle cx="110" cy="123" r="1" fill="#E4A547"/>
    </g>
  );
}

function NeckScarf() {
  return (
    <g>
      <path d="M74 116 Q100 126 126 116 L126 124 Q100 134 74 124 Z" fill="#1F4937"/>
      <path d="M82 119 L82 130 M94 121 L94 132 M106 121 L106 132 M118 119 L118 130"
            stroke="#E4A547" strokeWidth="2.2" strokeLinecap="round"/>
      <path d="M118 124 L124 152 L114 152 L112 124 Z" fill="#1F4937"/>
      <path d="M114 152 L124 152" stroke="#E4A547" strokeWidth="2"/>
      <path d="M114 122 Q116 126 120 124" stroke="#15392C" strokeWidth="1" fill="none"/>
    </g>
  );
}

function NeckPearls() {
  return (
    <g>
      <path d="M80 120 Q100 134 120 120" stroke="#F4E3D5" strokeWidth="0.5" fill="none"/>
      {[80, 86, 92, 98, 104, 110, 116, 120].map((x, i) => {
        const y = 120 + Math.sin((i / 7) * Math.PI) * 12;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="2.2" fill="#F4E3D5"/>
            <circle cx={x - 0.6} cy={y - 0.6} r="0.7" fill="#fff" opacity="0.9"/>
          </g>
        );
      })}
      <path d="M100 136 L96 142 L100 148 L104 142 Z" fill="#E4A547"/>
      <circle cx="100" cy="142" r="1.8" fill="#C0461C"/>
    </g>
  );
}

// ─── Chest items ──────────────────────────────────────────────────────────────

function ChestSheriff() {
  return (
    <g transform="translate(100 142)">
      <path d="M0 -10 L2.4 -3 L10 -3 L4 1.6 L6.2 9.5 L0 4.8 L-6.2 9.5 L-4 1.6 L-10 -3 L-2.4 -3 Z"
            fill="#E4A547" stroke="#8B5A18" strokeWidth="0.8"/>
      <path d="M0 -10 L2.4 -3 L10 -3 L4 1.6 L6.2 9.5 L0 4.8 L-6.2 9.5 L-4 1.6 L-10 -3 L-2.4 -3 Z"
            fill="none" stroke="#FFD86B" strokeWidth="0.4" opacity="0.7"/>
      <circle cx="0" cy="0" r="1.6" fill="#8B5A18"/>
    </g>
  );
}

function ChestMedal() {
  return (
    <g>
      <path d="M92 116 L96 138 L100 134 L104 138 L108 116 Z" fill="#C0461C"/>
      <path d="M92 116 L100 134 M108 116 L100 134" stroke="#8E2F11" strokeWidth="0.6"/>
      <circle cx="100" cy="146" r="9" fill="#E4A547" stroke="#8B5A18" strokeWidth="1.2"/>
      <circle cx="100" cy="146" r="6" fill="none" stroke="#C48838" strokeWidth="0.8"/>
      <text x="100" y="150" textAnchor="middle" fill="#8B5A18" fontFamily="serif" fontWeight="700" fontSize="9">1</text>
    </g>
  );
}

// ─── Cape items ───────────────────────────────────────────────────────────────

function CapeHero() {
  return (
    <g>
      <path d="M66 110 Q100 102 134 110 L144 174 Q100 184 56 174 Z" fill="#C0461C"/>
      <path d="M66 110 Q100 102 134 110 L132 118 Q100 110 68 118 Z" fill="#E4A547"/>
      <path d="M78 124 L72 170 M100 122 L100 178 M122 124 L128 170"
            stroke="#8E2F11" strokeWidth="1.4" fill="none" opacity="0.6"/>
      <circle cx="84" cy="115" r="3" fill="#E4A547"/>
      <circle cx="116" cy="115" r="3" fill="#E4A547"/>
      <path d="M84 115 L116 115" stroke="#E4A547" strokeWidth="1.4"/>
    </g>
  );
}

function CapeWings() {
  return (
    <g>
      <path d="M62 116 Q40 124 30 156 Q56 152 76 132 Z" fill="#1F4937"/>
      <path d="M138 116 Q160 124 170 156 Q144 152 124 132 Z" fill="#1F4937"/>
      <path d="M50 132 Q40 140 36 150 M62 124 Q52 132 48 142" stroke="#15392C" strokeWidth="1" fill="none"/>
      <path d="M150 132 Q160 140 164 150 M138 124 Q148 132 152 142" stroke="#15392C" strokeWidth="1" fill="none"/>
      <path d="M58 124 Q48 134 42 148" stroke="#E4A547" strokeWidth="1" fill="none" opacity="0.6"/>
      <path d="M142 124 Q152 134 158 148" stroke="#E4A547" strokeWidth="1" fill="none" opacity="0.6"/>
    </g>
  );
}

// ─── Background items ─────────────────────────────────────────────────────────

function BgForest() {
  return (
    <g>
      <rect width="200" height="200" fill="#D5DFD4"/>
      <rect y="120" width="200" height="80" fill="#B6C9B0"/>
      <circle cx="156" cy="58" r="14" fill="#FBE9C4"/>
      {[20, 48, 168, 184].map((x, i) => (
        <g key={i} transform={`translate(${x} 0)`}>
          <rect x="-3" y="120" width="6" height="20" fill="#7A2916"/>
          <path d="M-16 124 L0 80 L16 124 Z" fill="#1F4937"/>
          <path d="M-13 110 L0 70 L13 110 Z" fill="#1F4937"/>
        </g>
      ))}
      <path d="M0 152 Q10 148 20 152 Q30 150 40 152" stroke="#1F4937" strokeWidth="1.5" fill="none"/>
      <path d="M160 152 Q170 148 180 152 Q190 150 200 152" stroke="#1F4937" strokeWidth="1.5" fill="none"/>
    </g>
  );
}

function BgSunset() {
  return (
    <g>
      <defs>
        <linearGradient id="sunset-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7A2916"/>
          <stop offset="40%" stopColor="#C0461C"/>
          <stop offset="75%" stopColor="#E4A547"/>
          <stop offset="100%" stopColor="#FBE9C4"/>
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#sunset-grad)"/>
      <circle cx="100" cy="130" r="28" fill="#FFD86B" opacity="0.95"/>
      <circle cx="100" cy="130" r="36" fill="#FFD86B" opacity="0.25"/>
      <rect y="150" width="200" height="50" fill="#7A2916" opacity="0.55"/>
      <path d="M30 60 Q34 56 38 60 Q42 56 46 60" stroke="#1A1612" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
      <path d="M150 80 Q154 76 158 80 Q162 76 166 80" stroke="#1A1612" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
    </g>
  );
}

function BgCosmic() {
  return (
    <g>
      <defs>
        <radialGradient id="cosmic-grad" cx="50%" cy="60%">
          <stop offset="0%" stopColor="#3A2D5C"/>
          <stop offset="60%" stopColor="#1F1838"/>
          <stop offset="100%" stopColor="#0F0A20"/>
        </radialGradient>
      </defs>
      <rect width="200" height="200" fill="url(#cosmic-grad)"/>
      {[[20,30],[38,18],[58,42],[170,28],[182,68],[160,12],[14,82],[12,140],[188,118],
        [176,160],[28,170],[80,16],[120,12],[44,68],[154,84]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r={i % 4 === 0 ? 1.6 : 0.9} fill="#FFD86B" opacity={0.6 + (i % 3) * 0.15}/>
      ))}
      <g transform="translate(168 44)">
        <path d="M0 -5 L1.2 -1.2 L5 0 L1.2 1.2 L0 5 L-1.2 1.2 L-5 0 L-1.2 -1.2 Z" fill="#FFD86B"/>
      </g>
      <circle cx="34" cy="48" r="9" fill="#F4E3D5"/>
      <circle cx="38" cy="46" r="7" fill="#3A2D5C"/>
    </g>
  );
}

function BgGrid() {
  return (
    <g>
      <rect width="200" height="200" fill="#F4ECDD"/>
      <defs>
        <pattern id="bg-dots" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.2" fill="#C0461C" opacity="0.35"/>
        </pattern>
      </defs>
      <rect width="200" height="200" fill="url(#bg-dots)"/>
    </g>
  );
}

function BgConfetti() {
  return (
    <g>
      <rect width="200" height="200" fill="#1F4937"/>
      {[[30,40,"#E4A547"],[60,20,"#FFD86B"],[100,52,"#C0461C"],[150,32,"#F4E3D5"],
        [180,72,"#E4A547"],[20,110,"#FFD86B"],[170,140,"#C0461C"],[40,160,"#F4E3D5"],
        [120,178,"#E4A547"],[80,100,"#FFD86B"],[140,108,"#F4E3D5"],[16,68,"#C0461C"]].map(([x,y,c],i) => (
        <rect key={i} x={x as number} y={y as number} width="6" height="2.5" rx="1" fill={c as string}
          transform={`rotate(${(i * 37) % 180} ${(x as number) + 3} ${(y as number) + 1})`}/>
      ))}
    </g>
  );
}

// ─── Registry ─────────────────────────────────────────────────────────────────

export const ITEM_RENDERERS: Record<string, React.FC> = {
  mortarboard: HatMortarboard,
  crown:       HatCrown,
  beanie:      HatBeanie,
  tophat:      HatTopHat,
  wizard:      HatWizard,
  beret:       HatBeret,
  baseball:    HatBaseball,
  pumpkin:     HatPumpkin,
  aviators:    FaceAviators,
  round:       FaceRoundGlasses,
  monocle:     FaceMonocle,
  eyepatch:    FaceEyePatch,
  starshades:  FaceStarShades,
  bowtie:      NeckBowTie,
  scarf:       NeckScarf,
  pearls:      NeckPearls,
  sheriff:     ChestSheriff,
  medal:       ChestMedal,
  cape:        CapeHero,
  wings:       CapeWings,
  forest:      BgForest,
  sunset:      BgSunset,
  cosmic:      BgCosmic,
  dots:        BgGrid,
  confetti:    BgConfetti,
};

// ─── ItemLayer ────────────────────────────────────────────────────────────────

export function ItemLayer({ id }: { id: string }) {
  const Render = ITEM_RENDERERS[id];
  if (!Render) return null;
  return (
    <svg
      viewBox="0 0 200 200"
      width="100%"
      height="100%"
      style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "visible" }}
    >
      <Render />
    </svg>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no new errors from `ItemLayers.tsx`. (Errors in files that still reference the old `emoji` field from `shop.ts` are pre-existing and fixed in later tasks.)

- [ ] **Step 3: Commit**

```bash
git add src/components/gamification/ItemLayers.tsx
git commit -m "feat(shop): add SVG item renderer registry (ItemLayers)"
```

---

## Task 3: Create AvatarWithItems.tsx — compositor and ItemProductShot

**Files:**
- Create: `src/components/gamification/AvatarWithItems.tsx`

- [ ] **Step 1: Create the file**

```tsx
"use client";

import React from "react";
import { FlatTurkey, type FlatTurkeyPalette } from "./FlatTurkey";
import { ItemLayer, ITEM_RENDERERS } from "./ItemLayers";
import { getShopItem } from "@/lib/shop";
import type { EquippedCosmetics } from "@/lib/shop";

const SIZE_PX: Record<string, number> = { xs: 40, sm: 64, md: 96, lg: 160, xl: 220 };

function resolvePx(size: number | string): number {
  return typeof size === "number" ? size : (SIZE_PX[size] ?? 96);
}

export interface AvatarWithItemsProps {
  stage: number;
  size?: number | "xs" | "sm" | "md" | "lg" | "xl";
  equipped?: EquippedCosmetics;
  palette?: FlatTurkeyPalette;
  animate?: boolean;
  showShadow?: boolean;
  className?: string;
}

export function AvatarWithItems({
  stage,
  size = "md",
  equipped = {},
  palette,
  animate = false,
  showShadow = true,
  className,
}: AvatarWithItemsProps) {
  const px = resolvePx(size);
  const BgRenderer = equipped.background ? ITEM_RENDERERS[equipped.background] : undefined;

  return (
    <div className={className} style={{ position: "relative", width: px, height: px, flexShrink: 0 }}>
      {/* Background — clipped to squircle */}
      {BgRenderer && (
        <div style={{ position: "absolute", inset: 0, borderRadius: "32%", overflow: "hidden" }}>
          <svg viewBox="0 0 200 200" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
            <BgRenderer />
          </svg>
        </div>
      )}
      {/* Ground shadow */}
      {showShadow && (
        <svg
          viewBox="0 0 200 200"
          width="100%"
          height="100%"
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        >
          <ellipse cx="100" cy="184" rx="42" ry="5" fill="#1A1612" opacity="0.18" />
        </svg>
      )}
      {/* Cape (behind turkey) */}
      {equipped.cape && <ItemLayer id={equipped.cape} />}
      {/* Turkey */}
      <div style={{ position: "absolute", inset: 0 }}>
        <FlatTurkey stage={stage} size={px} palette={palette} animate={animate} />
      </div>
      {/* Hat */}
      {equipped.hat && <ItemLayer id={equipped.hat} />}
      {/* Face */}
      {equipped.face && <ItemLayer id={equipped.face} />}
      {/* Neck */}
      {equipped.neck && <ItemLayer id={equipped.neck} />}
      {/* Chest */}
      {equipped.chest && <ItemLayer id={equipped.chest} />}
    </div>
  );
}

export function ItemProductShot({
  itemId,
  stage = 5,
  size = 120,
}: {
  itemId: string;
  stage?: number;
  size?: number;
}) {
  const item = getShopItem(itemId);
  if (!item) return null;

  if (item.slot === "background") {
    const BgRenderer = ITEM_RENDERERS[itemId];
    if (!BgRenderer) return null;
    return (
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: "inherit" }}>
        <svg viewBox="0 0 200 200" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
          <BgRenderer />
        </svg>
      </div>
    );
  }

  return (
    <AvatarWithItems
      stage={stage}
      size={size}
      equipped={{ [item.slot]: item.id }}
      showShadow={false}
    />
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors from the two new files.

- [ ] **Step 3: Commit**

```bash
git add src/components/gamification/AvatarWithItems.tsx
git commit -m "feat(shop): add AvatarWithItems compositor and ItemProductShot"
```

---

## Task 4: Update shop/page.tsx

**Files:**
- Modify: `src/app/(app)/shop/page.tsx`

- [ ] **Step 1: Update imports and types at the top of the file**

Replace the existing imports block and type definitions:

```tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Badge } from "@/components/ui/Badge";
import { FlatTurkey } from "@/components/gamification/FlatTurkey";
import { AvatarWithItems, ItemProductShot } from "@/components/gamification/AvatarWithItems";
import type { EquippedCosmetics, ShopSlot } from "@/lib/shop";
import { SHOP_SLOTS } from "@/lib/shop";

interface ShopItemRow {
  id: string;
  name: string;
  slot: ShopSlot;
  cost: number;
  accent: string;
  accentBg: string;
  isNew?: boolean;
  unlockAt?: number;
  owned: boolean;
  canAfford: boolean;
}

interface ShopPayload {
  featherBalance: number;
  level: number;
  equipped: EquippedCosmetics;
  items: ShopItemRow[];
}

const SLOT_LABEL: Record<ShopSlot, string> = {
  background: "Backgrounds",
  hat:        "Hats",
  face:       "Faces",
  neck:       "Neck",
  chest:      "Chest",
  cape:       "Cape",
};

const SLOT_ACCENT: Record<ShopSlot, string> = {
  background: "bg-forest-100",
  hat:        "bg-ochre-soft",
  face:       "bg-primary-soft",
  neck:       "bg-plume-100",
  chest:      "bg-ochre-soft",
  cape:       "bg-primary-soft",
};

type Filter = "all" | ShopSlot;
```

- [ ] **Step 2: Replace the hero preview section**

Find this block in `ShopPage` (around line 142):
```tsx
{/* Hero preview */}
<div className="relative overflow-hidden rounded-3xl border border-line bg-surface p-5">
  ...
  <div className="relative flex items-center gap-4">
    <FlatTurkey stage={data.level} size={140} />
```

Replace the `<FlatTurkey stage={data.level} size={140} />` line with:
```tsx
    <AvatarWithItems stage={data.level} size={140} equipped={data.equipped} />
```

- [ ] **Step 3: Replace ShopItemCard's emoji tile with ItemProductShot**

Find the `ShopItemCard` function. Replace this:
```tsx
function ShopItemCard({
  item, equippedHere, onBuy, onEquip, onUnequip, busy,
}: {
  item: ShopItemRow;
  equippedHere: boolean;
  onBuy: () => void;
  onEquip: () => void;
  onUnequip: () => void;
  busy: boolean;
}) {
  const accent = {
    background: "bg-forest-100",
    hat:        "bg-ochre-soft",
    face:       "bg-primary-soft",
    accessory:  "bg-plume-100",
  }[item.slot];

  return (
    <div
      className={`overflow-hidden rounded-2xl border bg-surface p-2.5 transition-colors ${
        equippedHere ? "border-forest-500" : "border-line"
      }`}
    >
      <div className={`relative flex aspect-square items-center justify-center overflow-hidden rounded-xl ${accent}`}>
        <div className="pointer-events-none absolute inset-2 rounded-xl border border-dashed border-white/45" />
        <span
          className="text-[46px] leading-none"
          style={!item.owned && !item.canAfford ? { filter: "grayscale(0.6) opacity(0.7)" } : undefined}
        >
          {item.emoji}
        </span>
        <Badge tone="dark" size="sm" variant="solid" className="absolute left-2 top-2">
          {item.slot}
        </Badge>
      </div>
```

With:
```tsx
function ShopItemCard({
  item, equippedHere, onBuy, onEquip, onUnequip, busy,
}: {
  item: ShopItemRow;
  equippedHere: boolean;
  onBuy: () => void;
  onEquip: () => void;
  onUnequip: () => void;
  busy: boolean;
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border bg-surface p-2.5 transition-colors ${
        equippedHere ? "border-forest-500" : "border-line"
      }`}
    >
      <div
        className="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl"
        style={{ background: item.accentBg }}
      >
        <div className="pointer-events-none absolute inset-2 rounded-xl border border-dashed border-white/45" />
        <div
          style={!item.owned && !item.canAfford ? { filter: "grayscale(0.6) opacity(0.7)" } : undefined}
          className="flex items-center justify-center"
        >
          <ItemProductShot itemId={item.id} size={90} />
        </div>
        {item.isNew && (
          <Badge tone="primary" size="sm" variant="solid" className="absolute right-2 top-2">
            New
          </Badge>
        )}
        <Badge tone="dark" size="sm" variant="solid" className="absolute left-2 top-2">
          {item.slot}
        </Badge>
      </div>
```

- [ ] **Step 4: Update the loading state to keep FlatTurkey (it's a spinner, not user's avatar)**

The loading state at the top of `ShopPage` already uses `FlatTurkey stage={1}` — leave it unchanged.

- [ ] **Step 5: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors from `shop/page.tsx`.

- [ ] **Step 6: Start dev server and smoke-check the shop page**

```bash
npm run dev
```

Navigate to `/shop`. Verify:
- Hero shows the turkey + any equipped items layered on top
- Item cards show mini turkey product shots instead of emoji
- Filter tabs include Neck / Chest / Cape
- Buying and equipping an item updates the hero preview

- [ ] **Step 7: Commit**

```bash
git add src/app/\(app\)/shop/page.tsx
git commit -m "feat(shop): render SVG item product shots and live avatar preview"
```

---

## Task 5: Update dashboard/page.tsx

**Files:**
- Modify: `src/app/(app)/dashboard/page.tsx`

- [ ] **Step 1: Add AvatarWithItems import**

At the top of the file, add alongside the existing FlatTurkey import:
```tsx
import { AvatarWithItems } from "@/components/gamification/AvatarWithItems";
```

- [ ] **Step 2: Replace the hero FlatTurkey**

Find (around line 107):
```tsx
<FlatTurkey stage={userData.level} size={120} animate />
```

Replace with:
```tsx
<AvatarWithItems stage={userData.level} size={120} equipped={userData.equippedCosmetics} animate />
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Smoke-check the dashboard**

Navigate to `/dashboard`. Verify the hero turkey shows equipped items.

- [ ] **Step 5: Commit**

```bash
git add src/app/\(app\)/dashboard/page.tsx
git commit -m "feat(dashboard): show equipped cosmetics on hero avatar"
```

---

## Task 6: Update profile/page.tsx

**Files:**
- Modify: `src/app/(app)/profile/page.tsx`

- [ ] **Step 1: Add AvatarWithItems import**

```tsx
import { AvatarWithItems } from "@/components/gamification/AvatarWithItems";
```

- [ ] **Step 2: Replace the profile hero FlatTurkey**

Find (around line 87):
```tsx
<FlatTurkey stage={userData.level} size={180} animate />
```

Replace with:
```tsx
<AvatarWithItems stage={userData.level} size={180} equipped={userData.equippedCosmetics} animate />
```

Do NOT replace the stage evolution grid (the `FlatTurkey stage={s} size={56}` loop below it) — those are decorative level previews, not the user's personal avatar.

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Smoke-check the profile page**

Navigate to `/profile`. Verify the hero avatar shows equipped items.

- [ ] **Step 5: Commit**

```bash
git add src/app/\(app\)/profile/page.tsx
git commit -m "feat(profile): show equipped cosmetics on profile hero avatar"
```

---

## Task 7: Update leaderboard/RankingTable.tsx

**Files:**
- Modify: `src/components/leaderboard/RankingTable.tsx`

- [ ] **Step 1: Swap import**

Remove:
```tsx
import { TurkeyAvatar } from "../gamification/TurkeyAvatar";
```

Add:
```tsx
import { AvatarWithItems } from "../gamification/AvatarWithItems";
```

- [ ] **Step 2: Replace TurkeyAvatar usage**

Find:
```tsx
<TurkeyAvatar
  level={entry.level}
  size="xs"
  animate={false}
  equipped={entry.equippedCosmetics}
/>
```

Replace with:
```tsx
<AvatarWithItems
  stage={entry.level}
  size="xs"
  equipped={entry.equippedCosmetics ?? {}}
  animate={false}
  showShadow={false}
/>
```

`showShadow={false}` is appropriate here — the shadow ellipse would be hidden by the row background anyway.

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Smoke-check the leaderboard**

Navigate to the leaderboard. Verify avatar rows show equipped cosmetics.

- [ ] **Step 5: Commit**

```bash
git add src/components/leaderboard/RankingTable.tsx
git commit -m "feat(leaderboard): render SVG item layers on ranking avatars"
```

---

## Task 8: Wire equippedCosmetics into ScoreSummary

**Files:**
- Modify: `src/components/chat/ChatInterface.tsx` — add field to `FinishResult`
- Modify: `src/app/api/chat/route.ts` — include `equippedCosmetics` in finish response
- Modify: `src/components/chat/ScoreSummary.tsx` — `TurkeyAvatar` → `AvatarWithItems`

- [ ] **Step 1: Add equippedCosmetics to FinishResult in ChatInterface.tsx**

Find the `FinishResult` interface (line 13):
```ts
export interface FinishResult {
  overallScore: number;
  dimensions: Record<string, number> | null;
  xp: { base: number; difficultyBonus: number; dailyBonus: number; streakMultiplier: number; total: number };
  feathers: { base: number; difficultyBonus: number; dailyBonus: number; total: number };
  previousLevel: number;
  newLevel: number;
  newBadges: string[];
  streak: number;
}
```

Add the import and new field:
```ts
import type { EquippedCosmetics } from "@/lib/shop";

export interface FinishResult {
  overallScore: number;
  dimensions: Record<string, number> | null;
  xp: { base: number; difficultyBonus: number; dailyBonus: number; streakMultiplier: number; total: number };
  feathers: { base: number; difficultyBonus: number; dailyBonus: number; total: number };
  previousLevel: number;
  newLevel: number;
  newBadges: string[];
  streak: number;
  equippedCosmetics?: EquippedCosmetics;
}
```

- [ ] **Step 2: Add equippedCosmetics to the API response in api/chat/route.ts**

The route already fetches `user` via `prisma.user.findUnique`. Add `equippedCosmetics` to the return at the end of the finish block. Find the `return NextResponse.json({` block that returns `finished: true`:

```ts
import { parseEquippedCosmetics } from "@/lib/shop";
```

(add this import near the top of the file alongside other lib imports)

Then in the return statement, add `equippedCosmetics` after `streak`:

```ts
return NextResponse.json({
  finished: true,
  overallScore,
  dimensions: dimensionsOut,
  xp: xpResult,
  feathers: featherResult,
  previousLevel: user.level,
  newLevel,
  newBadges,
  streak: newStreak,
  equippedCosmetics: parseEquippedCosmetics(user.equippedCosmetics),
});
```

- [ ] **Step 3: Update ScoreSummary.tsx**

Replace the `TurkeyAvatar` import:
```tsx
import { AvatarWithItems } from "../gamification/AvatarWithItems";
```

Find all three `TurkeyAvatar` usages in `ScoreSummary.tsx`:

**Usage 1** — phase "old":
```tsx
<TurkeyAvatar level={previousLevel} size="lg" animate={false} />
```
Replace with:
```tsx
<AvatarWithItems stage={previousLevel} size="lg" animate={false} showShadow={false} />
```

**Usage 2** — phase "glow":
```tsx
<TurkeyAvatar level={previousLevel} size="lg" animate={false} />
```
Replace with:
```tsx
<AvatarWithItems stage={previousLevel} size="lg" animate={false} showShadow={false} />
```

**Usage 3** — phase "new" and the final summary:
```tsx
<TurkeyAvatar level={newLevel} size="xl" />
```
Replace with:
```tsx
<AvatarWithItems stage={newLevel} size="xl" equipped={result.equippedCosmetics ?? {}} />
```

Also replace the final usage in the summary card:
```tsx
<TurkeyAvatar level={result.newLevel} size="lg" />
```
Replace with:
```tsx
<AvatarWithItems stage={result.newLevel} size="lg" equipped={result.equippedCosmetics ?? {}} />
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 5: Smoke-check post-debate summary**

Start a debate, finish it, and verify the score summary screen shows the equipped items on the avatar.

- [ ] **Step 6: Commit**

```bash
git add src/components/chat/ChatInterface.tsx src/app/api/chat/route.ts src/components/chat/ScoreSummary.tsx
git commit -m "feat(chat): show equipped cosmetics on post-debate score summary"
```

---

## Self-Review Checklist

### Spec coverage

| Spec requirement | Task |
|---|---|
| New slots: hat/face/neck/chest/cape/background | Task 1 |
| Remove `accessory` slot | Task 1 |
| Remove `emoji`, add `accent`/`accentBg`/`isNew`/`unlockAt` | Task 1 |
| 27-item catalog | Task 1 |
| `parseEquippedCosmetics` drops old item ids silently | Task 1 (same logic, new SHOP_SLOTS) |
| `ITEM_RENDERERS` + `ItemLayer` | Task 2 |
| `AvatarWithItems` compositor with correct z-order | Task 3 |
| `ItemProductShot` (backgrounds full-bleed, others mini turkey) | Task 3 |
| Shop hero shows `AvatarWithItems` | Task 4 |
| Shop cards show `ItemProductShot` | Task 4 |
| Filter tabs include all 6 slots | Task 4 (SHOP_SLOTS.map auto-includes new slots; SLOT_LABEL covers all 6) |
| Dashboard hero | Task 5 |
| Profile hero | Task 6 |
| Leaderboard rows | Task 7 |
| ScoreSummary with equippedCosmetics from API | Task 8 |
| `TurkeyAvatar` left in place (not deleted) | implicit — none of the tasks delete it |

### No circular imports

- `ItemLayers.tsx` imports nothing from this project
- `AvatarWithItems.tsx` imports from `ItemLayers.tsx` and `FlatTurkey.tsx` — no cycle
- `ItemProductShot` is in `AvatarWithItems.tsx` and calls `AvatarWithItems` from the same file — fine

### Type consistency

- `AvatarWithItems` accepts `size?: number | "xs" | "sm" | "md" | "lg" | "xl"` — matches what callers pass (`size={120}`, `size="lg"`, etc.)
- `equipped` is `EquippedCosmetics` everywhere, typed as `Partial<Record<ShopSlot, string>>` — all new slot keys are valid
- `ItemLayer` takes `{ id: string }` — called as `<ItemLayer id={equipped.hat} />` where `equipped.hat` is `string | undefined`; the conditional `{equipped.hat && <ItemLayer id={equipped.hat} />}` ensures `id` is always `string` at call time ✓
