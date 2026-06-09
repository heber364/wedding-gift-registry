import { NextResponse } from "next/server";
import { db } from "@/db";
import { giftsTable } from "@/db/schema";
import { ReserveGiftParams, ReserveGiftBody, UnreserveGiftParams } from "@/schemas/gift";
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
    reservedBy: g.reservedBy ?? null,
    reservedByPhone: g.reservedByPhone ?? null,
    reservedAt: g.reservedAt ? g.reservedAt.toISOString() : null,
    createdAt: g.createdAt.toISOString(),
  };
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsedParams = ReserveGiftParams.safeParse({ id: parseInt(id) });
  if (!parsedParams.success) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  try {
    const body = await req.json();
    const parsed = ReserveGiftBody.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

    const [existing] = await db.select().from(giftsTable).where(eq(giftsTable.id, parsedParams.data.id));
    if (!existing) return NextResponse.json({ error: "Gift not found" }, { status: 404 });
    if (existing.isReserved) return NextResponse.json({ error: "Gift already reserved" }, { status: 400 });

    const [gift] = await db
      .update(giftsTable)
      .set({
        isReserved: true,
        reservedBy: parsed.data.name,
        reservedByPhone: parsed.data.phone,
        reservedAt: new Date(),
      })
      .where(eq(giftsTable.id, parsedParams.data.id))
      .returning();

    return NextResponse.json(serializeGift(gift));
  } catch (err) {
    console.error("Failed to reserve gift", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsed = UnreserveGiftParams.safeParse({ id: parseInt(id) });
  if (!parsed.success) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  try {
    const [gift] = await db
      .update(giftsTable)
      .set({
        isReserved: false,
        reservedBy: null,
        reservedByPhone: null,
        reservedAt: null,
      })
      .where(eq(giftsTable.id, parsed.data.id))
      .returning();

    if (!gift) return NextResponse.json({ error: "Gift not found" }, { status: 404 });
    return NextResponse.json(serializeGift(gift));
  } catch (err) {
    console.error("Failed to unreserve gift", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
