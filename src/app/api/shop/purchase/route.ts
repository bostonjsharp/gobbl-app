import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getShopItem, isValidItemId } from "@/lib/shop";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;

  let body: { itemId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const itemId = body.itemId;
  if (!itemId || typeof itemId !== "string" || !isValidItemId(itemId)) {
    return NextResponse.json({ error: "Invalid item" }, { status: 400 });
  }

  const catalogItem = getShopItem(itemId)!;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
        include: { inventory: { where: { itemId } } },
      });

      if (!user) {
        return { error: "User not found" as const };
      }

      if (user.inventory.length > 0) {
        return { alreadyOwned: true as const, featherBalance: user.featherBalance };
      }

      if (user.featherBalance < catalogItem.price) {
        return { insufficient: true as const, featherBalance: user.featherBalance };
      }

      await tx.user.update({
        where: { id: userId },
        data: { featherBalance: { decrement: catalogItem.price } },
      });

      await tx.userInventory.create({
        data: { userId, itemId },
      });

      const updated = await tx.user.findUnique({
        where: { id: userId },
        select: { featherBalance: true },
      });

      return {
        success: true as const,
        featherBalance: updated!.featherBalance,
        itemId,
      };
    });

    if ("error" in result && result.error) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }
    if ("alreadyOwned" in result && result.alreadyOwned) {
      return NextResponse.json(
        { error: "Already owned", featherBalance: result.featherBalance },
        { status: 409 }
      );
    }
    if ("insufficient" in result && result.insufficient) {
      return NextResponse.json(
        { error: "Not enough feathers", featherBalance: result.featherBalance },
        { status: 402 }
      );
    }

    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Purchase failed" }, { status: 500 });
  }
}
