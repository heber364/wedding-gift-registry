"use client";

import React, { useState, useEffect } from "react";
import { Music, Pause, Play, Volume2 } from "lucide-react";

interface FloatingMusicPlayerProps {
  isPlaying: boolean;
  onToggle: () => void;
}

export function FloatingMusicPlayer({ isPlaying, onToggle }: FloatingMusicPlayerProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Mostra o botão flutuante quando o usuário rolar para além do Hero inicial (aprox 400px)
      setVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <button
        onClick={onToggle}
        aria-label={isPlaying ? "Pausar música ambiente" : "Tocar música ambiente"}
        className={`relative group flex items-center justify-center w-13 h-13 md:w-14 md:h-14 rounded-full border border-primary/50 bg-card/90 text-primary backdrop-blur-md shadow-2xl shadow-black/90 hover:scale-110 hover:border-primary transition-all duration-300 ${
          isPlaying ? "shadow-glow-primary border-primary ring-2 ring-primary/20" : ""
        }`}
      >
        {/* Animação de pulso quando tocando */}
        {isPlaying && (
          <span className="absolute -inset-1 rounded-full bg-primary/20 animate-ping pointer-events-none" />
        )}

        {/* Ícone */}
        <div className="relative z-10 flex items-center justify-center">
          {isPlaying ? (
            <div className="flex items-center gap-0.5">
              <span className="w-1 h-4 bg-primary rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-1 h-5 bg-primary rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-1 h-3 bg-primary rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
          ) : (
            <Play className="w-5 h-5 fill-primary ml-0.5" />
          )}
        </div>

        {/* Tooltip elegante vintage */}
        <span className="absolute right-full mr-3 px-3 py-1.5 rounded-sm bg-card/95 border border-border/60 text-[11px] font-serif tracking-widest uppercase text-foreground/90 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg">
          {isPlaying ? "Pausar Trilha" : "Ouvir Trilha Sonora"}
        </span>
      </button>
    </div>
  );
}
