"use client";

import React, { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import galleryData from "@/data/gallery.json";
import type { GalleryPhoto } from "@/data/gallery.types";
import { GalleryItem } from "./GalleryItem";
import { PhotoLightbox } from "./PhotoLightbox";
import { MedievalDivider } from "@/components/ui/GothicOrnaments";

export function PhotoGallery() {
  const photos = galleryData as GalleryPhoto[];
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    skipSnaps: false,
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrentIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section
      id="galeria"
      className="relative py-24 md:py-36 border-b border-border/30 overflow-hidden scroll-mt-16"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Cabeçalho da Galeria */}
        <div className="text-center max-w-3xl mx-auto mb-14 md:mb-20 space-y-4">
          <p className="text-primary uppercase tracking-[0.3em] text-xs md:text-sm font-medium">
            Registros e Ensaios
          </p>
          <h2 className="font-serif text-4xl md:text-6xl font-normal tracking-wide text-foreground">
            Galeria de Memórias
          </h2>
          <MedievalDivider className="my-6" />
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-sans max-w-xl mx-auto">
            Fragmentos visuais da nossa história, capturando a solenidade e o amor eterno sob a luz das lamparinas e as fortalezas de pedra.
          </p>
        </div>
      </div>

      {/* Carrossel Horizontal Contínuo */}
      <div className="relative w-full">
        {/* Container do Embla Carousel */}
        <div ref={emblaRef} className="overflow-hidden w-full cursor-grab active:cursor-grabbing px-4 sm:px-8">
          <div className="flex -ml-4 md:-ml-6">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className="min-w-0 flex-[0_0_88%] sm:flex-[0_0_58%] md:flex-[0_0_46%] lg:flex-[0_0_38%] pl-4 md:pl-6"
              >
                <GalleryItem
                  photo={photo}
                  onClick={() => setSelectedIndex(index)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Controles de Navegação Flutuantes nas Laterais */}
        <button
          onClick={scrollPrev}
          aria-label="Foto anterior no carrossel"
          className="group absolute left-1 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-2 text-foreground/75 hover:text-primary transition-colors duration-300 focus:outline-none select-none"
        >
          <ChevronLeft
            strokeWidth={1.5}
            className="w-8 h-8 md:w-11 md:h-11 transition-all duration-300 ease-out group-hover:-translate-x-1.5 group-hover:scale-110 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
          />
        </button>

        <button
          onClick={scrollNext}
          aria-label="Próxima foto no carrossel"
          className="group absolute right-1 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-2 text-foreground/75 hover:text-primary transition-colors duration-300 focus:outline-none select-none"
        >
          <ChevronRight
            strokeWidth={1.5}
            className="w-8 h-8 md:w-11 md:h-11 transition-all duration-300 ease-out group-hover:translate-x-1.5 group-hover:scale-110 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
          />
        </button>
      </div>

      {/* Indicador Numérico e Guia */}
      <div className="flex items-center justify-center gap-4 mt-8 text-xs font-serif tracking-[0.25em] text-muted-foreground uppercase">
        <span>Foto {currentIndex + 1} de {photos.length}</span>
        <span className="text-primary/50">✦</span>
        <span className="hidden sm:inline">Deslize ou use as setas</span>
      </div>

      {/* Modal Lightbox para visualização em tela inteira */}
      <PhotoLightbox
        photos={photos}
        currentIndex={selectedIndex}
        isOpen={selectedIndex !== null}
        onClose={() => setSelectedIndex(null)}
        onSelectIndex={(idx) => setSelectedIndex(idx)}
      />
    </section>
  );
}
