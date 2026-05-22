"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Badge } from "@/components/ui/Badge";
import { FlatTurkey } from "@/components/gamification/FlatTurkey";
import type { EquippedCosmetics, ShopSlot } from "@/lib/shop";
import { SHOP_SLOTS } from "@/lib/shop";

interface ShopItemRow {
  id: string;
  name: string;
  slot: ShopSlot;
  price: number;
  emoji: string;
  zIndex: number;
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
  hat: "Hats",
  face: "Faces",
  accessory: "Looks",
};

// Soft chip backgrounds per category — Harvest palette
const SLOT_ACCENT: Record<ShopSlot, string> = {
  background: "bg-forest-100",
  hat:        "bg-ochre-soft",
  face:       "bg-primary-soft",
  accessory:  "bg-plume-100",
};

type Filter = "all" | ShopSlot;

export default function ShopPage() {
  const { status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<ShopPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");

  const load = useCallback(() => {
    return fetch("/api/shop")
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setData);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/"); return; }
    if (status === "authenticated") {
      setLoading(true);
      load().catch(() => setError("Could not load the bazaar.")).finally(() => setLoading(false));
    }
  }, [status, router, load]);

  async function buy(itemId: string) {
    setBusyId(itemId);
    setError(null);
    try {
      const r = await fetch("/api/shop/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId }),
      });
      const body = await r.json().catch(() => ({}));
      if (!r.ok) { setError(typeof body.error === "string" ? body.error : "Purchase failed"); return; }
      await load();
    } finally { setBusyId(null); }
  }

  async function equip(slot: ShopSlot, itemId: string | null) {
    setBusyId(`eq-${slot}`);
    setError(null);
    try {
      const r = await fetch("/api/shop/equip", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slot, itemId }),
      });
      const body = await r.json().catch(() => ({}));
      if (!r.ok) { setError(typeof body.error === "string" ? body.error : "Could not update outfit"); return; }
      await load();
    } finally { setBusyId(null); }
  }

  if (loading || !data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <FlatTurkey stage={1} size="md" animate />
      </div>
    );
  }

  const visible = filter === "all" ? data.items : data.items.filter((i) => i.slot === filter);
  // Equipped items as a list for hero preview chips
  const equippedItems = SHOP_SLOTS
    .map((slot) => {
      const id = data.equipped[slot];
      return id ? data.items.find((i) => i.id === id) : null;
    })
    .filter(Boolean) as ShopItemRow[];

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">
            Bazaar
          </div>
          <h1 className="mt-1 font-display text-[28px] font-bold tracking-[-0.03em]">
            Dress your turkey.
          </h1>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-ochre bg-ochre-soft px-3.5 py-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M21 3c-7 0-11 5-12 9-1 4 0 8 0 9h2c0-3 1-7 3-10s5-5 7-8z" fill="rgb(228 165 71)" />
          </svg>
          <span className="font-mono text-sm font-semibold text-golden-700 num-tabular">
            {data.featherBalance.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Hero preview */}
      <div className="relative overflow-hidden rounded-3xl border border-line bg-surface p-5">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-ochre-soft/60" />
        <div className="pointer-events-none absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-primary-soft/55" />
        <div className="relative flex items-center gap-4">
          <FlatTurkey stage={data.level} size={140} />
          <div className="min-w-0 flex-1">
            <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-muted">
              Your look · Lv. {data.level}
            </div>
            <div className="mt-1 font-display text-[20px] font-bold tracking-[-0.02em]">
              {equippedItems.length > 0 ? "Looking sharp." : "Bare-feathered."}
            </div>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {equippedItems.length === 0 && (
                <span className="font-body text-xs text-ink-soft">Equip an item to see it here.</span>
              )}
              {equippedItems.map((it) => (
                <button
                  key={it.id}
                  type="button"
                  onClick={() => equip(it.slot, null)}
                  className="inline-flex items-center gap-1 rounded-full border border-line bg-bg px-2 py-1 font-body text-[10px] font-semibold transition-colors hover:border-ink-muted"
                  title={`Unequip ${it.name}`}
                >
                  <span aria-hidden>{it.emoji}</span> {it.name} ×
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-plume-100 px-4 py-3 font-body text-sm text-plume-700">
          {error}
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        <Chip selected={filter === "all"} onClick={() => setFilter("all")}>All</Chip>
        {SHOP_SLOTS.map((slot) => (
          <Chip key={slot} selected={filter === slot} onClick={() => setFilter(slot)}>
            {SLOT_LABEL[slot]}
          </Chip>
        ))}
      </div>

      {/* Items grid */}
      <div className="grid grid-cols-2 gap-3">
        {visible.map((item) => (
          <ShopItemCard
            key={item.id}
            item={item}
            equippedHere={data.equipped[item.slot] === item.id}
            onBuy={() => buy(item.id)}
            onEquip={() => equip(item.slot, item.id)}
            onUnequip={() => equip(item.slot, null)}
            busy={busyId === item.id || busyId === `eq-${item.slot}`}
          />
        ))}
      </div>
    </div>
  );
}

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

      <div className="px-1 pb-1 pt-2.5">
        <div className="truncate font-body text-[13px] font-bold">{item.name}</div>
        <div className="mt-1.5 flex items-center justify-between">
          {equippedHere ? (
            <button
              type="button"
              onClick={onUnequip}
              disabled={busy}
              className="inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-[0.06em] text-forest-600"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M5 13l4 4 10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              </svg>
              Equipped
            </button>
          ) : item.owned ? (
            <Button size="sm" variant="dark" onClick={onEquip} disabled={busy}>Equip</Button>
          ) : (
            <span className="inline-flex items-center gap-1 font-mono text-xs font-bold text-ink num-tabular">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M21 3c-7 0-11 5-12 9-1 4 0 8 0 9h2c0-3 1-7 3-10s5-5 7-8z" fill="rgb(228 165 71)" />
              </svg>
              {item.price.toLocaleString()}
            </span>
          )}
          {!item.owned && (
            <Button
              size="sm"
              variant={item.canAfford ? "primary" : "outline"}
              onClick={onBuy}
              disabled={busy || !item.canAfford}
            >
              {item.canAfford ? "Buy" : "Locked"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
