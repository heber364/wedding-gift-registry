import { NextResponse } from "next/server";
import { db } from "@/db";
import { giftsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const gifts = await db.select().from(giftsTable).where(eq(giftsTable.isActive, true));
    const total = gifts.length;
    const reserved = gifts.filter((g) => g.isReserved).length;
    return NextResponse.json({ total, reserved, available: total - reserved });
  } catch (err) {
    console.error("Failed to get summary", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
