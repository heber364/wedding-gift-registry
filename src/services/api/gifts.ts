import { customFetch } from "./client";
import type * as z from "zod";
import type { CreateGiftBody, UpdateGiftBody, ReserveGiftBody, UnreserveGiftByGuestBody } from "@/schemas/gift";

import type { Gift as DbGift } from "@/db/schema/gifts";

type Override<T, U> = Omit<T, keyof U> & U;

export type Gift = Override<DbGift, {
  price: number;
  createdAt: string;
  reservedAt: string | null;
}>;

export interface GiftsSummary {
  total: number;
  reserved: number;
  available: number;
}

export const giftsApi = {
  listGifts: () => customFetch<Gift[]>("/api/gifts"),

  createGift: (data: z.infer<typeof CreateGiftBody>) =>
    customFetch<Gift>("/api/gifts", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateGift: (id: number, data: z.infer<typeof UpdateGiftBody>) =>
    customFetch<Gift>(`/api/gifts/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deleteGift: (id: number) =>
    customFetch<void>(`/api/gifts/${id}`, {
      method: "DELETE",
    }),

  reserveGift: (id: number, data: z.infer<typeof ReserveGiftBody>) =>
    customFetch<Gift>(`/api/gifts/${id}/reserve`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  unreserveGiftByAdmin: (id: number) =>
    customFetch<Gift>(`/api/gifts/${id}/reserve`, {
      method: "DELETE",
    }),

  unreserveGiftByGuest: (id: number, data: z.infer<typeof UnreserveGiftByGuestBody>) =>
    customFetch<Gift>(`/api/gifts/${id}/unreserve-by-guest`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getSummary: () => customFetch<GiftsSummary>("/api/gifts/summary"),
};
