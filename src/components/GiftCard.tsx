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
        group relative flex flex-col border-border/40 overflow-hidden
        transition-all duration-500 ease-out
        ${isReserved && !isOwnReservation
          ? "opacity-55 grayscale-[0.4]"
          : "hover:border-primary/50 hover:shadow-glow-primary hover:-translate-y-1"
        }
      `}
    >
      {/* Clickable image + info area */}
      <div
        onClick={onClick}
        className="flex flex-col flex-grow cursor-pointer"
      >
        <div className="aspect-[4/3] w-full bg-muted/20 relative overflow-hidden flex items-center justify-center">
          {gift.imageUrl ? (
            <>
              <div
                className="absolute inset-0 bg-cover bg-center opacity-40 blur-xl scale-110"
                style={{ backgroundImage: `url(${gift.imageUrl})` }}
              />
              <img
                src={gift.imageUrl}
                alt={gift.name}
                className={`w-full h-full object-contain relative z-10 transition-transform duration-700 ${!isReserved && "group-hover:scale-105"}`}
                loading="lazy"
              />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground font-serif italic bg-muted/10">
              Sem Imagem
            </div>
          )}

          {isReserved && !isOwnReservation && (
            <div className="absolute inset-0 z-20 bg-background/60 flex items-center justify-center backdrop-blur-[2px]">
              <Badge variant="secondary" className="bg-background/90 border-border px-6 py-2 shadow-2xl font-serif text-lg tracking-widest text-muted-foreground uppercase  hover:bg-background/90">
                Reservado
              </Badge>
            </div>
          )}

          {isOwnReservation && (
            <div className="absolute inset-0 z-20 bg-primary/10 flex items-center justify-center backdrop-blur-[1px]">
              <Badge variant="default" className="bg-primary/80 border-primary px-5 py-2 shadow-2xl font-serif text-sm tracking-widest text-primary-foreground uppercase  hover:bg-primary/80">
                Seu Presente
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-5 flex flex-col flex-grow border-none shadow-none">
          {gift.category && (
            <Badge variant="outline" className="w-fit border-primary/20 text-xs tracking-[0.2em] text-primary uppercase mb-3 font-medium bg-primary/5 rounded-sm">
              {gift.category}
            </Badge>
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
        </CardContent>
      </div>

      {/* Product link — sits outside the main click area */}
      {gift.productLink && (
        <div className="px-5 pb-4">
          <a
            href={gift.productLink}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: `w-full uppercase tracking-widest border-border/40 text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all duration-300 rounded-md
              ${isReserved && !isOwnReservation ? "pointer-events-none opacity-40" : ""}`
            })}
          >
            <ExternalLink className="w-3.5 h-3.5 mr-2" />
            Ver Produto
          </a>
        </div>
      )}

      {/* Decorative corner accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary/30 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary/30 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary/30 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary/30 opacity-0 group-hover:opacity-100 transition-opacity" />
    </Card>
  );
}

