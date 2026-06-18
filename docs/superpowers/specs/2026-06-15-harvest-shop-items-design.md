# Harvest Shop Items — SVG Cosmetics Design

**Date:** 2026-06-15  
**Status:** Approved  
**Source reference:** `_handoff/design-references/harvest-shop-items.jsx`

---

## Overview

Replace the shop's 11 emoji-based cosmetic items with 27 SVG-rendered items from the Harvest design reference. Equipped items must render visually on the turkey avatar at every point in the app where the user's personal avatar is shown.

---

## 1. Data Layer — `src/lib/shop.ts`

### Slot changes
Remove `accessory`. Add `neck`, `chest`, `cape`.

```ts
export type ShopSlot = "hat" | "face" | "neck" | "chest" | "cape" | "background";
export const SHOP_SLOTS: ShopSlot[] = ["background", "cape", "hat", "face", "neck", "chest"];
```

`SHOP_SLOTS` order follows render z-depth (background deepest → chest on top), which `parseEquippedCosmetics` and `serializeEquippedCosmetics` already use to iterate.

### ShopItem interface changes
Remove `emoji: string` and `zIndex: number`. Add:

```ts
accent: string;      // primary color for card theming
accentBg: string;    // background tint for the card tile
isNew?: boolean;
unlockAt?: number;   // minimum level required
```

### Catalog replacement
Replace all 11 existing entries with 27 items keyed by their renderer ids:

| Category | Items (id → name) |
|---|---|
| Hat (8) | mortarboard, crown, beanie, tophat, wizard, beret, baseball, pumpkin |
| Face (5) | aviators, round, monocle, eyepatch, starshades |
| Neck (3) | bowtie, scarf, pearls |
| Chest (2) | sheriff, medal |
| Cape (2) | cape, wings |
| Background (5) | forest, sunset, cosmic, dots, confetti |

Costs, accents, and `isNew`/`unlockAt` flags match the reference exactly.

### Migration behavior
`parseEquippedCosmetics` silently drops any stored slot value whose id is not in the new catalog. Users with old items (e.g. `bg-meadow`) will see those slots cleared on next load — no DB migration needed.

---

## 2. Item Renderers — `src/components/gamification/ItemLayers.tsx`

New file. All 27 SVG item components from the design reference, converted to TypeScript `React.FC`.

All items render within a `200×200` viewBox, matching `FlatTurkey`'s coordinate space so they snap to the correct anatomical anchors without any resize math.

**Exports:**

```ts
ITEM_RENDERERS: Record<string, React.FC>
// keyed by item id: "mortarboard", "forest", etc.

function ItemLayer({ id }: { id: string }): JSX.Element | null
// Renders one item in a position:absolute inset-0 SVG overlay.
// Returns null if id has no registered renderer.
```

`ItemProductShot` lives in `AvatarWithItems.tsx` (not here) to avoid a circular import — it needs `AvatarWithItems`, which already imports from this file.

---

## 3. Avatar Compositor — `src/components/gamification/AvatarWithItems.tsx`

New file. Wraps `FlatTurkey` with absolute-positioned item layers.

Also exports `ItemProductShot`:

```ts
function ItemProductShot({ itemId, stage, size }: {
  itemId: string;
  stage?: number;   // defaults to 5 (Tom — full turkey)
  size?: number;    // defaults to 120
}): JSX.Element | null
// For backgrounds: full-bleed SVG preview, no turkey.
// For all other slots: AvatarWithItems with only that one item equipped.
```

```ts
interface AvatarWithItemsProps {
  stage: number;
  size?: number | "xs" | "sm" | "md" | "lg" | "xl";
  equipped?: EquippedCosmetics;
  palette?: FlatTurkeyPalette;
  animate?: boolean;
  showShadow?: boolean;   // defaults to true
  className?: string;
}
```

**Render z-order (outermost → innermost):**

```
[container: position:relative, width×height px square]
  ├── background  → clipped squircle div (borderRadius 32%, overflow hidden), full-bleed SVG
  ├── shadow      → absolute SVG ellipse (if showShadow)
  ├── cape        → ItemLayer (behind turkey)
  ├── FlatTurkey  → absolute inset-0
  ├── hat         → ItemLayer
  ├── face        → ItemLayer
  ├── neck        → ItemLayer
  └── chest       → ItemLayer
```

Empty or missing slots render nothing. `equipped` being undefined renders a bare `FlatTurkey` with shadow — identical to current behavior.

Size resolution: numeric px passed through; shorthand keys resolved via the same `SIZE_PX` map used in `FlatTurkey` (`xs`=40, `sm`=64, `md`=96, `lg`=160, `xl`=220).

---

## 4. Call Site Updates

### Replace with `AvatarWithItems` (user's personal avatar)

| File | Location | Equipped data source |
|---|---|---|
| `src/app/(app)/shop/page.tsx` | Hero preview | `data.equipped` (already in state) |
| `src/app/(app)/dashboard/page.tsx` | Hero card | `userData.equippedCosmetics` (already in state) |
| `src/app/(app)/profile/page.tsx` | Profile hero | `userData.equippedCosmetics` (already in state) |
| `src/components/leaderboard/RankingTable.tsx` | Row avatars | `entry.equippedCosmetics` (leaderboard API already returns it) |
| `src/components/chat/ScoreSummary.tsx` | Post-debate summary | Add `equippedCosmetics` to `FinishResult` from the score API |

### Shop item cards
Replace `<span className="text-[46px]">{item.emoji}</span>` tile with `<ItemProductShot itemId={item.id} />`.

Update `ShopItemRow` interface: remove `emoji`, add `accent`, `accentBg`, `isNew?`, `unlockAt?`.

Update filter tabs: remove `accessory`, add `neck`, `chest`, `cape`. Group display labels:
- `neck` → "Neck"
- `chest` → "Chest"  
- `cape` → "Cape"
- Keep existing: `background` → "Backgrounds", `hat` → "Hats", `face` → "Faces"

Update `SLOT_LABEL` and `SLOT_ACCENT` maps to cover all 6 slots:

```ts
const SLOT_LABEL: Record<ShopSlot, string> = {
  background: "Backgrounds", hat: "Hats", face: "Faces",
  neck: "Neck", chest: "Chest", cape: "Cape",
};
const SLOT_ACCENT: Record<ShopSlot, string> = {
  background: "bg-forest-100", hat: "bg-ochre-soft",
  face: "bg-primary-soft",    neck: "bg-plume-100",
  chest: "bg-ochre-soft",     cape: "bg-primary-soft",
};
```

### Keep as bare `FlatTurkey` (decorative / stage-illustrative)

- `LevelUpModal.tsx` — before/after evolution stages
- Difficulty selector cards in `chat/page.tsx`
- Loading spinners in all pages
- Background silhouettes in `DailyChallenge.tsx` and `skills/page.tsx`
- Stage evolution grid in `profile/page.tsx`
- `FlatTurkeyGlyph` in `TopAppBar.tsx` (24px icon, too small for layers)

---

## 5. ScoreSummary / FinishResult

`ScoreSummary` currently uses the old `TurkeyAvatar`. To show equipped items here:

1. Add `equippedCosmetics?: EquippedCosmetics` to the `FinishResult` type in `ChatInterface.tsx`
2. The score API response (`/api/chat/[id]/finish` or equivalent) must include the user's current `equippedCosmetics`
3. Pass `equipped={result.equippedCosmetics}` to `AvatarWithItems` in `ScoreSummary`

---

## 6. API / Validation

`/api/shop/equip` route: `isSlot()` guard checks against `SHOP_SLOTS`. After the slot change this already handles all 6 slots correctly — no logic changes needed, just recompile.

`/api/shop/purchase` route: no changes needed.

`/api/leaderboard` route: already returns `equippedCosmetics` — no changes needed.

---

## Out of scope

- Any new purchase flow or pricing UI changes
- Bundle/discount features shown in `harvest-shop.jsx` design mockup
- Animations on item layers
- `TurkeyAvatar.tsx` (old emoji component) — leave in place but unused after this work; can be deleted in a follow-up cleanup
