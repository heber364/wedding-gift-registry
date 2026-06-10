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
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
  useCreateGift,
  useUpdateGift,
  getListGiftsQueryKey,
  getGetGiftsSummaryQueryKey,
} from "@/hooks/useGifts";
import type { Gift } from "@/hooks/useGifts";

const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  price: z.coerce.number().min(0, "O preço deve ser maior ou igual a zero"),
  productLink: z.string().optional(),
  category: z.string().optional(),
  isPurchased: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface AdminGiftFormProps {
  isOpen: boolean;
  onClose: () => void;
  gift: Gift | null;
  isDuplicate?: boolean;
  categories?: string[];
}

export function AdminGiftForm({ isOpen, onClose, gift, isDuplicate, categories = [] }: AdminGiftFormProps) {
  const queryClient = useQueryClient();

  const [comboboxOpen, setComboboxOpen] = React.useState(false);
  const [comboboxInput, setComboboxInput] = React.useState("");

  const createGift = useCreateGift();
  const updateGift = useUpdateGift();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
      price: 0,
      productLink: "",
      category: "",
      isPurchased: false,
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
          productLink: gift.productLink || "",
          category: gift.category || "",
          isPurchased: gift.isPurchased || false,
        });
      } else {
        form.reset({
          name: "",
          description: "",
          imageUrl: "",
          price: 0,
          productLink: "",
          category: "",
          isPurchased: false,
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
            queryClient.invalidateQueries({ queryKey: ["admin-gifts"] });
            toast.success("Presente atualizado com sucesso.");
            onClose();
          },
          onError: () => toast.error("Erro", { description: "Erro ao atualizar." }),
        }
      );
    } else {
      createGift.mutate(
        { data: payload },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListGiftsQueryKey() });
            queryClient.invalidateQueries({ queryKey: getGetGiftsSummaryQueryKey() });
            queryClient.invalidateQueries({ queryKey: ["admin-gifts"] });
            toast.success(isDuplicate ? "Presente duplicado com sucesso." : "Presente criado com sucesso.");
            onClose();
          },
          onError: () => {
            toast.error("Erro ao salvar", {
              description: "Verifique os dados e tente novamente.",
            });
          },
        }
      );
    }
  };

  const isPending = createGift.isPending || updateGift.isPending;
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
                  <FormItem className="flex flex-col pt-[6px]">
                    <FormLabel>Categoria (Opcional)</FormLabel>
                    <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={comboboxOpen}
                            className={cn(
                              "w-full justify-between bg-background/50 border-border font-normal px-3",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value || "Ex: Viagem, Cozinha"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                        <Command>
                          <CommandInput 
                            placeholder="Buscar ou adicionar..." 
                            onValueChange={setComboboxInput}
                            value={comboboxInput}
                          />
                          <CommandList>
                            <CommandEmpty>
                              {comboboxInput.trim().length > 0 ? (
                                <div 
                                  className="p-2 cursor-pointer text-sm text-primary hover:bg-muted"
                                  onClick={() => {
                                    form.setValue("category", comboboxInput.trim());
                                    setComboboxOpen(false);
                                    setComboboxInput("");
                                  }}
                                >
                                  Criar "{comboboxInput.trim()}"
                                </div>
                              ) : "Nenhuma encontrada."}
                            </CommandEmpty>
                            <CommandGroup>
                              {categories?.map((cat) => (
                                <CommandItem
                                  key={cat}
                                  value={cat}
                                  onSelect={() => {
                                    form.setValue("category", cat);
                                    setComboboxOpen(false);
                                    setComboboxInput("");
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === cat ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {cat}
                                </CommandItem>
                              ))}
                              {comboboxInput.trim().length > 0 && !categories?.includes(comboboxInput.trim()) && (
                                <CommandItem
                                  value={comboboxInput.trim()}
                                  onSelect={() => {
                                    form.setValue("category", comboboxInput.trim());
                                    setComboboxOpen(false);
                                    setComboboxInput("");
                                  }}
                                >
                                  <Plus className="mr-2 h-4 w-4" />
                                  Criar "{comboboxInput.trim()}"
                                </CommandItem>
                              )}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
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

            {isEditing && (
              <FormField
                control={form.control}
                name="isPurchased"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-4 bg-background/50">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Marcar como Comprado</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Impede que o usuário cancele a reserva acidentalmente.
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

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
