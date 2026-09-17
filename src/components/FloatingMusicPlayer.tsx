"use client";

import React from "react";
import { Play } from "lucide-react";

interface FloatingMusicPlayerProps {
  isPlaying: boolean;
  onToggle: () => void;
}

export function FloatingMusicPlayer({ isPlaying, onToggle }: FloatingMusicPlayerProps) {
  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 pointer-events-auto">
      <button
        onClick={onToggle}
        aria-label={isPlaying ? "Pausar música ambiente" : "Tocar música ambiente"}
        className={`relative group flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-none border border-primary/60 bg-card/90 text-primary backdrop-blur-md shadow-2xl shadow-black/90 hover:scale-105 hover:border-primary transition-all duration-300 cursor-pointer ${
          isPlaying ? "shadow-glow-primary border-primary ring-1 ring-primary/40" : ""
        }`}
      >
        {/* Cantoneiras góticas decorativas */}
        <div className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-primary/60 pointer-events-none" />
        <div className="absolute top-1 right-1 w-1.5 h-1.5 border-t border-r border-primary/60 pointer-events-none" />
        <div className="absolute bottom-1 left-1 w-1.5 h-1.5 border-b border-l border-primary/60 pointer-events-none" />
        <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-primary/60 pointer-events-none" />

        {/* Ícone ou Equalizador em movimento */}
        <div className="relative z-10 flex items-center justify-center">
          {isPlaying ? (
            <div className="flex items-end gap-1 h-5">
              <span className="w-1 bg-primary rounded-none animate-pulse h-3" />
              <span className="w-1 bg-primary rounded-none animate-bounce h-5" />
              <span className="w-1 bg-primary rounded-none animate-pulse h-2" />
            </div>
          ) : (
            <Play className="w-5 h-5 fill-primary ml-0.5" />
          )}
        </div>

        {/* Tooltip elegante vintage */}
        <span className="absolute right-full mr-3 px-3 py-1.5 rounded-none bg-card/95 border border-border/70 text-[10px] sm:text-[11px] font-serif tracking-[0.2em] uppercase text-foreground/90 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-xl shadow-black">
          {isPlaying ? "Pausar Trilha" : "Ouvir Trilha Sonora"}
        </span>
      </button>
    </div>
  );
}
