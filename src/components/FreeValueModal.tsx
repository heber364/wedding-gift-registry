"use client";
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CreditCard, QrCode, ArrowLeft, Copy } from "lucide-react";
import QRCode from "react-qr-code";
import { QrCodePix } from "qrcode-pix";
import { z } from "zod";

const valueSchema = z.number().min(1, "O valor mínimo é R$ 1,00");

interface FreeValueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FreeValueModal({ isOpen, onClose }: FreeValueModalProps) {
  const [customValue, setCustomValue] = useState<string>("");
  const [message, setMessage] = useState("");
  const [showPixQrCode, setShowPixQrCode] = useState(false);
  const [pixPayload, setPixPayload] = useState("");
  const [isGeneratingCheckout, setIsGeneratingCheckout] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCustomValue("");
      setMessage("");
      setShowPixQrCode(false);
      setPixPayload("");
      setIsGeneratingCheckout(false);
    }
  }, [isOpen]);

  const getCurrentValue = () => {
    if (!customValue) return 0;
    const parsed = parseFloat(customValue.replace(",", "."));
    return isNaN(parsed) ? 0 : parsed;
  };

  const val = getCurrentValue();
  const validationResult = valueSchema.safeParse(val);
  const inputError = customValue ? (!validationResult.success ? validationResult.error.issues[0].message : null) : null;
  const isValid = customValue !== "" && validationResult.success;

  const handlePix = () => {
    if (!isValid) return;

    const pixKey = process.env.NEXT_PUBLIC_PIX_KEY || "+5573998426857";
    const pixName = process.env.NEXT_PUBLIC_PIX_NAME || "Heber Lima Silva";
    const pixCity = process.env.NEXT_PUBLIC_PIX_CITY || "Sao Paulo";

    const safeMessage = message ? message.substring(0, 20).replace(/[^a-zA-Z0-9 ]/g, "") : "Presente Casamento";

    const qrCodePix = QrCodePix({
      version: "01",
      key: pixKey,
      name: pixName,
      city: pixCity,
      transactionId: safeMessage.replace(/ /g, "").substring(0, 25) || "VALORLIVRE",
      message: message || "Presente de Casamento",
      value: val,
    });
    setPixPayload(qrCodePix.payload());
    setShowPixQrCode(true);
  };

  const handleCopyPix = () => {
    if (pixPayload) {
      navigator.clipboard.writeText(pixPayload);
      toast.success("Chave PIX copiada!", { description: "Você já pode colar no app do seu banco." });
    }
  };

  const handleCreditCheckout = async () => {
    if (!isValid) return;
    try {
      setIsGeneratingCheckout(true);
      const res = await fetch(`/api/checkout/free-value`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          unit_price: val,
          message: message || "Presente de Casamento",
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[440px] bg-card border-border/50 shadow-2xl">
        {showPixQrCode ? (
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
              <DialogTitle className="font-serif text-2xl text-foreground">Presente de Valor Livre</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Escolha o valor que desejar. Agradecemos muito pelo seu carinho e contribuição!
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 mt-2">
              <div className="space-y-3">
                <Label className="text-foreground">Digite o valor desejado</Label>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground font-medium pl-1">R$</span>
                    <Input
                      type="number"
                      step="0.01"
                      min="1"
                      placeholder="1.00"
                      value={customValue}
                      onChange={(e) => setCustomValue(e.target.value)}
                      className={`bg-background/50 border-border focus-visible:ring-primary h-10 ${inputError ? "border-destructive focus-visible:ring-destructive" : ""}`}
                      autoFocus
                    />
                  </div>
                  {inputError && (
                    <p className="text-xs text-destructive font-medium ml-8">{inputError}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-foreground">Mensagem para os noivos (Opcional)</Label>
                <Input
                  id="message"
                  placeholder="Deixe uma mensagem..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={50}
                  className="bg-background/50 border-border focus-visible:ring-primary h-10"
                />
                <p className="text-[10px] text-muted-foreground text-right">{message.length}/50</p>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <Button
                  onClick={handlePix}
                  disabled={!isValid}
                  className="w-full h-11 bg-card hover:bg-accent border border-primary text-foreground"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  Pagar com PIX
                </Button>
                <Button 
                  onClick={handleCreditCheckout} 
                  disabled={!isValid || isGeneratingCheckout}
                  variant="outline" 
                  className="w-full h-11 border-border text-foreground hover:bg-muted"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  {isGeneratingCheckout ? "Gerando pagamento..." : "Pagar com Cartão"}
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
