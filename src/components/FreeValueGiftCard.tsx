"use client";
import React from "react";
import { HeartHandshake } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FreeValueGiftCardProps {
  onClick: () => void;
}

export function FreeValueGiftCard({ onClick }: FreeValueGiftCardProps) {
  return (
    <Card
      onClick={onClick}
      className={`
        group relative flex flex-col rounded-none border border-primary/60 bg-gradient-to-b from-primary/10 via-card/95 to-card/95 overflow-hidden cursor-pointer
        shadow-2xl shadow-black/80 transition-all duration-500 ease-out
        hover:border-primary hover:shadow-glow-primary hover:-translate-y-1
      `}
    >
      {/* Moldura de Cantoneiras Góticas Decorativas */}
      <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t border-l border-primary group-hover:scale-110 transition-transform z-20 pointer-events-none" />
      <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t border-r border-primary group-hover:scale-110 transition-transform z-20 pointer-events-none" />
      <div className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b border-l border-primary group-hover:scale-110 transition-transform z-20 pointer-events-none" />
      <div className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b border-r border-primary group-hover:scale-110 transition-transform z-20 pointer-events-none" />

      <div className="flex flex-col flex-grow">
        <div className="aspect-[4/3] w-full bg-primary/10 relative overflow-hidden flex items-center justify-center border-b border-border/60">
          <HeartHandshake className="w-20 h-20 text-primary drop-shadow-[0_0_15px_rgba(138,28,48,0.5)] group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent pointer-events-none" />
        </div>

        <CardContent className="p-6 flex flex-col flex-grow border-none shadow-none">
          <div className="w-fit border border-primary/40 text-[10px] font-serif tracking-[0.25em] text-primary uppercase mb-3 font-medium bg-primary/15 rounded-none px-2.5 py-0.5">
            Contribuição Especial
          </div>

          <h3 className="font-serif text-xl md:text-2xl font-normal text-foreground group-hover:text-primary transition-colors mb-2 leading-snug">
            Presente de Valor Livre
          </h3>

          <p className="text-xs text-muted-foreground line-clamp-2 mb-4 flex-grow font-sans leading-relaxed">
            Escolha qualquer quantia para nos abençoar nesta nova jornada. Cada gesto é recebido com imensa gratidão!
          </p>

          <div className="mt-auto pt-3 flex items-center justify-between border-t border-border/40">
            <span className="text-xl font-serif tracking-wide text-primary font-normal">
              Valor Livre
            </span>
            <span className="text-xs font-serif italic tracking-widest uppercase text-primary opacity-80 group-hover:opacity-100 transition-opacity duration-300">
              Contribuir ✦
            </span>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
