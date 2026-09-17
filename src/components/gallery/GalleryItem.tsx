"use client";

import React from "react";
import Image from "next/image";
import type { GalleryPhoto } from "@/data/gallery.types";

interface GalleryItemProps {
  photo: GalleryPhoto;
  onClick: () => void;
}

export function GalleryItem({ photo, onClick }: GalleryItemProps) {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className="group relative h-[60vh] sm:h-[68vh] md:h-[74vh] w-full cursor-pointer overflow-hidden rounded-none border border-border/70 bg-card p-2 shadow-2xl shadow-black transition-all duration-500 hover:border-primary/80 hover:shadow-glow-primary focus:outline-none select-none"
    >
      {/* Moldura Interna com Foto em Grande Escala */}
      <div className="relative h-full w-full overflow-hidden bg-background">
        <Image
          src={photo.src}
          alt={photo.title}
          fill
          sizes="(max-width: 640px) 85vw, (max-width: 1024px) 55vw, 40vw"
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Gradiente escuro teatral no rodapé */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent opacity-85 transition-opacity duration-500 group-hover:opacity-95" />

        {/* Informações: Título em vermelho bordô / carmesim e legenda poética */}
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 flex flex-col justify-end">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-8 h-px bg-primary/70" />
            <span className="font-serif tracking-[0.25em] text-xs text-primary/80 uppercase">
              Memória
            </span>
          </div>
          
          <h3 className="font-serif text-2xl md:text-3xl lg:text-4xl text-primary font-normal leading-tight tracking-wide drop-shadow-md">
            {photo.title}
          </h3>

          <p className="font-serif italic text-sm md:text-base text-foreground/85 mt-2 max-w-lg leading-relaxed line-clamp-2">
            {photo.caption}
          </p>
        </div>
      </div>
    </div>
  );
}
