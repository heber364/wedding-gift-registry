"use client";
import React from "react";
import type { Gift } from "@/lib/api-client-react";
import { formatCurrency } from "@/lib/formatters";
import { loadGuestIdentity } from "@/lib/guest-identity";
import { ExternalLink } from "lucide-react";

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
    <div
      className={`
        group relative flex flex-col bg-card border border-border/40 overflow-hidden
        transition-all duration-500 ease-out
        ${isReserved && !isOwnReservation
          ? "opacity-55 grayscale-[0.4]"
          : "hover:border-primary/50 hover:shadow-[0_0_30px_rgba(138,28,48,0.15)] hover:-translate-y-1"
        }
      `}
    >
      {/* Clickable image + info area */}
      <div
        onClick={onClick}
        className="flex flex-col flex-grow cursor-pointer"
      >
        <div className="aspect-[4/3] w-full bg-muted/20 relative overflow-hidden">
          {gift.imageUrl ? (
            <img
              src={gift.imageUrl}
              alt={gift.name}
              className={`w-full h-full object-cover transition-transform duration-700 ${!isReserved && "group-hover:scale-105"}`}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground font-serif italic bg-muted/10">
              Sem Imagem
            </div>
          )}

          {isReserved && !isOwnReservation && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center backdrop-blur-[2px]">
              <div className="bg-background/90 border border-border px-6 py-2 shadow-2xl">
                <span className="font-serif text-lg tracking-widest text-muted-foreground uppercase">
                  Reservado
                </span>
              </div>
            </div>
          )}

          {isOwnReservation && (
            <div className="absolute inset-0 bg-primary/10 flex items-center justify-center backdrop-blur-[1px]">
              <div className="bg-primary/80 border border-primary px-5 py-2 shadow-2xl">
                <span className="font-serif text-sm tracking-widest text-primary-foreground uppercase">
                  Seu Presente
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="p-5 flex flex-col flex-grow">
          {gift.category && (
            <span className="text-xs tracking-[0.2em] text-primary uppercase mb-2 font-medium">
              {gift.category}
            </span>
          )}

          <h3 className="font-serif text-xl font-medium text-foreground mb-2 line-clamp-2">
            {gift.name}
          </h3>

          {gift.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3 flex-grow">
              {gift.description}
            </p>
          )}

          <div className="mt-auto pt-3 flex items-center justify-between border-t border-border/30">
            <span className="text-lg font-serif tracking-wide text-foreground">
              {formatCurrency(gift.price)}
            </span>
            {!isReserved && (
              <span className="text-xs font-medium uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Presentear
              </span>
            )}
            {isOwnReservation && (
              <span className="text-xs font-medium uppercase tracking-widest text-primary opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                Ver / Cancelar
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Product link — sits outside the main click area */}
      {gift.productLink && (
        <div className="px-5 pb-4">
          <a
            href={gift.productLink}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={`
              flex items-center justify-center gap-2 w-full py-2 text-xs uppercase tracking-widest font-medium
              border border-border/40 text-muted-foreground
              transition-all duration-300
              hover:border-primary/50 hover:text-primary hover:bg-primary/5
              ${isReserved && !isOwnReservation ? "pointer-events-none opacity-40" : ""}
            `}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Ver Produto
          </a>
        </div>
      )}

      {/* Decorative corner accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary/30 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary/30 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary/30 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary/30 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
