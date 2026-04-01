export type ShopSlot = "hat" | "face" | "accessory" | "background";

export interface ShopItem {
  id: string;
  name: string;
  slot: ShopSlot;
  price: number;
  emoji: string;
  /** Higher draws on top for same-avatar stacking */
  zIndex: number;
}

export const SHOP_SLOTS: ShopSlot[] = ["background", "hat", "face", "accessory"];

export const SHOP_CATALOG: ShopItem[] = [
  {
    id: "bg-meadow",
    name: "Meadow",
    slot: "background",
    price: 80,
    emoji: "🌿",
    zIndex: 0,
  },
  {
    id: "bg-sunset",
    name: "Sunset Sky",
    slot: "background",
    price: 120,
    emoji: "🌅",
    zIndex: 0,
  },
  {
    id: "bg-space",
    name: "Starfield",
    slot: "background",
    price: 200,
    emoji: "✨",
    zIndex: 0,
  },
  {
    id: "hat-party",
    name: "Party Hat",
    slot: "hat",
    price: 150,
    emoji: "🎉",
    zIndex: 20,
  },
  {
    id: "hat-crown",
    name: "Tiny Crown",
    slot: "hat",
    price: 350,
    emoji: "👑",
    zIndex: 20,
  },
  {
    id: "hat-beret",
    name: "Artist Beret",
    slot: "hat",
    price: 180,
    emoji: "🎨",
    zIndex: 20,
  },
  {
    id: "face-glasses",
    name: "Cool Shades",
    slot: "face",
    price: 140,
    emoji: "😎",
    zIndex: 15,
  },
  {
    id: "face-monocle",
    name: "Monocle",
    slot: "face",
    price: 220,
    emoji: "🧐",
    zIndex: 15,
  },
  {
    id: "acc-scarf",
    name: "Cozy Scarf",
    slot: "accessory",
    price: 160,
    emoji: "🧣",
    zIndex: 12,
  },
  {
    id: "acc-wand",
    name: "Sparkle Wand",
    slot: "accessory",
    price: 280,
    emoji: "✨",
    zIndex: 18,
  },
  {
    id: "acc-coffee",
    name: "Morning Brew",
    slot: "accessory",
    price: 100,
    emoji: "☕",
    zIndex: 14,
  },
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
