import * as z from "zod";

export const CreateGiftBody = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  price: z.number().min(0),
  productLink: z.string().optional().describe("Link direto para comprar o produto no site da loja"),
  category: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const UpdateGiftBody = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  price: z.number().min(0).optional(),
  productLink: z.string().optional().describe("Link direto para comprar o produto no site da loja"),
  category: z.string().optional(),
  isActive: z.boolean().optional(),
  isPurchased: z.boolean().optional(),
});

export const ReserveGiftBody = z.object({
  name: z.string().min(1).describe("Nome completo do convidado"),
  phone: z.string().min(1).describe("Número de telefone do convidado para contato"),
});

export const UnreserveGiftByGuestBody = z.object({
  phone: z.string().min(1).describe("Número de telefone do convidado para verificar a titularidade"),
});

export const VerifyAdminBody = z.object({
  password: z.string().min(1),
});

export const GetGiftParams = z.object({ id: z.coerce.number() });
export const UpdateGiftParams = z.object({ id: z.coerce.number() });
export const DeleteGiftParams = z.object({ id: z.coerce.number() });
export const ReserveGiftParams = z.object({ id: z.coerce.number() });
export const UnreserveGiftParams = z.object({ id: z.coerce.number() });
export const UnreserveGiftByGuestParams = z.object({ id: z.coerce.number() });


