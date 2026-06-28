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
        group relative flex flex-col border-primary/40 overflow-hidden cursor-pointer
        transition-all duration-500 ease-out bg-primary/5
        hover:border-primary hover:shadow-glow-primary hover:-translate-y-1
      `}
    >
      <div className="flex flex-col flex-grow">
        <div className="aspect-[4/3] w-full bg-primary/10 relative overflow-hidden flex items-center justify-center">
           <HeartHandshake className="w-20 h-20 text-primary opacity-80 group-hover:scale-110 transition-transform duration-500" />
           <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent pointer-events-none" />
        </div>

        <CardContent className="p-5 flex flex-col flex-grow border-none shadow-none">
          <Badge variant="outline" className="w-fit border-primary/20 text-xs tracking-[0.2em] text-primary uppercase mb-3 font-medium bg-primary/10 rounded-sm">
            Especial
          </Badge>

          <h3 className="font-serif text-xl font-medium text-foreground mb-2">
            Presente de Valor Livre
          </h3>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-3 flex-grow">
            Escolha o valor que desejar para nos presentear. Qualquer contribuição é muito bem-vinda e agradecemos de coração!
          </p>

          <div className="mt-auto pt-3 flex items-center justify-between border-t border-border/30">
            <span className="text-lg font-serif tracking-wide text-primary">
              Valor Livre
            </span>
            <span className="text-xs font-medium uppercase tracking-widest text-primary opacity-70 group-hover:opacity-100 transition-opacity duration-300">
              Contribuir
            </span>
          </div>
        </CardContent>
      </div>
      
      {/* Decorative corner accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary/50 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary/50 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary/50 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary/50 opacity-0 group-hover:opacity-100 transition-opacity" />
    </Card>
  );
}
