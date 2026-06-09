import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { adminApi } from "@/services/api/admin";
import type * as z from "zod";
import type { VerifyAdminBody } from "@/schemas/gift";

export function useVerifyAdmin(options?: UseMutationOptions<{ success: boolean }, unknown, { data: z.infer<typeof VerifyAdminBody> }>) {
  return useMutation({
    mutationFn: ({ data }) => adminApi.verifyAdmin(data),
    ...options,
  });
}
