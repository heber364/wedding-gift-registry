import { customFetch } from "./client";
import type * as z from "zod";
import type { VerifyAdminBody } from "@/schemas/gift";

export const adminApi = {
  verifyAdmin: (data: z.infer<typeof VerifyAdminBody>) =>
    customFetch<{ success: boolean }>("/api/admin/verify", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
