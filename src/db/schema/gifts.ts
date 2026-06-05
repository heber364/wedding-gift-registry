import { pgTable, serial, text, boolean, timestamp, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const giftsTable = pgTable("gifts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  pixChargeType: text("pix_charge_type", { enum: ["LINK", "PIX_KEY"] }).notNull().default("LINK"),
  pixLink: text("pix_link"),
  pixKey: text("pix_key"),
  creditLink: text("credit_link"),
  productLink: text("product_link"),
  category: text("category"),
  isReserved: boolean("is_reserved").notNull().default(false),
  reservedBy: text("reserved_by"),
  reservedByPhone: text("reserved_by_phone"),
  reservedAt: timestamp("reserved_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertGiftSchema = createInsertSchema(giftsTable).omit({
  id: true,
  isReserved: true,
  reservedBy: true,
  reservedByPhone: true,
  reservedAt: true,
  createdAt: true,
});

export type InsertGift = z.infer<typeof insertGiftSchema>;
export type Gift = typeof giftsTable.$inferSelect;
