"use client";

import React from "react";
import Image from "next/image";
import type { TimelineEvent } from "@/data/timeline.types";
import { RoseMarker } from "@/components/ui/GothicOrnaments";
import { MapPin } from "lucide-react";

interface TimelineItemProps {
  event: TimelineEvent;
  index: number;
}

export function TimelineItem({ event, index }: TimelineItemProps) {
  const isEven = index % 2 === 0;

  return (
    <div className="relative flex items-center md:justify-between w-full my-8 md:my-12">
      {/* 
        Desktop: Layout alternado
        Mobile: Coluna única com conteúdo à direita
      */}
      
      {/* Lado Esquerdo (Desktop apenas para itens pares) */}
      <div className={`hidden md:block w-5/12 ${isEven ? "text-right pr-8" : "pointer-events-none opacity-0"}`}>
        {isEven && (
          <div className="inline-block text-left w-full border border-border/70 bg-card/85 backdrop-blur-md p-6 md:p-8 rounded-none shadow-2xl shadow-black/70 relative group hover:border-primary/60 transition-all duration-500">
            {/* Ornamento de canto */}
            <div className="absolute top-2 right-2 text-primary/30 group-hover:text-primary/70 transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                <path d="M0 0h16v2H2v14H0V0z" className="scale-x-[-1]" />
              </svg>
            </div>

            <div className="flex items-center gap-3 justify-end text-primary font-serif tracking-[0.2em] text-xs uppercase mb-1">
              <span>{event.date}</span>
              <span className="w-6 h-px bg-primary/40" />
            </div>

            <h3 className="font-serif text-2xl md:text-3xl text-foreground font-normal mb-1 group-hover:text-primary transition-colors">
              {event.title}
            </h3>

            {event.subtitle && (
              <p className="font-serif italic text-sm text-primary/80 mb-3">
                {event.subtitle}
              </p>
            )}

            <p className="text-muted-foreground text-sm leading-relaxed font-sans">
              {event.description}
            </p>

            {event.location && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground/70 mt-4 pt-3 border-t border-border/30">
                <MapPin className="w-3.5 h-3.5 text-primary/70 shrink-0" />
                <span>{event.location}</span>
              </div>
            )}

            {event.image && (
              <div className="relative w-full aspect-[16/9] mt-4 rounded-none overflow-hidden border border-border/50 group-hover:border-primary/50 transition-colors">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Marcador Central (Losango gótico com Rosa e Espinhos) */}
      <div className="absolute left-4 md:left-1/2 -translate-x-1/2 z-20 flex items-center justify-center">
        <div className="relative group cursor-default">
          <div className="w-9 h-9 rotate-45 bg-background border border-primary/60 flex items-center justify-center shadow-lg shadow-black/90 transition-transform duration-300 group-hover:scale-110 group-hover:border-primary">
            <div className="-rotate-45 flex items-center justify-center">
              <RoseMarker className="w-4 h-4 text-primary drop-shadow-[0_0_8px_rgba(138,28,48,0.7)]" />
            </div>
          </div>
          {/* Efeito gótico de diamante com pulso */}
          <span className="absolute -inset-1.5 rotate-45 border border-primary/20 pointer-events-none -z-10 group-hover:scale-125 transition-transform duration-500" />
        </div>
      </div>

      {/* Lado Direito (Desktop para itens ímpares, Mobile para todos) */}
      <div className={`w-full pl-14 md:pl-0 md:w-5/12 ${!isEven ? "md:pl-8 md:text-left" : "md:hidden"}`}>
        <div className="border border-border/70 bg-card/85 backdrop-blur-md p-6 md:p-8 rounded-none shadow-2xl shadow-black/70 relative group hover:border-primary/60 transition-all duration-500">
          {/* Ornamento de canto */}
          <div className="absolute top-2 left-2 text-primary/30 group-hover:text-primary/70 transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
              <path d="M0 0h16v2H2v14H0V0z" />
            </svg>
          </div>

          <div className="flex items-center gap-3 text-primary font-serif tracking-[0.2em] text-xs uppercase mb-1">
            <span className="w-6 h-px bg-primary/40 hidden md:inline-block" />
            <span>{event.date}</span>
          </div>

          <h3 className="font-serif text-2xl md:text-3xl text-foreground font-normal mb-1 group-hover:text-primary transition-colors">
            {event.title}
          </h3>

          {event.subtitle && (
            <p className="font-serif italic text-sm text-primary/80 mb-3">
              {event.subtitle}
            </p>
          )}

          <p className="text-muted-foreground text-sm leading-relaxed font-sans">
            {event.description}
          </p>

          {event.location && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground/70 mt-4 pt-3 border-t border-border/30">
              <MapPin className="w-3.5 h-3.5 text-primary/70 shrink-0" />
              <span>{event.location}</span>
            </div>
          )}

          {event.image && (
            <div className="relative w-full aspect-[16/9] mt-4 rounded-none overflow-hidden border border-border/50 group-hover:border-primary/50 transition-colors">
              <Image
                src={event.image}
                alt={event.title}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
