import { NextResponse } from "next/server";
import { db } from "@/db";
import { giftsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export interface CategoryMetric {
  category: string;
  totalItems: number;
  availableItems: number;
  reservedItems: number;
  purchasedItems: number;
  totalValue: number;
  adoptedValue: number;
}

export interface GiftsMetrics {
  totalRegistered: number;
  totalAvailable: number;
  totalReserved: number;
  totalPurchased: number;
  totalListValue: number;
  reservedValue: number;
  purchasedValue: number;
  adoptionRate: number;
  categories: CategoryMetric[];
  reservationsByDay: { date: string; count: number }[];
}

export async function GET() {
  try {
    const gifts = await db
      .select()
      .from(giftsTable)
      .where(eq(giftsTable.isActive, true))
      .orderBy(giftsTable.createdAt);

    let totalAvailable = 0;
    let totalReserved = 0;
    let totalPurchased = 0;
    let totalListValue = 0;
    let reservedValue = 0;
    let purchasedValue = 0;

    const catMap = new Map<string, CategoryMetric>();
    const datesMap = new Map<string, number>();

    for (const g of gifts) {
      const price = parseFloat(g.price as unknown as string);
      const cat = g.category || "Uncategorized";
      totalListValue += price;

      if (!catMap.has(cat)) {
        catMap.set(cat, {
          category: cat,
          totalItems: 0,
          availableItems: 0,
          reservedItems: 0,
          purchasedItems: 0,
          totalValue: 0,
          adoptedValue: 0,
        });
      }
      const entry = catMap.get(cat)!;
      entry.totalItems += 1;
      entry.totalValue += price;

      if (g.isPurchased) {
        totalPurchased++;
        purchasedValue += price;
        entry.purchasedItems += 1;
        entry.adoptedValue += price;
      } else if (g.isReserved) {
        totalReserved++;
        reservedValue += price;
        entry.reservedItems += 1;
        entry.adoptedValue += price;
      } else {
        totalAvailable++;
        entry.availableItems += 1;
      }

      if ((g.isReserved || g.isPurchased) && g.reservedAt) {
        const dateStr = new Date(g.reservedAt).toLocaleDateString("pt-BR");
        datesMap.set(dateStr, (datesMap.get(dateStr) || 0) + 1);
      }
    }

    const totalRegistered = gifts.length;
    const adoptedCount = totalReserved + totalPurchased;
    const adoptionRate =
      totalRegistered > 0 ? (adoptedCount / totalRegistered) * 100 : 0;

    const categories = Array.from(catMap.values()).sort(
      (a, b) => b.totalValue - a.totalValue
    );

    const reservationsByDay = Array.from(datesMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => {
        // Parse dd/mm/yyyy for sorting
        const [da, ma, ya] = a.date.split("/").map(Number);
        const [db2, mb, yb] = b.date.split("/").map(Number);
        return new Date(ya, ma - 1, da).getTime() - new Date(yb, mb - 1, db2).getTime();
      });

    const metrics: GiftsMetrics = {
      totalRegistered,
      totalAvailable,
      totalReserved,
      totalPurchased,
      totalListValue,
      reservedValue,
      purchasedValue,
      adoptionRate,
      categories,
      reservationsByDay,
    };

    return NextResponse.json(metrics);
  } catch (err) {
    console.error("Failed to get gifts metrics", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
