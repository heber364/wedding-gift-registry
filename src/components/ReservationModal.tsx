"use client";
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  useReserveGift,
  useUnreserveGiftByGuest,
  getListGiftsQueryKey,
  getGetGiftsSummaryQueryKey,
} from "@/lib/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import type { Gift } from "@/lib/api-client-react";
import { formatCurrency } from "@/lib/formatters";
import { CreditCard, QrCode, CheckCircle2, Unlock } from "lucide-react";
import { saveGuestIdentity, loadGuestIdentity } from "@/lib/guest-identity";

interface ReservationModalProps {
  gift: Gift | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ReservationModal({ gift, isOpen, onClose }: ReservationModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isUnreserving, setIsUnreserving] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const reserveGift = useReserveGift();
  const unreserveByGuest = useUnreserveGiftByGuest();

  const guestIdentity = loadGuestIdentity();
  const isOwnReservation =
    gift?.isReserved &&
    guestIdentity?.phone &&
    gift.reservedByPhone === guestIdentity.phone;

  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setIsUnreserving(false);
      const saved = loadGuestIdentity();
      if (saved) {
        setName(saved.name);
        setPhone(saved.phone);
      } else {
        setName("");
        setPhone("");
      }
    }
  }, [isOpen, gift?.id]);

  if (!gift) return null;

  const handleReserve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast({
        variant: "destructive",
        title: "Preencha todos os campos",
        description: "Nome e telefone são obrigatórios.",
      });
      return;
    }

    reserveGift.mutate(
      { id: gift.id, data: { name: name.trim(), phone: phone.trim() } },
      {
        onSuccess: () => {
          saveGuestIdentity({ name: name.trim(), phone: phone.trim() });
          queryClient.invalidateQueries({ queryKey: getListGiftsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetGiftsSummaryQueryKey() });
          setIsSuccess(true);
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Erro na reserva",
            description: "Não foi possível reservar. O presente pode já ter sido reservado.",
          });
        },
      }
    );
  };

  const handleGuestUnreserve = () => {
    if (!guestIdentity) return;
    setIsUnreserving(true);
    unreserveByGuest.mutate(
      { id: gift.id, data: { phone: guestIdentity.phone } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListGiftsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetGiftsSummaryQueryKey() });
          toast({ title: "Reserva cancelada", description: "Seu presente foi liberado com sucesso." });
          onClose();
        },
        onError: () => {
          setIsUnreserving(false);
          toast({
            variant: "destructive",
            title: "Erro",
            description: "Não foi possível cancelar a reserva.",
          });
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[440px] bg-card border-border/50 shadow-2xl">

        {/* Case 1: Gift is reserved by this guest — offer to unreserve */}
        {isOwnReservation && !isSuccess ? (
          <>
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl text-foreground">Sua Reserva</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Você reservou{" "}
                <strong className="text-foreground font-medium">{gift.name}</strong> —{" "}
                {formatCurrency(gift.price)}.
              </DialogDescription>
            </DialogHeader>

            {gift.imageUrl && (
              <div className="w-full h-36 overflow-hidden border border-border/50 mt-2">
                <img src={gift.imageUrl} alt={gift.name} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="space-y-4 mt-4">
              <p className="text-sm text-muted-foreground">
                Reservado por <span className="text-foreground font-medium">{gift.reservedBy}</span>.
              </p>

              <div className="flex flex-col gap-3 pt-2">
                {gift.pixLink && (
                  <Button asChild className="w-full h-11 bg-card hover:bg-accent border border-primary text-foreground">
                    <a href={gift.pixLink} target="_blank" rel="noreferrer">
                      <QrCode className="w-4 h-4 mr-2" />
                      Pagar via PIX
                    </a>
                  </Button>
                )}
                {gift.creditLink && (
                  <Button asChild variant="outline" className="w-full h-11 border-border text-foreground hover:bg-muted">
                    <a href={gift.creditLink} target="_blank" rel="noreferrer">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Pagar no Crédito
                    </a>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  onClick={handleGuestUnreserve}
                  disabled={isUnreserving || unreserveByGuest.isPending}
                  className="w-full h-11 border border-dashed border-border/50 text-muted-foreground hover:text-destructive hover:border-destructive/40 hover:bg-destructive/5 mt-2"
                >
                  <Unlock className="w-4 h-4 mr-2" />
                  {unreserveByGuest.isPending ? "Cancelando..." : "Cancelar minha reserva"}
                </Button>
                <Button variant="ghost" onClick={onClose} className="text-muted-foreground hover:text-foreground">
                  Fechar
                </Button>
              </div>
            </div>
          </>
        ) : !gift.isReserved && !isSuccess ? (
          /* Case 2: Gift is available — reservation form */
          <>
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl text-foreground">Reservar Presente</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Você está reservando{" "}
                <strong className="text-foreground font-medium">{gift.name}</strong> —{" "}
                <strong className="text-foreground font-medium">{formatCurrency(gift.price)}</strong>.
              </DialogDescription>
            </DialogHeader>

            {gift.imageUrl && (
              <div className="w-full h-36 overflow-hidden border border-border/50 mt-2">
                <img src={gift.imageUrl} alt={gift.name} className="w-full h-full object-cover" />
              </div>
            )}

            <form onSubmit={handleReserve} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="guest-name" className="text-foreground">Nome completo</Label>
                <Input
                  id="guest-name"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-background/50 border-border focus-visible:ring-primary"
                  required
                  autoComplete="name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guest-phone" className="text-foreground">Telefone de contato</Label>
                <Input
                  id="guest-phone"
                  placeholder="(00) 00000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-background/50 border-border focus-visible:ring-primary"
                  required
                  autoComplete="tel"
                  inputMode="tel"
                />
                <p className="text-xs text-muted-foreground">
                  Seus dados ficam salvos neste dispositivo para facilitar futuras visitas.
                </p>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="border-border text-foreground hover:bg-muted"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-serif tracking-wide"
                  disabled={reserveGift.isPending}
                >
                  {reserveGift.isPending ? "Reservando..." : "Confirmar Reserva"}
                </Button>
              </div>
            </form>
          </>
        ) : isSuccess ? (
          /* Case 3: Just reserved — success screen with payment links */
          <div className="py-6 flex flex-col items-center text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-2xl font-medium text-foreground">Reserva Confirmada!</h3>
              <p className="text-muted-foreground px-4">
                Muito obrigado pelo carinho! Realize o pagamento agora através de uma das opções abaixo.
              </p>
            </div>

            <div className="w-full flex flex-col gap-3 pt-4">
              {gift.pixLink && (
                <Button asChild className="w-full h-12 bg-card hover:bg-accent border border-primary text-foreground hover:text-primary-foreground transition-colors">
                  <a href={gift.pixLink} target="_blank" rel="noreferrer">
                    <QrCode className="w-5 h-5 mr-2" />
                    Pagar via PIX
                  </a>
                </Button>
              )}
              {gift.creditLink && (
                <Button asChild variant="outline" className="w-full h-12 border-border text-foreground hover:bg-muted">
                  <a href={gift.creditLink} target="_blank" rel="noreferrer">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Pagar no Crédito
                  </a>
                </Button>
              )}
            </div>

            <Button variant="ghost" onClick={onClose} className="mt-2 text-muted-foreground hover:text-foreground">
              Fechar
            </Button>
          </div>
        ) : (
          /* Case 4: Reserved by someone else */
          <div className="py-6 flex flex-col items-center text-center space-y-4">
            <p className="font-serif text-xl text-muted-foreground">Este presente já foi reservado.</p>
            <Button variant="ghost" onClick={onClose} className="text-muted-foreground hover:text-foreground">
              Fechar
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
