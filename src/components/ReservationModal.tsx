"use client";
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  useReserveGift,
  useUnreserveGiftByGuest,
  getListGiftsQueryKey,
  getGetGiftsSummaryQueryKey,
} from "@/hooks/useGifts";
import { useQueryClient } from "@tanstack/react-query";
import type { Gift } from "@/hooks/useGifts";
import { formatCurrency } from "@/lib/formatters";
import { CreditCard, QrCode, CheckCircle2, Unlock, Copy, ArrowLeft, ShoppingCart, Check } from "lucide-react";
import { saveGuestIdentity, loadGuestIdentity } from "@/lib/guest-identity";
import QRCode from "react-qr-code";
import confetti from "canvas-confetti";
import { QrCodePix } from "qrcode-pix";

const playCelebrationSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const playTone = (freq: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);

      gain.gain.setValueAtTime(0, ctx.currentTime + startTime);
      gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);

      osc.start(ctx.currentTime + startTime);
      osc.stop(ctx.currentTime + startTime + duration);
    };

    // Acorde feliz (arpejo maior)
    playTone(523.25, 0, 0.4);     // C5
    playTone(659.25, 0.1, 0.4);   // E5
    playTone(783.99, 0.2, 0.4);   // G5
    playTone(1046.50, 0.3, 0.8);  // C6
  } catch (e) {
    // Ignora erros caso o navegador bloqueie autoplay de áudio sem interação
  }
};

const triggerConfetti = () => {
  playCelebrationSound();
  const duration = 3000;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#9b2d42', '#ffffff', '#e3a1b3'],
      zIndex: 9999
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#9b2d42', '#ffffff', '#e3a1b3'],
      zIndex: 9999
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };
  frame();
};

const playSadSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const playTone = (freq: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);

      gain.gain.setValueAtTime(0, ctx.currentTime + startTime);
      gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);

      osc.start(ctx.currentTime + startTime);
      osc.stop(ctx.currentTime + startTime + duration);
    };

    // Acorde triste (descendente)
    playTone(329.63, 0, 0.5);    // E4
    playTone(311.13, 0.4, 0.5);  // Eb4
    playTone(293.66, 0.8, 0.5);  // D4
    playTone(277.18, 1.2, 1.0);  // Db4
  } catch (e) {
  }
};

const RainOverlay = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[100000] bg-slate-900/50 flex overflow-hidden animate-in fade-in duration-500">
      {Array.from({ length: 100 }).map((_, i) => (
        <div
          key={i}
          className="absolute bg-blue-300/60 w-[2px] rounded-full"
          style={{
            height: `${Math.random() * 30 + 10}px`,
            left: `${Math.random() * 100}%`,
            top: `-50px`,
            animation: `rain-fall ${Math.random() * 0.4 + 0.4}s linear infinite`,
            animationDelay: `${Math.random() * 1}s`
          }}
        />
      ))}
      <style>{`
        @keyframes rain-fall {
          to { transform: translateY(110vh); }
        }
      `}</style>
    </div>
  );
};

interface ReservationModalProps {
  gift: Gift | null;
  isOpen: boolean;
  onClose: () => void;
  isTestMode?: boolean;
}

export function ReservationModal({ gift, isOpen, onClose, isTestMode = false }: ReservationModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isUnreserving, setIsUnreserving] = useState(false);
  const [showPixQrCode, setShowPixQrCode] = useState(false);
  const [escapeCount, setEscapeCount] = useState(0);
  const [cancelButtonTransform, setCancelButtonTransform] = useState("");
  const [showRain, setShowRain] = useState(false);
  const [pixPayload, setPixPayload] = useState("");
  const [isGeneratingCheckout, setIsGeneratingCheckout] = useState(false);
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
      setShowPixQrCode(false);
      setEscapeCount(0);
      setCancelButtonTransform("");
      setShowRain(false);
      setIsGeneratingCheckout(false);
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

  useEffect(() => {
    if (showPixQrCode && gift) {
      const pixKey = process.env.NEXT_PUBLIC_PIX_KEY || "+5573998426857";
      const pixName = process.env.NEXT_PUBLIC_PIX_NAME || "Heber Lima Silva";
      const pixCity = process.env.NEXT_PUBLIC_PIX_CITY || "Sao Paulo";

      const formattedName = gift.name.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().substring(0, 25);

      const qrCodePix = QrCodePix({
        version: "01",
        key: pixKey,
        name: pixName,
        city: pixCity,
        transactionId: formattedName || `GIFT${gift.id}`,
        message: `Presente ${gift.name}`,
        value: gift.price,
      });
      setPixPayload(qrCodePix.payload());
    }
  }, [showPixQrCode, gift]);

  if (!gift) return null;

  const handleReserve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast.error("Preencha todos os campos", {
        description: "Nome e telefone são obrigatórios.",
      });
      return;
    }

    if (isTestMode) {
      triggerConfetti();
      setIsSuccess(true);
      return;
    }

    reserveGift.mutate(
      { id: gift.id, data: { name: name.trim(), phone: phone.trim() } },
      {
        onSuccess: () => {
          saveGuestIdentity({ name: name.trim(), phone: phone.trim() });
          queryClient.invalidateQueries({ queryKey: getListGiftsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetGiftsSummaryQueryKey() });
          triggerConfetti();
          setIsSuccess(true);
        },
        onError: () => {
          toast.error("Erro na reserva", {
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
          playSadSound();
          setShowRain(true);
          setTimeout(() => {
            setShowRain(false);
            toast.success("Reserva cancelada", { description: "Seu presente foi liberado com sucesso." });
            onClose();
          }, 2500);
        },
        onError: () => {
          setIsUnreserving(false);
          toast.error("Erro", {
            description: "Não foi possível cancelar a reserva.",
          });
        },
      }
    );
  };

  const handleCopyPix = () => {
    if (pixPayload) {
      navigator.clipboard.writeText(pixPayload);
      toast.success("Chave PIX copiada!", { description: "Você já pode colar no app do seu banco." });
    }
  };

  const handleCreditCheckout = async () => {
    try {
      setIsGeneratingCheckout(true);
      const res = await fetch(`/api/gifts/${gift.id}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentUrl: window.location.href,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.open(data.url, '_blank', 'noopener,noreferrer');
        setIsGeneratingCheckout(false);
      } else {
        toast.error("Erro ao gerar pagamento", {
          description: data.error || "Tente novamente mais tarde.",
        });
        setIsGeneratingCheckout(false);
      }
    } catch (err) {
      toast.error("Erro ao gerar pagamento", {
        description: "Não foi possível conectar ao Mercado Pago.",
      });
      setIsGeneratingCheckout(false);
    }
  };

  const handleCancelClick = (e: React.MouseEvent) => {
    if (escapeCount === 0 || escapeCount === 1) {
      e.preventDefault();
      
      const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;
      const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 1000;
      
      // Assumindo que o botão tem cerca de 350px de largura e o modal está centralizado
      const availableSpaceX = (viewportWidth - 350) / 2;
      const availableSpaceTop = viewportHeight / 2;
      
      let moveX = 0;
      let moveY = 0;

      if (escapeCount === 0) {
        // Foge para cima e esquerda, respeitando os limites da tela
        moveX = availableSpaceX > 20 ? -Math.min(500, availableSpaceX - 20) : 0;
        moveY = -Math.min(500, availableSpaceTop - 50);
      } else {
        // Foge para direita (no mobile, move levemente para baixo)
        moveX = availableSpaceX > 20 ? Math.min(500, availableSpaceX - 20) : 0;
        moveY = moveX === 0 ? Math.min(100, viewportHeight * 0.1) : 0;
      }

      setCancelButtonTransform(`translate(${moveX}px, ${moveY}px)`);
      setEscapeCount(escapeCount + 1);
    } else if (escapeCount === 2) {
      e.preventDefault();
      // Retorna para a posição original para permitir o clique
      setCancelButtonTransform(`translate(0px, 0px)`);
      setEscapeCount(3);
    } else {
      // 3ª tentativa (escapeCount === 3), executa a ação
      handleGuestUnreserve();
    }
  };

  const getCancelButtonText = () => {
    if (unreserveByGuest.isPending) return "Cancelando...";
    switch (escapeCount) {
      case 0: return "Cancelar minha reserva";
      case 1: return "Tem certeza? 😢";
      case 2: return "Poxa vida... 😭";
      default: return "Ok, pode cancelar...";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[440px] bg-card border-border/50 shadow-2xl">

        {/* Case 1: Gift is reserved by this guest — offer to unreserve */}
        {isOwnReservation && !isSuccess ? (
          showPixQrCode ? (
            /* Case 1b: Show Pix QR Code inside Own Reservation */
            <div className="py-6 flex flex-col items-center text-center space-y-6">
              <DialogHeader>
                <DialogTitle className="font-serif text-2xl text-foreground">Pagamento via PIX</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Escaneie o QR Code abaixo ou copie a chave para pagar no app do seu banco.
                </DialogDescription>
              </DialogHeader>

              <div className="bg-white p-4 rounded-xl shadow-sm border border-border/50">
                <QRCode value={pixPayload} size={200} />
              </div>

              <div className="w-full space-y-2">
                <Label className="text-muted-foreground">PIX Copia e Cola / Chave PIX</Label>
                <div className="flex items-center gap-2">
                  <Input value={pixPayload} readOnly className="font-mono text-xs text-center" />
                  <Button variant="outline" size="icon" onClick={handleCopyPix} title="Copiar Chave">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Button variant="ghost" onClick={() => setShowPixQrCode(false)} className="w-full text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
              </Button>
            </div>
          ) : (
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
                <div className="w-full aspect-[4/3] overflow-hidden border border-border/50 mt-2 relative flex items-center justify-center rounded-lg">
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-40 blur-xl scale-110"
                    style={{ backgroundImage: `url(${gift.imageUrl})` }}
                  />
                  <img src={gift.imageUrl} alt={gift.name} className="w-full h-full object-contain relative z-10" />
                </div>
              )}

              <div className="space-y-4 mt-4">
                <p className="text-sm text-muted-foreground">
                  Reservado por <span className="text-foreground font-medium">{gift.reservedBy}</span>.
                </p>

                <div className="flex flex-col gap-3 pt-2">
                  {gift.isPurchased ? (
                    <div className="p-4 bg-muted/50 rounded-lg text-center space-y-2 border border-border">
                      <div className="mx-auto w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-2">
                        <Check className="w-5 h-5" />
                      </div>
                      <h4 className="font-medium text-foreground">Presente já comprado</h4>
                      <p className="text-sm text-muted-foreground">
                        Este presente já foi marcado como comprado. Agradecemos muito pelo carinho!
                      </p>
                    </div>
                  ) : (
                    <>
                      <Button
                        onClick={() => setShowPixQrCode(true)}
                        className="w-full h-11 bg-card hover:bg-accent border border-primary text-foreground"
                      >
                        <QrCode className="w-4 h-4 mr-2" />
                        Presentear com PIX
                      </Button>
                      <Button 
                        onClick={handleCreditCheckout} 
                        disabled={isGeneratingCheckout}
                        variant="outline" 
                        className="w-full h-11 border-border text-foreground hover:bg-muted"
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        {isGeneratingCheckout ? "Gerando pagamento..." : "Presentear com Cartão de Crédito"}
                      </Button>
                      {gift.productLink && (
                        <div className="w-full flex flex-col gap-2">
                          <Button asChild variant="outline" className="w-full h-11 border-border text-foreground hover:bg-muted">
                            <a href={gift.productLink} target="_blank" rel="noreferrer">
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Comprar diretamente no site
                            </a>
                          </Button>
                          <p className="text-xs text-muted-foreground bg-muted/30 p-2 rounded text-center">
                            <strong>Endereço para entrega:</strong><br />
                            R. Júlio José de Oliveira, 1250 - Colina Verde<br />
                            CEP: 45987-400
                          </p>
                        </div>
                      )}
                      <Button
                        variant="ghost"
                        onClick={handleCancelClick}
                        disabled={isUnreserving || unreserveByGuest.isPending}
                        style={{ transform: cancelButtonTransform, transition: "transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)", zIndex: escapeCount > 0 ? 50 : 'auto' }}
                        className="w-full h-11 bg-card border border-dashed border-border/50 text-muted-foreground hover:text-destructive hover:border-destructive/40 hover:bg-destructive/5 mt-2 shadow-lg"
                      >
                        <Unlock className="w-4 h-4 mr-2" />
                        {getCancelButtonText()}
                      </Button>
                    </>
                  )}
                  <Button variant="ghost" onClick={onClose} className="text-muted-foreground hover:text-foreground">
                    Fechar
                  </Button>
                </div>
              </div>
            </>
          )
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
              <div className="w-full aspect-[4/3] overflow-hidden border border-border/50 mt-2 relative flex items-center justify-center rounded-lg">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-40 blur-xl scale-110"
                  style={{ backgroundImage: `url(${gift.imageUrl})` }}
                />
                <img src={gift.imageUrl} alt={gift.name} className="w-full h-full object-contain relative z-10" />
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
          showPixQrCode ? (
            /* Case 3b: Success Screen showing QR Code */
            <div className="py-6 flex flex-col items-center text-center space-y-6">
              <DialogHeader>
                <DialogTitle className="font-serif text-2xl text-foreground">Pagamento via PIX</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Escaneie o QR Code abaixo ou copie a chave para pagar no app do seu banco.
                </DialogDescription>
              </DialogHeader>

              <div className="bg-white p-4 rounded-xl shadow-sm border border-border/50">
                <QRCode value={pixPayload} size={200} />
              </div>

              <div className="w-full space-y-2">
                <Label className="text-muted-foreground">PIX Copia e Cola / Chave PIX</Label>
                <div className="flex items-center gap-2">
                  <Input value={pixPayload} readOnly className="font-mono text-xs text-center" />
                  <Button variant="outline" size="icon" onClick={handleCopyPix} title="Copiar Chave">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Button variant="ghost" onClick={() => setShowPixQrCode(false)} className="w-full text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
              </Button>
            </div>
          ) : (
            /* Case 3: Just reserved — success screen with payment links */
            <div className="py-6 flex flex-col items-center text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 animate-bounce">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-2xl font-medium text-foreground">Reserva Confirmada!</h3>
                <p className="text-muted-foreground px-4">
                  Muito obrigado pelo carinho! Realize o pagamento agora através de uma das opções abaixo.
                </p>
              </div>

              <div className="w-full flex flex-col gap-3 pt-4">
                <Button
                  onClick={() => setShowPixQrCode(true)}
                  className="w-full h-12 bg-card hover:bg-accent border border-primary text-foreground hover:text-primary-foreground transition-colors"
                >
                  <QrCode className="w-5 h-5 mr-2" />
                  Presentear com PIX
                </Button>
                <Button 
                  onClick={handleCreditCheckout} 
                  disabled={isGeneratingCheckout}
                  variant="outline" 
                  className="w-full h-12 border-border text-foreground hover:bg-muted"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  {isGeneratingCheckout ? "Gerando pagamento..." : "Presentear com Cartão"}
                </Button>
                {gift.productLink && (
                  <div className="w-full flex flex-col gap-2">
                    <Button asChild variant="outline" className="w-full h-12 border-border text-foreground hover:bg-muted">
                      <a href={gift.productLink} target="_blank" rel="noreferrer">
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Comprar diretamente no site
                      </a>
                    </Button>
                    <p className="text-xs text-muted-foreground bg-muted/30 p-2 rounded text-center">
                      <strong>Endereço para entrega:</strong><br />
                      R. Júlio José de Oliveira, 1250 - Colina Verde<br />
                      CEP: 45987-400
                    </p>
                  </div>
                )}
              </div>

              <Button variant="ghost" onClick={onClose} className="mt-2 text-muted-foreground hover:text-foreground">
                Fechar
              </Button>
            </div>
          )
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
      {showRain && <RainOverlay />}
    </Dialog>
  );
}
