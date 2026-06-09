import { useMutation, useQuery, UseQueryOptions, UseMutationOptions } from "@tanstack/react-query";
import { giftsApi, Gift, GiftsSummary } from "@/services/api/gifts";
import type * as z from "zod";
import type { CreateGiftBody, UpdateGiftBody, ReserveGiftBody, UnreserveGiftByGuestBody } from "@/schemas/gift";

// Keys
export const getListGiftsQueryKey = () => ["gifts"] as const;
export const getGetGiftsSummaryQueryKey = () => ["gifts-summary"] as const;
export const getGetGiftQueryKey = (id: number) => ["gift", id] as const;

// Queries
export function useListGifts(options?: Omit<UseQueryOptions<Gift[], unknown, Gift[], ReturnType<typeof getListGiftsQueryKey>>, "queryKey" | "queryFn">) {
  return useQuery({
    queryKey: getListGiftsQueryKey(),
    queryFn: () => giftsApi.listGifts(),
    ...options,
  });
}

export function useGetGiftsSummary(options?: Omit<UseQueryOptions<GiftsSummary, unknown, GiftsSummary, ReturnType<typeof getGetGiftsSummaryQueryKey>>, "queryKey" | "queryFn">) {
  return useQuery({
    queryKey: getGetGiftsSummaryQueryKey(),
    queryFn: () => giftsApi.getSummary(),
    ...options,
  });
}

// Mutations
export function useCreateGift(options?: UseMutationOptions<Gift, unknown, { data: z.infer<typeof CreateGiftBody> }>) {
  return useMutation({
    mutationFn: ({ data }) => giftsApi.createGift(data),
    ...options,
  });
}

export function useUpdateGift(options?: UseMutationOptions<Gift, unknown, { id: number; data: z.infer<typeof UpdateGiftBody> }>) {
  return useMutation({
    mutationFn: ({ id, data }) => giftsApi.updateGift(id, data),
    ...options,
  });
}

export function useDeleteGift(options?: UseMutationOptions<void, unknown, { id: number }>) {
  return useMutation({
    mutationFn: ({ id }) => giftsApi.deleteGift(id),
    ...options,
  });
}

export function useReserveGift(options?: UseMutationOptions<Gift, unknown, { id: number; data: z.infer<typeof ReserveGiftBody> }>) {
  return useMutation({
    mutationFn: ({ id, data }) => giftsApi.reserveGift(id, data),
    ...options,
  });
}

export function useUnreserveGift(options?: UseMutationOptions<Gift, unknown, { id: number }>) {
  return useMutation({
    mutationFn: ({ id }) => giftsApi.unreserveGiftByAdmin(id),
    ...options,
  });
}

export function useUnreserveGiftByGuest(options?: UseMutationOptions<Gift, unknown, { id: number; data: z.infer<typeof UnreserveGiftByGuestBody> }>) {
  return useMutation({
    mutationFn: ({ id, data }) => giftsApi.unreserveGiftByGuest(id, data),
    ...options,
  });
}

// Re-export type for convenience
export type { Gift, GiftsSummary };
