import { NextResponse } from "next/server";
import { db } from "@/db";
import { giftsTable } from "@/db/schema";

function serializeGift(g: typeof giftsTable.$inferSelect) {
  return {
    id: g.id,
    name: g.name,
    description: g.description ?? null,
    imageUrl: g.imageUrl ?? null,
    price: parseFloat(g.price as unknown as string),
    pixChargeType: g.pixChargeType as "LINK" | "PIX_KEY",
    pixLink: g.pixLink ?? null,
    pixKey: g.pixKey ?? null,
    creditLink: g.creditLink ?? null,
    productLink: g.productLink ?? null,
    category: g.category ?? null,
    isReserved: g.isReserved,
    reservedBy: g.reservedBy ?? null,
    reservedByPhone: g.reservedByPhone ?? null,
    reservedAt: g.reservedAt ? g.reservedAt.toISOString() : null,
    isActive: g.isActive,
    createdAt: g.createdAt.toISOString(),
  };
}

export async function GET() {
  try {
    const gifts = await db.select().from(giftsTable).orderBy(giftsTable.createdAt);
    return NextResponse.json(gifts.map(serializeGift));
  } catch (err) {
    console.error("Failed to list admin gifts", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
