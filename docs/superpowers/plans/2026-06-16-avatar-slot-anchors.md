# Avatar Slot Anchors Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add per-slot (x, y) translation offsets for side-profile avatar stages so shop items land on the correct body region.

**Architecture:** A new `avatarAnchors.ts` data file holds the offset table. `ItemLayer` gets one new optional `translate` prop that wraps its renderer in an SVG `<g transform>`. `AvatarWithItems` looks up and passes the offset for each slot.

**Tech Stack:** TypeScript, React, Next.js App Router, SVG

## Global Constraints

- No test framework is installed — use `npx tsc --noEmit` to verify TypeScript after each task
- Do not modify any item renderer functions in `ItemLayers.tsx`
- `background` slot never receives an offset
- Offset values in `STAGE_SLOT_OFFSETS` are starting estimates; visual tuning happens in Task 4

---

### Task 1: Create `src/lib/avatarAnchors.ts`

**Files:**
- Create: `src/lib/avatarAnchors.ts`

**Interfaces:**
- Produces:
  - `SlotOffset = { x: number; y: number }`
  - `StageAnchors = Partial<Record<ShopSlot, SlotOffset>>`
  - `getSlotOffset(stage: number, slot: ShopSlot): SlotOffset`

- [ ] **Step 1: Create the file**

`src/lib/avatarAnchors.ts`:

```ts
import type { ShopSlot } from "./shop";

export type SlotOffset = { x: number; y: number };
export type StageAnchors = Partial<Record<ShopSlot, SlotOffset>>;

// Only stages with non-forward-facing layouts need entries.
// Offsets are starting estimates — tune visually after first render (Task 4).
export const STAGE_SLOT_OFFSETS: Record<number, StageAnchors> = {
  3: {
    hat:   { x: -28, y: -10 },
    face:  { x: -30, y: -10 },
    neck:  { x: -20, y:  -5 },
    chest: { x: -10, y: -10 },
    cape:  { x: -10, y:   0 },
  },
  4: {
    hat:   { x: -26, y:  -8 },
    face:  { x: -28, y:  -8 },
    neck:  { x: -18, y:  -4 },
    chest: { x:  -8, y:  -8 },
    cape:  { x:  -8, y:   0 },
  },
};

export function getSlotOffset(stage: number, slot: ShopSlot): SlotOffset {
  return STAGE_SLOT_OFFSETS[stage]?.[slot] ?? { x: 0, y: 0 };
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/avatarAnchors.ts
git commit -m "feat(avatarAnchors): add per-slot offset table for side-profile stages"
```

---

### Task 2: Add `translate` prop to `ItemLayer`

**Files:**
- Modify: `src/components/gamification/ItemLayers.tsx` — `ItemLayer` function only (last ~15 lines)

**Interfaces:**
- Consumes: `SlotOffset` from `src/lib/avatarAnchors.ts`
- Produces: `ItemLayer({ id, translate? })` — same as before when `translate` is omitted

- [ ] **Step 1: Add the import and update `ItemLayer`**

In `src/components/gamification/ItemLayers.tsx`, add the import at the top of the file (after the existing `import React from "react";`):

```ts
import type { SlotOffset } from "@/lib/avatarAnchors";
```

Then replace the existing `ItemLayer` function (currently lines 408–421) with:

```tsx
export function ItemLayer({ id, translate }: { id: string; translate?: SlotOffset }) {
  const Render = ITEM_RENDERERS[id];
  if (!Render) return null;
  return (
    <svg
      viewBox="0 0 200 200"
      width="100%"
      height="100%"
      style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "visible" }}
    >
      <g transform={translate ? `translate(${translate.x} ${translate.y})` : undefined}>
        <Render />
      </g>
    </svg>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/gamification/ItemLayers.tsx
git commit -m "feat(ItemLayer): add optional translate prop for slot offset"
```

---

### Task 3: Wire offsets in `AvatarWithItems`

**Files:**
- Modify: `src/components/gamification/AvatarWithItems.tsx`

**Interfaces:**
- Consumes:
  - `getSlotOffset(stage: number, slot: ShopSlot): SlotOffset` from `src/lib/avatarAnchors`
  - `ItemLayer({ id, translate? })` from Task 2

- [ ] **Step 1: Add the import**

In `src/components/gamification/AvatarWithItems.tsx`, add to the existing imports:

```ts
import { getSlotOffset } from "@/lib/avatarAnchors";
```

- [ ] **Step 2: Pass offsets to each `ItemLayer` call**

In the `AvatarWithItems` function body, replace the five foreground `ItemLayer` calls (currently lines 59, 65, 67, 69, 71) with:

```tsx
{/* Cape (behind turkey) */}
{equipped.cape && <ItemLayer id={equipped.cape} translate={getSlotOffset(stage, "cape")} />}
{/* Turkey */}
<div style={{ position: "absolute", inset: 0 }}>
  <FlatTurkey stage={stage} size={px} palette={palette} animate={animate} />
</div>
{/* Hat */}
{equipped.hat && <ItemLayer id={equipped.hat} translate={getSlotOffset(stage, "hat")} />}
{/* Face */}
{equipped.face && <ItemLayer id={equipped.face} translate={getSlotOffset(stage, "face")} />}
{/* Neck */}
{equipped.neck && <ItemLayer id={equipped.neck} translate={getSlotOffset(stage, "neck")} />}
{/* Chest */}
{equipped.chest && <ItemLayer id={equipped.chest} translate={getSlotOffset(stage, "chest")} />}
```

The background `ItemLayer` call (line 35–45) is unchanged — do not add a translate to it.

- [ ] **Step 3: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/gamification/AvatarWithItems.tsx
git commit -m "feat(AvatarWithItems): apply per-slot anchor offsets for side-profile stages"
```

---

### Task 4: Visual tuning

**Files:**
- Modify: `src/lib/avatarAnchors.ts` — numeric values only

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

- [ ] **Step 2: Equip items on stage 3 and 4 avatars**

Navigate to a page that renders `AvatarWithItems` (shop, profile, dashboard, or leaderboard). Set the avatar to stage 3 and equip one item in each slot (hat, face, neck, chest, cape). Repeat for stage 4.

To force a specific stage for testing, temporarily hardcode `stage={3}` or `stage={4}` in a render call.

- [ ] **Step 3: Adjust offsets until items sit correctly on the avatar**

Edit `src/lib/avatarAnchors.ts` — tune the x/y values in `STAGE_SLOT_OFFSETS` until each item visually lands on the correct body region. The dev server hot-reloads on save.

Reference coordinates from `FlatTurkey.tsx`:
- Stage 3 head center: `(72, 86)`, top of head ≈ y=60, beak at ≈ x=46–56
- Stage 4 head center: `(74, 82)`, top of head ≈ y=58, beak at ≈ x=48–58
- Forward-facing head center (stages 5+): `(100, 96)`

The x offset for hats is approximately `headCenterX - 100`. The y offset depends on how high the stage's head sits relative to stage 5.

- [ ] **Step 4: Commit tuned values**

```bash
git add src/lib/avatarAnchors.ts
git commit -m "fix(avatarAnchors): tune slot offsets for stages 3 and 4 after visual review"
```
