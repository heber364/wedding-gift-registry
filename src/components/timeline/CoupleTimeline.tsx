"use client";

import React from "react";
import Image from "next/image";
import timelineData from "@/data/timeline.json";
import type { TimelineEvent } from "@/data/timeline.types";
import { TimelineItem } from "./TimelineItem";
import { MedievalDivider } from "@/components/ui/GothicOrnaments";

export function CoupleTimeline() {
  const events = timelineData as TimelineEvent[];

  return (
    <section
      id="historia"
      className="relative py-24 md:py-36 px-4 border-b border-border/30 overflow-hidden scroll-mt-16"
    >
      {/* Plano de Fundo Atmosférico com Imagem Real do Casal (1.jpg) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <Image
          src="/pre-wedding/PREWDG (125).jpg"
          alt="Helloisa & Héber Ensaio Medieval"
          fill
          priority={false}
          sizes="100vw"
          className="object-cover object-center opacity-20 filter contrast-125 brightness-75 mix-blend-luminosity scale-105"
        />
        {/* Camadas de escurecimento, vinheta e gradientes para legibilidade máxima */}
        <div className="absolute inset-0 bg-background/85 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(138,28,48,0.08)_0%,hsl(var(--background))_85%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      </div>

      {/* Conteúdo Principal */}
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Cabeçalho da Seção */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-24 space-y-4">
          <p className="text-primary uppercase tracking-[0.3em] text-xs md:text-sm font-medium">
            Nossa Jornada
          </p>
          <h2 className="font-serif text-4xl md:text-6xl font-normal tracking-wide text-foreground">
            A História do Nosso Amor
          </h2>
          <MedievalDivider className="my-6" />
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-sans">
            Cada instante, cada escolha e cada passo nos trouxeram até a realização deste sonho. 
            Uma trajetória construída com amor, respeito e cumplicidade.
          </p>
        </div>

        {/* Linha Central da Linha do Tempo */}
        <div className="relative">
          {/* Eixo botânico realista: Caule com espinhos de roseira selvagem */}
          <div 
            aria-hidden="true"
            className="absolute left-4 md:left-1/2 -translate-x-1/2 top-2 bottom-2 w-8 md:w-12 pointer-events-none overflow-hidden select-none z-0 opacity-80 mix-blend-screen"
          >
            <div 
              className="w-full h-full bg-repeat-y bg-contain bg-center filter contrast-125 brightness-95"
              style={{ backgroundImage: "url('/thorn-stem.jpg')" }}
            />
          </div>

          {/* Eixo de sustentação e brilho bordeaux místico */}
          <div 
            aria-hidden="true"
            className="absolute left-4 md:left-1/2 -translate-x-1/2 top-4 bottom-4 w-[2px] bg-gradient-to-b from-transparent via-primary/50 to-transparent pointer-events-none z-0" 
          />

          {/* Lista de Eventos alimentada pelo JSON */}
          <div className="flex flex-col gap-4 relative z-10">
            {events.map((event, index) => (
              <TimelineItem key={event.id} event={event} index={index} />
            ))}
          </div>
        </div>

        {/* Fechamento da Timeline com Ornamento */}
        <div className="text-center mt-16 md:mt-20">
          <p className="font-serif italic text-lg md:text-xl text-primary/90">
            &ldquo;E assim continuaremos a escrever nossa eternidade...&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}
