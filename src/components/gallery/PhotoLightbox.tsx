"use client";

import React, { useEffect, useCallback } from "react";
import Image from "next/image";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryPhoto } from "@/data/gallery.types";

interface PhotoLightboxProps {
  photos: GalleryPhoto[];
  currentIndex: number | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectIndex: (index: number) => void;
}

export function PhotoLightbox({
  photos,
  currentIndex,
  isOpen,
  onClose,
  onSelectIndex,
}: PhotoLightboxProps) {
  const currentPhoto = currentIndex !== null ? photos[currentIndex] : null;

  const handlePrev = useCallback(() => {
    if (currentIndex === null) return;
    const newIdx = (currentIndex - 1 + photos.length) % photos.length;
    onSelectIndex(newIdx);
  }, [currentIndex, photos.length, onSelectIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex === null) return;
    const newIdx = (currentIndex + 1) % photos.length;
    onSelectIndex(newIdx);
  }, [currentIndex, photos.length, onSelectIndex]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handlePrev, handleNext]);

  if (!currentPhoto) return null;

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogPrimitive.Portal>
        {/* Backdrop escurecido gótico */}
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        
        <DialogPrimitive.Content
          aria-describedby="lightbox-description"
          className="fixed inset-0 z-50 flex flex-col items-center justify-between p-4 md:p-8 outline-none pointer-events-none select-none"
        >
          <div className="sr-only">
            <DialogPrimitive.Title>{currentPhoto.title}</DialogPrimitive.Title>
            <DialogPrimitive.Description id="lightbox-description">
              {currentPhoto.caption}
            </DialogPrimitive.Description>
          </div>

          {/* Barra Superior */}
          <div className="w-full max-w-6xl flex items-center justify-between pointer-events-auto z-10 pt-2">
            <div className="flex items-center gap-3">
              <span className="font-serif tracking-[0.2em] text-xs text-primary uppercase">
                {currentIndex! + 1} de {photos.length}
              </span>
            </div>

            <DialogPrimitive.Close
              onClick={onClose}
              className="p-2.5 rounded-none border border-border/60 bg-card/80 text-foreground/80 hover:text-primary hover:border-primary/80 transition-colors backdrop-blur-sm"
            >
              <X className="w-5 h-5" />
              <span className="sr-only">Fechar</span>
            </DialogPrimitive.Close>
          </div>

          {/* Área Central da Imagem com Botões de Navegação */}
          <div className="relative w-full max-w-5xl flex-1 flex items-center justify-center my-4 pointer-events-auto">
            {/* Botão Anterior */}
            <button
              onClick={handlePrev}
              aria-label="Foto anterior"
              className="group absolute left-2 md:-left-14 z-20 p-2 text-foreground/75 hover:text-primary transition-colors duration-300 focus:outline-none select-none"
            >
              <ChevronLeft
                strokeWidth={1.5}
                className="w-8 h-8 md:w-11 md:h-11 transition-all duration-300 ease-out group-hover:-translate-x-1.5 group-hover:scale-110 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
              />
            </button>

            {/* Imagem Ampliada */}
            <div className="relative w-full h-[60vh] md:h-[72vh] rounded-none overflow-hidden border border-border/70 shadow-2xl shadow-black/90">
              <Image
                src={currentPhoto.src}
                alt={currentPhoto.title}
                fill
                sizes="(max-width: 1200px) 90vw, 1200px"
                className="object-contain"
                priority
              />
            </div>

            {/* Botão Próximo */}
            <button
              onClick={handleNext}
              aria-label="Próxima foto"
              className="group absolute right-2 md:-right-14 z-20 p-2 text-foreground/75 hover:text-primary transition-colors duration-300 focus:outline-none select-none"
            >
              <ChevronRight
                strokeWidth={1.5}
                className="w-8 h-8 md:w-11 md:h-11 transition-all duration-300 ease-out group-hover:translate-x-1.5 group-hover:scale-110 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
              />
            </button>
          </div>

          {/* Barra Inferior com Legenda */}
          <div className="w-full max-w-2xl text-center pointer-events-auto pb-4">
            <h4 className="font-serif text-xl md:text-2xl text-foreground font-normal">
              {currentPhoto.title}
            </h4>
            <p className="font-serif italic text-sm md:text-base text-muted-foreground mt-1">
              {currentPhoto.caption}
            </p>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
