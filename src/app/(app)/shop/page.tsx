"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
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
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-roost-900 dark:text-roost-50">The Bazaar</h1>
          <p className="text-roost-500">
            Spend feathers on flair. XP drives your level; feathers are only for the shop.
          </p>
        </div>
        <div className="rounded-2xl border border-gobbl-200 bg-gobbl-50 px-4 py-3 dark:border-gobbl-800 dark:bg-gobbl-950/40">
          <div className="text-xs font-medium uppercase tracking-wide text-gobbl-700 dark:text-gobbl-400">
            Spendable feathers
          </div>
          <div className="text-2xl font-bold text-gobbl-700 dark:text-gobbl-300">
            {data.featherBalance.toLocaleString()} <span className="text-lg">🪶</span>
          </div>
        </div>
      </div>

      <Card className="mb-10 p-6">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-roost-500">Preview</h2>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-10">
          <TurkeyAvatar level={data.level} size="xl" equipped={data.equipped} />
          <div className="text-center text-sm text-roost-600 dark:text-roost-400 sm:text-left">
            <p className="font-medium text-roost-800 dark:text-roost-200">Your turkey right now</p>
            <p className="mt-1 text-xs">
              Equip one item per category. Unequip with the clear button on an owned slot.
            </p>
          </div>
        </div>
      </Card>

      {error && (
        <div className="mb-6 rounded-xl border border-plume-300 bg-plume-50 px-4 py-3 text-sm text-plume-800 dark:border-plume-700 dark:bg-plume-950/40 dark:text-plume-200">
          {error}
        </div>
      )}

      <div className="space-y-10">
        {itemsBySlot.map(({ slot, label, items }) => (
          <section key={slot}>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-roost-800 dark:text-roost-100">
              <span>{label}</span>
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => {
                const isEquipped = data.equipped[slot] === item.id;
                const disabledBuy = busyId === item.id || (!item.canAfford && !item.owned);
                return (
                  <Card
                    key={item.id}
                    className={`flex flex-col gap-3 p-4 transition-shadow ${
                      item.owned ? "ring-2 ring-gobbl-300/60 dark:ring-gobbl-700/50" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-4xl" aria-hidden>
                        {item.emoji}
                      </div>
                      <div className="text-right text-sm">
                        <div className="font-bold text-roost-800 dark:text-roost-100">{item.name}</div>
                        <div className="text-gobbl-600 dark:text-gobbl-400">{item.price.toLocaleString()} 🪶</div>
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
                            <Button size="sm" variant="secondary" disabled={busyId === `eq-${slot}`} onClick={() => equip(slot, item.id)}>
                              Equip
                            </Button>
                          )}
                          {isEquipped && (
                            <Button size="sm" variant="secondary" disabled={busyId === `eq-${slot}`} onClick={() => equip(slot, null)}>
                              Unequip
                            </Button>
                          )}
                          <span className="self-center text-xs font-medium text-emerald-600 dark:text-emerald-400">Owned</span>
                        </>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
