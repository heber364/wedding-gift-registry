import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { customFetch } from "@/services/api/client";
import type { GiftsMetrics } from "@/app/api/gifts/metrics/route";

export type { GiftsMetrics };

export const getGiftsMetricsQueryKey = () => ["gifts-metrics"] as const;

export function useGiftsMetrics(
  options?: Omit<
    UseQueryOptions<
      GiftsMetrics,
      unknown,
      GiftsMetrics,
      ReturnType<typeof getGiftsMetricsQueryKey>
    >,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: getGiftsMetricsQueryKey(),
    queryFn: () => customFetch<GiftsMetrics>("/api/gifts/metrics"),
    ...options,
  });
}
