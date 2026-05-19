"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { TurkeyAvatar } from "@/components/gamification/TurkeyAvatar";
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
  face: "Face",
  accessory: "Accessories",
};

export default function ShopPage() {
  const { status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<ShopPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    return fetch("/api/shop")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load shop");
        return r.json();
      })
      .then(setData);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
      return;
    }
    if (status === "authenticated") {
      setLoading(true);
      load()
        .catch(() => setError("Could not load the bazaar."))
        .finally(() => setLoading(false));
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
      if (!r.ok) {
        setError(typeof body.error === "string" ? body.error : "Purchase failed");
        return;
      }
      await load();
    } finally {
      setBusyId(null);
    }
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
      if (!r.ok) {
        setError(typeof body.error === "string" ? body.error : "Could not update outfit");
        return;
      }
      await load();
    } finally {
      setBusyId(null);
    }
  }

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
