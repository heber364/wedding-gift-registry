import { NextResponse } from "next/server";
import { db } from "@/db";
import { giftsTable } from "@/db/schema";
import { CreateGiftBody } from "@/lib/api-zod";
import { eq } from "drizzle-orm";

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
    createdAt: g.createdAt.toISOString(),
  };
}

export async function GET() {
  try {
    const gifts = await db.select().from(giftsTable).orderBy(giftsTable.createdAt);
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
        pixChargeType: parsed.data.pixChargeType ?? "LINK",
        pixLink: parsed.data.pixLink ?? null,
        pixKey: parsed.data.pixKey ?? null,
        creditLink: parsed.data.creditLink ?? null,
        productLink: parsed.data.productLink ?? null,
        category: parsed.data.category ?? null,
      })
      .returning();
      
    return NextResponse.json(serializeGift(gift), { status: 201 });
  } catch (err) {
    console.error("Failed to create gift", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
