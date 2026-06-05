"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import {
  useCreateGift,
  useUpdateGift,
  getListGiftsQueryKey,
  getGetGiftsSummaryQueryKey,
} from "@/lib/api-client-react";
import type { Gift } from "@/lib/api-client-react";

const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  price: z.coerce.number().min(0, "O preço deve ser maior ou igual a zero"),
  pixChargeType: z.enum(["LINK", "PIX_KEY"]).default("LINK"),
  pixLink: z.string().optional(),
  pixKey: z.string().optional(),
  creditLink: z.string().optional(),
  productLink: z.string().optional(),
  category: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.pixChargeType === "LINK" && (!data.pixLink || data.pixLink.trim() === "")) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Link do PIX é obrigatório",
      path: ["pixLink"],
    });
  }
  if (data.pixChargeType === "PIX_KEY" && (!data.pixKey || data.pixKey.trim() === "")) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Chave PIX (Copia e Cola) é obrigatória",
      path: ["pixKey"],
    });
  }
});

type FormValues = z.infer<typeof formSchema>;

interface AdminGiftFormProps {
  isOpen: boolean;
  onClose: () => void;
  gift: Gift | null;
  isDuplicate?: boolean;
}

export function AdminGiftForm({ isOpen, onClose, gift, isDuplicate }: AdminGiftFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createGift = useCreateGift();
  const updateGift = useUpdateGift();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
      price: 0,
      pixChargeType: "LINK",
      pixLink: "",
      pixKey: "",
      creditLink: "",
      productLink: "",
      category: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (gift) {
        form.reset({
          name: gift.name,
          description: gift.description || "",
          imageUrl: gift.imageUrl || "",
          price: gift.price,
          pixChargeType: gift.pixChargeType || "LINK",
          pixLink: gift.pixLink || "",
          pixKey: gift.pixKey || "",
          creditLink: gift.creditLink || "",
          productLink: gift.productLink || "",
          category: gift.category || "",
        });
      } else {
        form.reset({
          name: "",
          description: "",
          imageUrl: "",
          price: 0,
          pixChargeType: "LINK",
          pixLink: "",
          pixKey: "",
          creditLink: "",
          productLink: "",
          category: "",
        });
      }
    }
  }, [isOpen, gift, form]);

  const onSubmit = (values: FormValues) => {
    const isEditing = !!gift && !isDuplicate;

    const payload = {
      ...values,
      description: values.description || undefined,
      imageUrl: values.imageUrl || undefined,
      creditLink: values.creditLink || undefined,
      productLink: values.productLink || undefined,
      category: values.category || undefined,
    };

    if (isEditing) {
      updateGift.mutate(
        { id: gift.id, data: payload },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListGiftsQueryKey() });
            queryClient.invalidateQueries({ queryKey: getGetGiftsSummaryQueryKey() });
            toast({ title: "Presente atualizado com sucesso." });
            onClose();
          },
          onError: () => toast({ variant: "destructive", title: "Erro ao atualizar." }),
        }
      );
    } else {
      createGift.mutate(
        { data: payload },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListGiftsQueryKey() });
            queryClient.invalidateQueries({ queryKey: getGetGiftsSummaryQueryKey() });
            toast({ title: isDuplicate ? "Presente duplicado com sucesso." : "Presente criado com sucesso." });
            onClose();
          },
          onError: () => {
            toast({
              variant: "destructive",
              title: "Erro ao salvar",
              description: "Verifique os dados e tente novamente.",
            });
          },
        }
      );
    }
  };

  const isPending = createGift.isPending || updateGift.isPending;
  const watchPixChargeType = form.watch("pixChargeType");
  const isEditing = !!gift && !isDuplicate;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-card border-border/50">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl font-normal">
            {isEditing ? "Editar Presente" : isDuplicate ? "Duplicar Presente" : "Novo Presente"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifique os detalhes do presente abaixo."
              : isDuplicate
                ? "Crie um novo presente a partir desta cópia."
                : "Preencha os dados para adicionar um novo presente à lista."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Presente</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-background/50 border-border" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor (R$)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} className="bg-background/50 border-border" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria (Opcional)</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-background/50 border-border" placeholder="Ex: Viagem, Cozinha" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="bg-background/50 border-border resize-none" rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL da Imagem (Opcional)</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-background/50 border-border" placeholder="https://..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="productLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link do Produto (Opcional)</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-background/50 border-border" placeholder="Link da Amazon, Shopee, loja, etc." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4 border border-border/50 p-4 bg-muted/5 mt-4">
              <h4 className="font-serif text-lg">Links de Pagamento</h4>

              <FormField
                control={form.control}
                name="pixChargeType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Método de Pagamento PIX</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="LINK" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            Link Externo (Ex: Mercado Pago, Nubank)
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="PIX_KEY" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            Chave PIX ou PIX Copia e Cola (Gera QR Code na hora)
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchPixChargeType === "LINK" ? (
                <FormField
                  control={form.control}
                  name="pixLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Link do PIX (Obrigatório)</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-background/50 border-border" placeholder="Link do Nubank, Mercado Pago, etc." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="pixKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PIX Copia e Cola (Obrigatório)</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-background/50 border-border" placeholder="Cole aqui o código PIX Copia e Cola com o valor exato" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="creditLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link para Cartão de Crédito (Opcional)</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-background/50 border-border" placeholder="Link Mercado Pago, PicPay, etc." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="border-border hover:bg-muted">
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                {isPending ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
