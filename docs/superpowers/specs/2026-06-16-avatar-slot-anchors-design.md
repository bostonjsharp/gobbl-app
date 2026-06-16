# Avatar Slot Anchors — Design Spec

**Date:** 2026-06-16
**Branch:** ui-overhaul

## Problem

Stages 3 (Poult) and 4 (Youngster) are side-profile, left-facing avatars. All shop item artwork in `ItemLayers.tsx` is drawn for a forward-facing avatar with the head centered at approximately (100, 96) in the 200×200 SVG viewBox. When items are layered on side-profile stages, they land in the wrong position (e.g. a hat sits in empty air to the right of the actual head).

Affected stages:
- **Stage 3** — head center at ~(72, 86), facing left
- **Stage 4** — head center at ~(74, 82), facing left

Forward-facing stages (5–8) are unaffected. Stages 1–2 (egg/hatchling) have no meaningful head/body slots for most items.

## Decision

Apply per-slot (x, y) translation offsets per stage. Item artwork stays unchanged — the offset shifts the item into the correct region for each avatar's geometry. No new art is required.

## Architecture

### New file: `src/lib/avatarAnchors.ts`

Exports a lookup table of translation offsets keyed by stage and slot:

```ts
export type SlotOffset = { x: number; y: number };
export type StageAnchors = Partial<Record<ShopSlot, SlotOffset>>;

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

Only non-default stages need entries. `background` is never offset — it fills the full frame.

Offset values are starting estimates from SVG coordinate analysis and will need visual tuning after first render.

### `src/components/gamification/ItemLayers.tsx` — `ItemLayer` change

Add optional `translate` prop. Item renderer is wrapped in a `<g transform="translate(x y)">` when an offset is provided:

```tsx
export function ItemLayer({ id, translate }: { id: string; translate?: SlotOffset }) {
  const Render = ITEM_RENDERERS[id];
  if (!Render) return null;
  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%"
      style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "visible" }}>
      <g transform={translate ? `translate(${translate.x} ${translate.y})` : undefined}>
        <Render />
      </g>
    </svg>
  );
}
```

No changes to any item renderer functions.

### `src/components/gamification/AvatarWithItems.tsx` — pass offsets

Import `getSlotOffset` and pass the resolved offset to each foreground `ItemLayer`:

```tsx
{equipped.hat   && <ItemLayer id={equipped.hat}   translate={getSlotOffset(stage, "hat")} />}
{equipped.face  && <ItemLayer id={equipped.face}  translate={getSlotOffset(stage, "face")} />}
{equipped.neck  && <ItemLayer id={equipped.neck}  translate={getSlotOffset(stage, "neck")} />}
{equipped.chest && <ItemLayer id={equipped.chest} translate={getSlotOffset(stage, "chest")} />}
{equipped.cape  && <ItemLayer id={equipped.cape}  translate={getSlotOffset(stage, "cape")} />}
```

Background `ItemLayer` call is unchanged.

## Files Changed

| File | Change |
|------|--------|
| `src/lib/avatarAnchors.ts` | New — offset lookup table |
| `src/components/gamification/ItemLayers.tsx` | Add `translate` prop to `ItemLayer` |
| `src/components/gamification/AvatarWithItems.tsx` | Import `getSlotOffset`, pass to each `ItemLayer` |

## Out of Scope

- Rotation or scale transforms (translation only for now)
- Side-profile redraws of item artwork
- Stages 1–2 (egg/hatchling have no meaningful item slots)
