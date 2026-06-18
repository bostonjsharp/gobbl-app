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
