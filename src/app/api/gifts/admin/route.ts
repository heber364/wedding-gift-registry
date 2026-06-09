import { NextResponse } from "next/server";
import { db } from "@/db";
import { giftsTable, serializeGift } from "@/db/schema/gifts";
export async function GET() {
  try {
    const gifts = await db.select().from(giftsTable).orderBy(giftsTable.createdAt);
    return NextResponse.json(gifts.map(serializeGift));
  } catch (err) {
    console.error("Failed to list admin gifts", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
