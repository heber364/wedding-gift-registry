"use client";
import React, { useEffect, useState } from "react";
import { 
  useListGifts, 
  useGetGiftsSummary, 
  useDeleteGift, 
  useUnreserveGift,
  useUpdateGift,
  getListGiftsQueryKey,
  getGetGiftsSummaryQueryKey
} from "@/hooks/useGifts";
import { useLogoutAdmin } from "@/hooks/useAdmin";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { customFetch } from "@/services/api/client";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { AdminGiftForm } from "@/components/AdminGiftForm";
import type { Gift } from "@/hooks/useGifts";
import { useTablePreferences, type SortField } from "@/hooks/useTablePreferences";
import { DataTableFilter, type FilterCondition } from "@/components/DataTableFilter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus, Trash2, Edit2, Unlock, LogOut, Copy, Eye, EyeOff, CreditCard, MoreHorizontal, ExternalLink, Image as ImageIcon, ArrowUpDown, ArrowUp, ArrowDown, BarChart2, MessageCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ReservationModal } from "@/components/ReservationModal";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

const getCategoryColor = (category: string) => {
  if (!category) return "bg-secondary/10 text-secondary-foreground border-border/50";
  
  const normalized = category.toLowerCase().trim();
  
  const pastelColors = [
    "bg-orange-500/10 text-orange-500 border-orange-500/20",
    "bg-amber-500/10 text-amber-500 border-amber-500/20",
    "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    "bg-teal-500/10 text-teal-500 border-teal-500/20",
    "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
    "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
    "bg-violet-500/10 text-violet-500 border-violet-500/20",
    "bg-fuchsia-500/10 text-fuchsia-500 border-fuchsia-500/20",
    "bg-pink-500/10 text-pink-500 border-pink-500/20",
    "bg-rose-500/10 text-rose-500 border-rose-500/20",
  ];

  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = normalized.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);
  return pastelColors[hash % pastelColors.length];
};

export default function AdminDashboard() {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const { data: gifts, isLoading } = useQuery({
    queryKey: ["admin-gifts"],
    queryFn: () => customFetch<Gift[]>("/api/gifts/admin"),
  });
  
  const adminSummary = React.useMemo(() => {
    if (!gifts) return null;
    const total = gifts.length;
    const reserved = gifts.filter((g) => g.isReserved).length;
    return { total, reserved, available: total - reserved };
  }, [gifts]);
  
  const deleteGift = useDeleteGift();
  const unreserveGift = useUnreserveGift();
  const updateGift = useUpdateGift();
  const logoutAdmin = useLogoutAdmin();

  const [formOpen, setFormOpen] = useState(false);
  const [editingGift, setEditingGift] = useState<Gift | null>(null);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [testGift, setTestGift] = useState<Gift | null>(null);

  const {
    sortField, setSortField,
    sortDirection, setSortDirection,
    selectedGiftIds, setSelectedGiftIds,
    selectedCategories, setSelectedCategories,
    selectedStatuses, setSelectedStatuses,
    selectedPrices, setSelectedPrices,
    nameCondition, setNameCondition,
    categoryCondition, setCategoryCondition,
    statusCondition, setStatusCondition,
    priceCondition, setPriceCondition,
    clearAllFilters,
    hasActiveFilters
  } = useTablePreferences();

  const giftOptions = React.useMemo(() => {
    if (!gifts) return [];
    return [...gifts]
      .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
      .map(g => ({ label: g.name, value: g.id.toString() }));
  }, [gifts]);

  const categories = React.useMemo(() => {
    if (!gifts) return [];
    const cats = new Set(gifts.map(g => g.category).filter(Boolean) as string[]);
    return Array.from(cats).sort();
  }, [gifts]);

  const priceOptions = React.useMemo(() => {
    if (!gifts) return [];
    const prices = new Set(gifts.map(g => g.price));
    return Array.from(prices)
      .sort((a, b) => a - b)
      .map(price => ({ label: formatCurrency(price), value: price.toString() }));
  }, [gifts]);

  const filteredAndSortedGifts = React.useMemo(() => {
    if (!gifts) return [];
    let result = [...gifts];

    const applyCondition = (value: string | undefined, condition: FilterCondition, isNumeric = false) => {
      if (condition.type === 'none' || !condition.value) return true;
      if (value === undefined || value === null) return false;
      
      if (isNumeric) {
        const numValue = parseFloat(value);
        const condValue = parseFloat(condition.value);
        if (isNaN(numValue) || isNaN(condValue)) return true;

        switch (condition.type) {
          case 'equals': return numValue === condValue;
          case 'greater_than': return numValue > condValue;
          case 'less_than': return numValue < condValue;
          case 'between': {
            const condValue2 = parseFloat(condition.value2 || '');
            if (isNaN(condValue2)) return numValue >= condValue;
            return numValue >= condValue && numValue <= condValue2;
          }
          default: return true;
        }
      }

      const valLower = value.toLowerCase();
      const condLower = condition.value.toLowerCase();
      switch (condition.type) {
        case 'contains': return valLower.includes(condLower);
        case 'not_contains': return !valLower.includes(condLower);
        case 'starts_with': return valLower.startsWith(condLower);
        case 'ends_with': return valLower.endsWith(condLower);
        case 'equals': return valLower === condLower;
        default: return true;
      }
    };

    result = result.filter(g => {
      let status = "available";
      if (g.isActive === false) status = "hidden";
      else if (g.isPurchased) status = "purchased";
      else if (g.isReserved) status = "reserved";
      
      const passesCheckboxes = selectedStatuses.length === 0 || selectedStatuses.includes(status);
      const passesCondition = applyCondition(status, statusCondition);
      return passesCheckboxes && passesCondition;
    });

    result = result.filter(g => {
      const cat = g.category || "";
      const passesCheckboxes = selectedCategories.length === 0 || selectedCategories.includes(cat);
      const passesCondition = applyCondition(cat, categoryCondition);
      return passesCheckboxes && passesCondition;
    });

    result = result.filter(g => {
      const passesCheckboxes = selectedGiftIds.length === 0 || selectedGiftIds.includes(g.id.toString());
      const passesCondition = applyCondition(g.name, nameCondition);
      return passesCheckboxes && passesCondition;
    });

    result = result.filter(g => {
      const passesCheckboxes = selectedPrices.length === 0 || selectedPrices.includes(g.price.toString());
      const passesCondition = applyCondition(g.price.toString(), priceCondition, true);
      return passesCheckboxes && passesCondition;
    });

    if (sortField) {
      result.sort((a, b) => {
        let aVal: any = a[sortField];
        let bVal: any = b[sortField];
        
        if (sortField === 'name' || sortField === 'category') {
          aVal = (aVal || '').toLowerCase();
          bVal = (bVal || '').toLowerCase();
        }

        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [
    gifts, 
    selectedStatuses, selectedCategories, selectedGiftIds, selectedPrices,
    statusCondition, categoryCondition, nameCondition, priceCondition,
    sortField, sortDirection
  ]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else {
        setSortField(null);
        setSortDirection('asc');
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="ml-2 h-4 w-4" />;
    return sortDirection === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />;
  };

  const toggleVisibility = (gift: Gift) => {
    updateGift.mutate(
      { id: gift.id, data: { isActive: !gift.isActive } },
      {
        onSuccess: () => {
          toast.success("Sucesso", {
            description: `Presente ${!gift.isActive ? "exibido" : "ocultado"} com sucesso.`,
          });
          queryClient.invalidateQueries({ queryKey: getListGiftsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetGiftsSummaryQueryKey() });
          queryClient.invalidateQueries({ queryKey: ["admin-gifts"] });
        },
        onError: () => {
          toast.error("Erro", {
            description: "Ocorreu um erro ao alterar a visibilidade do presente.",
          });
        },
      }
    );
  };

  const handleLogout = () => {
    logoutAdmin.mutate(undefined, {
      onSettled: () => {
        router.push("/admin/login");
      }
    });
  };

  const handleEdit = (gift: Gift) => {
    setEditingGift(gift);
    setIsDuplicate(false);
    setFormOpen(true);
  };

  const handleDuplicate = (gift: Gift) => {
    setEditingGift(gift);
    setIsDuplicate(true);
    setFormOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja remover este presente?")) {
      deleteGift.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListGiftsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetGiftsSummaryQueryKey() });
          queryClient.invalidateQueries({ queryKey: ["admin-gifts"] });
          toast.success("Presente removido com sucesso.");
        }
      });
    }
  };

  const handleUnreserve = (id: number) => {
    if (confirm("Tem certeza que deseja cancelar esta reserva? O presente ficará disponível novamente.")) {
      unreserveGift.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListGiftsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetGiftsSummaryQueryKey() });
          queryClient.invalidateQueries({ queryKey: ["admin-gifts"] });
          toast.success("Reserva cancelada com sucesso.");
        }
      });
    }
  };

  const handleWhatsAppExport = async (includeLinks: boolean = false) => {
    if (!filteredAndSortedGifts.length) {
      toast.error("Nenhum presente disponível na lista para exportar.");
      return;
    }

    const giftsByCategory = filteredAndSortedGifts.reduce((acc, gift) => {
      const cat = gift.category || "Outros";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(gift);
      return acc;
    }, {} as Record<string, Gift[]>);

    let text = "🎁 *Nossa Lista de Presentes* 🎁\n\n";

    for (const [cat, items] of Object.entries(giftsByCategory)) {
      text += `*${cat}*\n`;
      items.forEach(gift => {
        const isUnavailable = gift.isReserved || gift.isPurchased || gift.isActive === false;
        
        const nameFormat = isUnavailable ? `~*${gift.name}*~` : `*${gift.name}*`;
        const priceText = formatCurrency(gift.price);
        
        text += `• ${nameFormat} - ${priceText}\n`;
        
        if (includeLinks) {
          const link = gift.productLink || `${window.location.origin}/?buscar=${encodeURIComponent(gift.name)}`;
          text += `  ${link}\n`;
        }
      });
      text += "\n";
    }

    try {
      await navigator.clipboard.writeText(text.trim());
      toast.success("Lista copiada para o WhatsApp!");
    } catch (err) {
      console.error("Failed to copy", err);
      toast.error("Erro ao copiar a lista.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-3xl font-serif font-normal">Painel de Administração</h1>
            <p className="text-muted-foreground mt-1">Gerencie a lista de presentes e reservas.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/metrics">
              <Button 
                variant="outline" 
                className="border-border text-foreground hover:bg-muted font-serif"
              >
                <BarChart2 className="w-4 h-4 mr-2" />
                Métricas
              </Button>
            </Link>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="border-border text-foreground hover:bg-muted"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
            <Button 
              onClick={() => { setEditingGift(null); setIsDuplicate(false); setFormOpen(true); }}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-serif"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Presente
            </Button>
          </div>
        </div>

        {/* Stats */}
        {adminSummary && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 bg-card border border-border/50 flex flex-col justify-center rounded-lg">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Total</p>
              <p className="text-3xl font-serif">{adminSummary.total}</p>
            </div>
            <div className="p-6 bg-card border border-border/50 border-t-2 border-t-primary/50 flex flex-col justify-center rounded-lg">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Reservados</p>
              <p className="text-3xl font-serif text-primary">{adminSummary.reserved}</p>
            </div>
            <div className="p-6 bg-card border border-border/50 flex flex-col justify-center rounded-lg">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Disponíveis</p>
              <p className="text-3xl font-serif">{adminSummary.available}</p>
            </div>
          </div>
        )}

        {/* Actions above table */}
        <div className="flex justify-end items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="border-green-500/30 text-green-600 hover:bg-green-500/10 hover:text-green-700 dark:text-green-500 font-serif"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Copiar Lista (WhatsApp)
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleWhatsAppExport(false)} className="cursor-pointer">
                Sem links (Compacto)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleWhatsAppExport(true)} className="cursor-pointer">
                Com links (Detalhado)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              onClick={clearAllFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              Limpar todos os filtros
            </Button>
          )}
        </div>

        {/* Table */}
        <div className="bg-card border border-border/50 overflow-hidden rounded-lg">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/20">
                <TableRow className="border-border/50">
                  <TableHead className="w-16"></TableHead>
                  <TableHead className="font-serif p-0">
                    <DataTableFilter
                      title="Presente"
                      options={giftOptions}
                      selectedValues={selectedGiftIds}
                      onSelectedChange={setSelectedGiftIds}
                      condition={nameCondition}
                      onConditionChange={setNameCondition}
                      sortDirection={sortField === 'name' ? sortDirection : null}
                      onSortChange={(dir) => {
                        if (dir) {
                          setSortField('name');
                          setSortDirection(dir);
                        } else {
                          setSortField(null);
                          setSortDirection('asc');
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead className="font-serif p-0">
                    <DataTableFilter
                      title="Categoria"
                      options={categories.map(cat => ({ label: cat, value: cat }))}
                      selectedValues={selectedCategories}
                      onSelectedChange={setSelectedCategories}
                      condition={categoryCondition}
                      onConditionChange={setCategoryCondition}
                      sortDirection={sortField === 'category' ? sortDirection : null}
                      onSortChange={(dir) => {
                        if (dir) {
                          setSortField('category');
                          setSortDirection(dir);
                        } else {
                          setSortField(null);
                          setSortDirection('asc');
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead className="font-serif p-0 text-right">
                    <DataTableFilter
                      title="Valor"
                      options={priceOptions}
                      selectedValues={selectedPrices}
                      onSelectedChange={setSelectedPrices}
                      condition={priceCondition}
                      onConditionChange={setPriceCondition}
                      filterType="number"
                      sortDirection={sortField === 'price' ? sortDirection : null}
                      onSortChange={(dir) => {
                        if (dir) {
                          setSortField('price');
                          setSortDirection(dir);
                        } else {
                          setSortField(null);
                          setSortDirection('asc');
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead className="font-serif p-0">
                    <DataTableFilter
                      title="Status"
                      options={[
                        { label: "Disponível", value: "available" },
                        { label: "Reservado", value: "reserved" },
                        { label: "Comprado", value: "purchased" },
                        { label: "Oculto", value: "hidden" },
                      ]}
                      selectedValues={selectedStatuses}
                      onSelectedChange={setSelectedStatuses}
                      condition={statusCondition}
                      onConditionChange={setStatusCondition}
                    />
                  </TableHead>
                  <TableHead className="font-serif">Reserva</TableHead>
                  <TableHead className="font-serif text-center">Link</TableHead>
                  <TableHead className="text-right font-serif">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      Carregando presentes...
                    </TableCell>
                  </TableRow>
                ) : filteredAndSortedGifts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      Nenhum presente encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAndSortedGifts.map((gift) => (
                    <TableRow key={gift.id} className="border-border/50 hover:bg-muted/10">
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Avatar className="h-10 w-10 border border-border/50 cursor-pointer hover:opacity-80 transition-opacity">
                              <AvatarImage src={gift.imageUrl || ""} alt={gift.name} className="object-cover" />
                              <AvatarFallback className="bg-muted"><ImageIcon className="w-4 h-4 text-muted-foreground" /></AvatarFallback>
                            </Avatar>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md flex flex-col items-center justify-center p-6">
                            <DialogHeader className="sr-only">
                              <DialogTitle>{gift.name}</DialogTitle>
                              <DialogDescription>Imagem do presente</DialogDescription>
                            </DialogHeader>
                            {gift.imageUrl ? (
                              <img src={gift.imageUrl} alt={gift.name} className="w-full max-h-[80vh] object-contain rounded-md" />
                            ) : (
                              <div className="w-full h-64 flex items-center justify-center bg-muted rounded-md">
                                <ImageIcon className="w-12 h-12 text-muted-foreground" />
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                      <TableCell className="font-medium">
                        <span>{gift.name}</span>
                      </TableCell>
                      <TableCell>
                        {gift.category && (
                          <Badge variant="outline" className={cn("font-normal text-xs", getCategoryColor(gift.category))}>
                            {gift.category}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(gift.price)}</TableCell>
                      <TableCell>
                        {gift.isPurchased ? (
                          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                            Comprado
                          </Badge>
                        ) : gift.isReserved ? (
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                            Reservado
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                            Disponível
                          </Badge>
                        )}
                        {gift.isActive === false && (
                          <Badge variant="outline" className="ml-2 bg-slate-500/10 text-slate-500 border-slate-500/20">
                            Oculto
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {gift.isReserved ? (
                          <div className="flex flex-col text-sm">
                            <span className="font-medium">{gift.reservedBy}</span>
                            {gift.reservedByPhone && (
                              <span className="text-xs text-muted-foreground">{gift.reservedByPhone}</span>
                            )}
                            {gift.reservedAt && (
                              <span className="text-xs text-muted-foreground">{formatDate(gift.reservedAt)}</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {gift.productLink ? (
                          <a href={gift.productLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center p-2 text-muted-foreground hover:text-primary transition-colors">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Abrir menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-card border-border/50">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleEdit(gift)} className="cursor-pointer">
                              <Edit2 className="w-4 h-4 mr-2" /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicate(gift)} className="cursor-pointer">
                              <Copy className="w-4 h-4 mr-2" /> Duplicar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTestGift(gift)} className="cursor-pointer">
                              <CreditCard className="w-4 h-4 mr-2" /> Testar Pagamento
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleVisibility(gift)} className="cursor-pointer">
                              {gift.isActive !== false ? <><EyeOff className="w-4 h-4 mr-2" /> Ocultar</> : <><Eye className="w-4 h-4 mr-2" /> Exibir</>}
                            </DropdownMenuItem>
                            {gift.isReserved && (
                              gift.isPurchased ? (
                                <TooltipProvider>
                                  <Tooltip delayDuration={300}>
                                    <TooltipTrigger asChild>
                                      <span>
                                        <DropdownMenuItem disabled className="cursor-not-allowed opacity-50">
                                          <Unlock className="w-4 h-4 mr-2" /> Desfazer Reserva
                                        </DropdownMenuItem>
                                      </span>
                                    </TooltipTrigger>
                                    <TooltipContent side="left">
                                      <p>Não é possível desfazer reserva de um presente já comprado</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              ) : (
                                <DropdownMenuItem onClick={() => handleUnreserve(gift.id)} className="cursor-pointer text-orange-500 focus:text-orange-600 focus:bg-orange-500/10">
                                  <Unlock className="w-4 h-4 mr-2" /> Desfazer Reserva
                                </DropdownMenuItem>
                              )
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDelete(gift.id)} className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
                              <Trash2 className="w-4 h-4 mr-2" /> Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <AdminGiftForm 
        isOpen={formOpen} 
        onClose={() => setFormOpen(false)} 
        gift={editingGift}
        isDuplicate={isDuplicate}
        categories={categories}
      />
      {testGift && (
        <ReservationModal
          isOpen={!!testGift}
          onClose={() => setTestGift(null)}
          gift={testGift}
          isTestMode={true}
        />
      )}
    </div>
  );
}
