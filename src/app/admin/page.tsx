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
} from "@/lib/api-client-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { customFetch } from "@/lib/api-client-react/custom-fetch";
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
import { useToast } from "@/hooks/use-toast";
import { AdminGiftForm } from "@/components/AdminGiftForm";
import type { Gift } from "@/lib/api-client-react";
import { Plus, Trash2, Edit2, Unlock, LogOut, Copy, Eye, EyeOff, CreditCard } from "lucide-react";
import { ReservationModal } from "@/components/ReservationModal";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const { toast } = useToast();
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

  const [formOpen, setFormOpen] = useState(false);
  const [editingGift, setEditingGift] = useState<Gift | null>(null);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [testGift, setTestGift] = useState<Gift | null>(null);

  const toggleVisibility = (gift: Gift) => {
    updateGift.mutate(
      { id: gift.id, data: { isActive: !gift.isActive } },
      {
        onSuccess: () => {
          toast({
            title: "Sucesso",
            description: `Presente ${!gift.isActive ? "exibido" : "ocultado"} com sucesso.`,
          });
          queryClient.invalidateQueries({ queryKey: getListGiftsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetGiftsSummaryQueryKey() });
          queryClient.invalidateQueries({ queryKey: ["admin-gifts"] });
        },
        onError: () => {
          toast({
            title: "Erro",
            description: "Ocorreu um erro ao alterar a visibilidade do presente.",
            variant: "destructive",
          });
        },
      }
    );
  };

  useEffect(() => {
    // Check if authenticated
    if (!sessionStorage.getItem("adminAuth")) {
      router.push("/admin/login");
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuth");
    router.push("/admin/login");
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
          toast({ title: "Presente removido com sucesso." });
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
          toast({ title: "Reserva cancelada com sucesso." });
        }
      });
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

        {/* Table */}
        <div className="bg-card border border-border/50 overflow-hidden rounded-lg">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/20">
                <TableRow className="border-border/50">
                  <TableHead className="font-serif">Presente</TableHead>
                  <TableHead className="font-serif text-right">Valor</TableHead>
                  <TableHead className="font-serif">Status</TableHead>
                  <TableHead className="font-serif">Reserva</TableHead>
                  <TableHead className="text-right font-serif">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Carregando presentes...
                    </TableCell>
                  </TableRow>
                ) : gifts?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Nenhum presente cadastrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  gifts?.map((gift) => (
                    <TableRow key={gift.id} className="border-border/50 hover:bg-muted/10">
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{gift.name}</span>
                          {gift.category && (
                            <span className="text-xs text-muted-foreground">{gift.category}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(gift.price)}</TableCell>
                      <TableCell>
                        {gift.isReserved ? (
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
                      <TableCell className="text-right space-x-2">
                        {gift.isReserved ? (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleUnreserve(gift.id)}
                            title="Desfazer Reserva"
                            className="text-orange-500 hover:text-orange-600 hover:bg-orange-500/10"
                          >
                            <Unlock className="w-4 h-4" />
                          </Button>
                        ) : null}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEdit(gift)}
                          title="Editar"
                          className="hover:bg-muted"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDuplicate(gift)}
                          title="Duplicar"
                          className="hover:bg-muted"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => setTestGift(gift)}
                          title="Testar Pagamento"
                          className="hover:bg-muted text-blue-500 hover:text-blue-600"
                        >
                          <CreditCard className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => toggleVisibility(gift)}
                          title={gift.isActive !== false ? "Ocultar da Vitrine" : "Exibir na Vitrine"}
                          className="hover:bg-muted"
                        >
                          {gift.isActive !== false ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(gift.id)}
                          title="Excluir"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
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
