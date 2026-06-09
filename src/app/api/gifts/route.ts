import { NextResponse } from "next/server";
import { db } from "@/db";
import { giftsTable } from "@/db/schema";
import { CreateGiftBody } from "@/schemas/gift";
import { eq } from "drizzle-orm";

function serializeGift(g: typeof giftsTable.$inferSelect) {
  return {
    id: g.id,
    name: g.name,
    description: g.description ?? null,
    imageUrl: g.imageUrl ?? null,
    price: parseFloat(g.price as unknown as string),
    productLink: g.productLink ?? null,
    category: g.category ?? null,
    isReserved: g.isReserved,
    isPurchased: g.isPurchased,
    reservedBy: g.reservedBy ?? null,
    reservedByPhone: g.reservedByPhone ?? null,
    reservedAt: g.reservedAt ? g.reservedAt.toISOString() : null,
    isActive: g.isActive,
    createdAt: g.createdAt.toISOString(),
  };
}

export async function GET() {
  try {
    const gifts = await db.select().from(giftsTable).where(eq(giftsTable.isActive, true)).orderBy(giftsTable.createdAt);
    return NextResponse.json(gifts.map(serializeGift));
  } catch (err) {
    console.error("Failed to list gifts", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = CreateGiftBody.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const [gift] = await db
      .insert(giftsTable)
      .values({
        name: parsed.data.name,
        description: parsed.data.description ?? null,
        imageUrl: parsed.data.imageUrl ?? null,
        price: String(parsed.data.price),
        productLink: parsed.data.productLink ?? null,
        category: parsed.data.category ?? null,
        isActive: parsed.data.isActive ?? true,
      })
      .returning();
      
    return NextResponse.json(serializeGift(gift), { status: 201 });
  } catch (err) {
    console.error("Failed to create gift", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
