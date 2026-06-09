import { pgTable, serial, text, boolean, timestamp, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const giftsTable = pgTable("gifts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  productLink: text("product_link"),
  category: text("category"),
  isReserved: boolean("is_reserved").notNull().default(false),
  isPurchased: boolean("is_purchased").notNull().default(false),
  reservedBy: text("reserved_by"),
  reservedByPhone: text("reserved_by_phone"),
  reservedAt: timestamp("reserved_at"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertGiftSchema = createInsertSchema(giftsTable).omit({
  id: true,
  isReserved: true,
  isPurchased: true,
  reservedBy: true,
  reservedByPhone: true,
  reservedAt: true,
  isActive: true,
  createdAt: true,
});

export type InsertGift = z.infer<typeof insertGiftSchema>;
export type Gift = typeof giftsTable.$inferSelect;
