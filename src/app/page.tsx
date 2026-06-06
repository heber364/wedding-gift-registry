"use client";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

// @ts-ignore - suppress TS deep import error

import { useListGifts, useGetGiftsSummary } from "@/lib/api-client-react";
import { GiftCard } from "@/components/GiftCard";
import { ReservationModal } from "@/components/ReservationModal";
import { InteractiveEnvelope } from "@/components/InteractiveEnvelope";
import type { Gift } from "@/lib/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type SortOption = "default" | "price-asc" | "price-desc";

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

export default function Home() {
  const [url, setUrl] = useState<string>('https://www.youtube.com/watch?v=rPVA3qA9jYI');

  const { data: gifts, isLoading } = useListGifts();
  const { data: summary } = useGetGiftsSummary();

  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("Todos");
  const [sortOption, setSortOption] = useState<SortOption>("default");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const categories = useMemo(() => {
    if (!gifts) return [];
    const cats = Array.from(new Set(gifts.map((g) => g.category).filter(Boolean) as string[])).sort();
    return ["Todos", ...cats];
  }, [gifts]);

  const filteredGifts = useMemo(() => {
    if (!gifts) return [];
    let result = gifts;

    if (activeCategory !== "Todos") {
      result = result.filter((g) => g.category === activeCategory);
    }

    if (sortOption === "price-asc") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-desc") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [gifts, activeCategory, sortOption]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <InteractiveEnvelope />
      {/* Hero Header */}
      <header className="relative py-24 md:py-32 flex flex-col items-center justify-center text-center px-4 border-b border-border/30 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />

        {/* Top left floral ornament */}
        <div className="absolute -top-2 -left-2 md:top-0 md:left-0 w-40 h-40 md:w-64 md:h-64 z-10 pointer-events-none opacity-90 drop-shadow-sm ">
          <Image
            src="/image-from-rawpixel-id-16379032-png.png"
            alt="Floral ornament left"
            fill
            sizes="(max-width: 768px) 160px, 256px"
            className="object-contain object-left-top scale-x-[-1]"
          />
        </div>

        {/* Top right floral ornament */}
        <div className="absolute -top-2 -right-2 md:top-0 md:right-0 w-40 h-40 md:w-64 md:h-64 z-10 pointer-events-none opacity-90 drop-shadow-sm ">
          <Image
            src="/image-from-rawpixel-id-16379032-png.png"
            alt="Floral ornament right"
            fill
            sizes="(max-width: 768px) 160px, 256px"
            className="object-contain object-left-top"
          />
        </div>


        <div className="relative z-10 max-w-3xl space-y-6 pt-8">
          <p className="text-primary uppercase tracking-[0.3em] text-sm md:text-base">Lista de Presentes</p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-normal leading-tight">
            Helloisa <span className="text-primary italic">&amp;</span> Héber
          </h1>
          <div className="flex items-center justify-center gap-4 text-muted-foreground mt-4">
            <span className="w-12 h-px bg-border" />
            <p className="tracking-widest uppercase text-sm">22 de Novembro de 2026</p>
            <span className="w-12 h-px bg-border" />
          </div>

          <p className="max-w-xl mx-auto text-muted-foreground pt-6 leading-relaxed">
            Nossa maior alegria é celebrar este momento com vocês.
            Caso queiram nos abençoar com um presente, preparamos esta lista com muito carinho.
          </p>

          <div className="pt-8">
            <Button
              variant="outline"
              onClick={() => setIsPlaying(!isPlaying)}
              className="group relative flex items-center justify-center gap-3 mx-auto px-8 h-12 border-primary/40 bg-background/50 text-primary hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-500 rounded-sm font-serif italic tracking-widest text-sm uppercase shadow-glow-secondary hover:shadow-glow-primary backdrop-blur-sm"
            >
              {isPlaying ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                  Pausar Música
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 fill-current opacity-80 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Ouvir Trilha Sonora
                </>
              )}
            </Button>
            <div className="absolute opacity-0 pointer-events-none w-0 h-0 overflow-hidden">
              <ReactPlayer
                src={url}
                playing={isPlaying}
                loop={true}
                volume={0.5}
                width="10px"
                height="10px"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Stats Summary */}
        {summary && (
          <div className="flex justify-center mb-12">
            <Card className="inline-flex gap-8 md:gap-16 border-border/50 px-8 py-4 bg-card/30 backdrop-blur-sm rounded-none shadow-none">
              <div className="text-center">
                <p className="text-2xl font-serif text-foreground">{summary.available}</p>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mt-1">Disponíveis</p>
              </div>
              <div className="w-px bg-border/50" />
              <div className="text-center">
                <p className="text-2xl font-serif text-primary">{summary.reserved}</p>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mt-1">Reservados</p>
              </div>
            </Card>
          </div>
        )}

        {/* Controls (Filter + Sort) */}
        {!isLoading && (
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-12">
            {/* Category Tabs */}
            <div className="flex flex-wrap justify-center lg:justify-start flex-1">
              {categories.length > 1 && (
                <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
                  <TabsList className="bg-transparent flex flex-wrap h-auto gap-2 p-0 justify-center lg:justify-start">
                    {categories.map((cat) => (
                      <TabsTrigger
                        key={cat}
                        value={cat}
                        className="px-5 py-2 text-xs uppercase tracking-[0.2em] font-medium border border-border/40 transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary data-[state=active]:shadow-glow-primary data-[state=inactive]:bg-transparent data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:border-primary/50 data-[state=inactive]:hover:text-foreground rounded-none shadow-none"
                      >
                        {cat}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              )}
            </div>

            {/* Sort Dropdown */}
            {gifts && gifts.length > 0 && (
              <div className="w-full sm:w-auto shrink-0 flex justify-end">
                <Select value={sortOption} onValueChange={(val: any) => setSortOption(val)}>
                  <SelectTrigger className="w-full sm:w-[220px] h-10 border-border/60 bg-card/30 backdrop-blur-sm text-foreground focus:ring-1 focus:ring-primary/50 transition-colors">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border/60">
                    <SelectItem value="default" className="cursor-pointer">Ordem Padrão</SelectItem>
                    <SelectItem value="price-asc" className="cursor-pointer">Menor Preço</SelectItem>
                    <SelectItem value="price-desc" className="cursor-pointer">Maior Preço</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}

        {/* Gift Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col gap-4">
                <Skeleton className="w-full aspect-[4/3] rounded-none" />
                <Skeleton className="h-6 w-1/3 rounded-none" />
                <Skeleton className="h-4 w-full rounded-none" />
                <Skeleton className="h-4 w-2/3 rounded-none" />
              </div>
            ))}
          </div>
        ) : filteredGifts.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredGifts.map((gift) => (
              <GiftCard
                key={gift.id}
                gift={gift}
                onClick={() => setSelectedGift(gift)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 text-muted-foreground border border-dashed border-border/50">
            <p className="font-serif text-2xl">Nenhum presente cadastrado.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-12 text-center border-t border-border/30 text-muted-foreground">
        <p className="font-serif italic text-lg text-primary">Com amor, Helloisa &amp; Héber</p>
      </footer>

      {/* Modals */}
      <ReservationModal
        gift={selectedGift}
        isOpen={!!selectedGift}
        onClose={() => setSelectedGift(null)}
      />
    </div>
  );
}
