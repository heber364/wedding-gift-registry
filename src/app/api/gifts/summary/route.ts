import { NextResponse } from "next/server";
import { db } from "@/db";
import { giftsTable } from "@/db/schema";

export async function GET() {
  try {
    const gifts = await db.select().from(giftsTable);
    const total = gifts.length;
    const reserved = gifts.filter((g) => g.isReserved).length;
    return NextResponse.json({ total, reserved, available: total - reserved });
  } catch (err) {
    console.error("Failed to get summary", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
