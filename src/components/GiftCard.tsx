"use client";
import React from "react";
import type { Gift } from "@/hooks/useGifts";
import { formatCurrency } from "@/lib/formatters";
import { loadGuestIdentity } from "@/lib/guest-identity";
import { ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

interface GiftCardProps {
  gift: Gift;
  onClick: () => void;
}

export function GiftCard({ gift, onClick }: GiftCardProps) {
  const isReserved = gift.isReserved;
  const guestIdentity = loadGuestIdentity();
  const isOwnReservation =
    isReserved && guestIdentity?.phone && gift.reservedByPhone === guestIdentity.phone;

  return (
    <Card
      className={`
        group relative flex flex-col rounded-none border border-border/70 bg-card/90 overflow-hidden shadow-2xl shadow-black/80
        transition-all duration-500 ease-out
        ${isReserved && !isOwnReservation
          ? "opacity-60 grayscale-[0.3]"
          : "hover:border-primary/80 hover:shadow-glow-primary hover:-translate-y-1"
        }
      `}
    >
      {/* Moldura de Cantoneiras Góticas Decorativas */}
      <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t border-l border-primary/40 group-hover:border-primary transition-colors z-20 pointer-events-none" />
      <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t border-r border-primary/40 group-hover:border-primary transition-colors z-20 pointer-events-none" />
      <div className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b border-l border-primary/40 group-hover:border-primary transition-colors z-20 pointer-events-none" />
      <div className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b border-r border-primary/40 group-hover:border-primary transition-colors z-20 pointer-events-none" />

      {/* Área Clicável: Imagem e Informações */}
      <div
        onClick={onClick}
        className="flex flex-col flex-grow cursor-pointer"
      >
        <div className="aspect-[4/3] w-full bg-background/80 relative overflow-hidden flex items-center justify-center border-b border-border/60">
          {gift.imageUrl ? (
            <>
              <div
                className="absolute inset-0 bg-cover bg-center opacity-25 blur-xl scale-110"
                style={{ backgroundImage: `url(${gift.imageUrl})` }}
              />
              <img
                src={gift.imageUrl}
                alt={gift.name}
                className={`w-full h-full object-contain relative z-10 transition-transform duration-700 p-3 ${!isReserved && "group-hover:scale-105"}`}
                loading="lazy"
              />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground/60 font-serif italic text-sm bg-muted/5">
              Sem Imagem
            </div>
          )}

          {/* Selo Heráldico de Reserva */}
          {isReserved && !isOwnReservation && (
            <div className="absolute inset-0 z-20 bg-background/80 flex items-center justify-center backdrop-blur-[2px]">
              <div className="border border-border/80 bg-background/95 px-6 py-2 shadow-2xl rounded-none flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-muted-foreground/60 rotate-45" />
                <span className="font-serif text-sm tracking-[0.25em] text-muted-foreground uppercase">
                  Reservado
                </span>
                <span className="w-1.5 h-1.5 bg-muted-foreground/60 rotate-45" />
              </div>
            </div>
          )}

          {/* Selo de Presente Próprio */}
          {isOwnReservation && (
            <div className="absolute inset-0 z-20 bg-primary/20 flex items-center justify-center backdrop-blur-[1px]">
              <div className="border border-primary bg-primary/90 px-6 py-2 shadow-glow-primary rounded-none flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary-foreground rotate-45" />
                <span className="font-serif text-xs tracking-[0.25em] text-primary-foreground uppercase font-medium">
                  Seu Presente
                </span>
                <span className="w-1.5 h-1.5 bg-primary-foreground rotate-45" />
              </div>
            </div>
          )}
        </div>

        <CardContent className="p-6 flex flex-col flex-grow border-none shadow-none">
          {gift.category && (
            <div className="w-fit border border-primary/30 text-[10px] font-serif tracking-[0.25em] text-primary uppercase mb-3 font-medium bg-primary/10 rounded-none px-2.5 py-0.5">
              {gift.category}
            </div>
          )}

          <h3 className="font-serif text-xl md:text-2xl font-normal text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2 leading-snug">
            {gift.name}
          </h3>

          {gift.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mb-4 flex-grow font-sans leading-relaxed">
              {gift.description}
            </p>
          )}

          <div className="mt-auto pt-3 flex items-center justify-between border-t border-border/40">
            <span className="text-xl font-serif tracking-wide text-foreground font-normal">
              {formatCurrency(gift.price)}
            </span>
            {!isReserved && (
              <span className="text-xs font-serif italic tracking-widest uppercase text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Presentear ✦
              </span>
            )}
            {isOwnReservation && (
              <span className="text-xs font-serif italic tracking-widest uppercase text-primary opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                Ver / Cancelar
              </span>
            )}
          </div>
        </CardContent>
      </div>

      {/* Link para o Produto Externo */}
      {gift.productLink && (
        <div className="px-6 pb-5">
          <a
            href={gift.productLink}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: `w-full uppercase font-serif tracking-[0.2em] text-xs border-border/60 text-muted-foreground hover:border-primary/70 hover:text-primary hover:bg-primary/5 transition-all duration-300 rounded-none
              ${isReserved && !isOwnReservation ? "pointer-events-none opacity-40" : ""}`
            })}
          >
            <ExternalLink className="w-3.5 h-3.5 mr-2 text-primary/70" />
            Ver Produto
          </a>
        </div>
      )}
    </Card>
  );
}

