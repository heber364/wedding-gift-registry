"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface TimeLeft {
  dias: number;
  horas: number;
  minutos: number;
  segundos: number;
}

export function CountdownTimer({ className }: { className?: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ dias: 0, horas: 0, minutos: 0, segundos: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Data do casamento fixada no fuso BRT (GMT-3)
    const targetDate = new Date("2026-11-22T16:00:00-03:00").getTime();

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          dias: Math.floor(difference / (1000 * 60 * 60 * 24)),
          horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutos: Math.floor((difference / 1000 / 60) % 60),
          segundos: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ dias: 0, horas: 0, minutos: 0, segundos: 0 });
      }
    };

    calculateTimeLeft(); // Initial calculation
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const isClient = isMounted;

  return (
    <div 
      className={cn("flex flex-wrap items-center justify-center gap-4 md:gap-8 text-foreground animate-in fade-in duration-700", className, !isClient && "opacity-0")}
      aria-hidden="true"
      suppressHydrationWarning
    >
      <div className="sr-only">
        Faltam {timeLeft.dias} dias, {timeLeft.horas} horas, {timeLeft.minutos} minutos e {timeLeft.segundos} segundos para o casamento.
      </div>
      
      <div className="flex flex-col items-center">
        <span className="font-serif text-4xl md:text-5xl lg:text-6xl text-primary tabular-nums tracking-tight">
          {String(timeLeft.dias).padStart(2, "0")}
        </span>
        <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-muted-foreground mt-2">Dias</span>
      </div>
      
      <span className="text-2xl md:text-3xl font-serif text-border/50 pb-6 hidden md:block">:</span>
      
      <div className="flex flex-col items-center">
        <span className="font-serif text-4xl md:text-5xl lg:text-6xl text-primary tabular-nums tracking-tight">
          {String(timeLeft.horas).padStart(2, "0")}
        </span>
        <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-muted-foreground mt-2">Horas</span>
      </div>

      <span className="text-2xl md:text-3xl font-serif text-border/50 pb-6 hidden md:block">:</span>

      <div className="flex flex-col items-center">
        <span className="font-serif text-4xl md:text-5xl lg:text-6xl text-primary tabular-nums tracking-tight">
          {String(timeLeft.minutos).padStart(2, "0")}
        </span>
        <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-muted-foreground mt-2">Minutos</span>
      </div>

      <span className="text-2xl md:text-3xl font-serif text-border/50 pb-6 hidden md:block">:</span>

      <div className="flex flex-col items-center">
        <span className="font-serif text-4xl md:text-5xl lg:text-6xl text-primary tabular-nums tracking-tight">
          {String(timeLeft.segundos).padStart(2, "0")}
        </span>
        <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-muted-foreground mt-2">Segundos</span>
      </div>
    </div>
  );
}
