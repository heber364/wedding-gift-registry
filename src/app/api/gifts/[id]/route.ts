import { NextResponse } from "next/server";
import { db } from "@/db";
import { giftsTable } from "@/db/schema";
import { GetGiftParams, UpdateGiftParams, UpdateGiftBody, DeleteGiftParams } from "@/lib/api-zod";
import { eq } from "drizzle-orm";

function serializeGift(g: typeof giftsTable.$inferSelect) {
  return {
    id: g.id,
    name: g.name,
    description: g.description ?? null,
    imageUrl: g.imageUrl ?? null,
    price: parseFloat(g.price as unknown as string),
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

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsed = GetGiftParams.safeParse({ id: parseInt(id) });
  if (!parsed.success) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  try {
    const [gift] = await db.select().from(giftsTable).where(eq(giftsTable.id, parsed.data.id));
    if (!gift) return NextResponse.json({ error: "Gift not found" }, { status: 404 });
    return NextResponse.json(serializeGift(gift));
  } catch (err) {
    console.error("Failed to get gift", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsedParams = UpdateGiftParams.safeParse({ id: parseInt(id) });
  if (!parsedParams.success) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  try {
    const body = await req.json();
    const parsed = UpdateGiftBody.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

    const updates: Partial<typeof giftsTable.$inferInsert> = {};
    if (parsed.data.name !== undefined) updates.name = parsed.data.name;
    if (parsed.data.description !== undefined) updates.description = parsed.data.description;
    if (parsed.data.imageUrl !== undefined) updates.imageUrl = parsed.data.imageUrl;
    if (parsed.data.price !== undefined) updates.price = String(parsed.data.price);
    if (parsed.data.creditLink !== undefined) updates.creditLink = parsed.data.creditLink;
    if (parsed.data.productLink !== undefined) updates.productLink = parsed.data.productLink;
    if (parsed.data.category !== undefined) updates.category = parsed.data.category;
    if (parsed.data.isActive !== undefined) updates.isActive = parsed.data.isActive;

    const [gift] = await db
      .update(giftsTable)
      .set(updates)
      .where(eq(giftsTable.id, parsedParams.data.id))
      .returning();

    if (!gift) return NextResponse.json({ error: "Gift not found" }, { status: 404 });
    return NextResponse.json(serializeGift(gift));
  } catch (err) {
    console.error("Failed to update gift", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsed = DeleteGiftParams.safeParse({ id: parseInt(id) });
  if (!parsed.success) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  try {
    const [gift] = await db
      .delete(giftsTable)
      .where(eq(giftsTable.id, parsed.data.id))
      .returning();

    if (!gift) return NextResponse.json({ error: "Gift not found" }, { status: 404 });
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("Failed to delete gift", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
