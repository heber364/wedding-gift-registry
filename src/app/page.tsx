"use client";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

// @ts-ignore - suppress TS deep import error

import { useListGifts, useGetGiftsSummary } from "@/hooks/useGifts";
import { GiftCard } from "@/components/GiftCard";
import { ReservationModal } from "@/components/ReservationModal";
import { InteractiveEnvelope } from "@/components/InteractiveEnvelope";
import { CountdownTimer } from "@/components/CountdownTimer";
import type { Gift } from "@/hooks/useGifts";
import { sortGifts } from "@/lib/sortGifts";
import { Skeleton } from "@/components/ui/skeleton";
import { FreeValueGiftCard } from "@/components/FreeValueGiftCard";
import { FreeValueModal } from "@/components/FreeValueModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { HeaderNav } from "@/components/HeaderNav";
import { CoupleTimeline } from "@/components/timeline/CoupleTimeline";
import { PhotoGallery } from "@/components/gallery/PhotoGallery";
import { FloatingMusicPlayer } from "@/components/FloatingMusicPlayer";
import { ScrollFocusMask } from "@/components/ui/ScrollFocusMask";
import { MedievalDivider } from "@/components/ui/GothicOrnaments";

type SortOption = "default" | "price-asc" | "price-desc";

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

export default function Home() {
  const [url, setUrl] = useState<string>('https://www.youtube.com/watch?v=rPVA3qA9jYI');

  const { data: gifts, isLoading } = useListGifts();
  const { data: summary } = useGetGiftsSummary();

  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("Todos");
  const [activeFilter, setActiveFilter] = useState<string>("Todos"); // Todos, Disponíveis, Reservados
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOption, setSortOption] = useState<SortOption>("default");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showFreeValueModal, setShowFreeValueModal] = useState<boolean>(false);

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

    if (activeFilter === "Disponíveis") {
      result = result.filter((g) => !g.isReserved && !g.isPurchased);
    } else if (activeFilter === "Reservados") {
      result = result.filter((g) => g.isReserved || g.isPurchased);
    }

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter((g) =>
        g.name.toLowerCase().includes(q) ||
        (g.description && g.description.toLowerCase().includes(q))
      );
    }

    result = sortGifts(result, sortOption);

    return result;
  }, [gifts, activeCategory, activeFilter, searchQuery, sortOption]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <ScrollFocusMask />
      <InteractiveEnvelope />
      <HeaderNav />
      {/* Hero Header Centralizado Verticalmente */}
      <header id="inicio" className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 py-20 border-b border-border/30 overflow-hidden">
        {/* Plano de fundo fotográfico do ensaio (PREWDG (125).jpg) */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <Image
            src="/pre-wedding/PREWDG (125).jpg"
            alt="Helloisa & Héber Ensaio Pré-Wedding"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-40 filter contrast-105 brightness-95 scale-105"
          />
          {/* Camadas de escurecimento, vinheta e gradientes para legibilidade do texto */}
          <div className="absolute inset-0 bg-background/50 backdrop-blur-[0.2px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.15)_0%,hsl(var(--background))_85%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-transparent to-background" />
        </div>

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

        <div className="relative z-10 max-w-3xl w-full my-auto flex flex-col items-center justify-center space-y-6 pt-12 md:pt-16 pb-8">
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-normal leading-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
            Helloisa <span className="text-primary italic">&amp;</span> Héber
          </h1>
          <div className="flex items-center justify-center gap-4 text-muted-foreground mt-2 mb-6 drop-shadow-md">
            <span className="w-12 h-px bg-border" />
            <p className="tracking-widest uppercase text-sm text-foreground/90 font-medium">22 de Novembro de 2026</p>
            <span className="w-12 h-px bg-border" />
          </div>

          <CountdownTimer />

          <p className="max-w-xl mx-auto text-muted-foreground pt-4 leading-relaxed font-sans">
            Nossa maior alegria é celebrar este momento com vocês.
            Caso queiram nos abençoar com um presente, preparamos esta lista com muito carinho.
          </p>

          {/* Player de áudio em segundo plano (acionado pelo tocador lateral flutuante) */}
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
      </header>

      {/* Linha do Tempo da História do Casal */}
      <CoupleTimeline />

      {/* Galeria de Fotos */}
      <PhotoGallery />

      {/* Main Content - Lista de Presentes */}
      <main id="presentes" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 scroll-mt-16">
        {/* Cabeçalho Solene da Lista de Presentes */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <p className="text-primary uppercase tracking-[0.3em] text-xs md:text-sm font-medium">
            Tributos e Lembranças
          </p>
          <h2 className="font-serif text-4xl md:text-6xl font-normal tracking-wide text-foreground">
            Lista de Casamento
          </h2>
          <MedievalDivider className="my-6" />
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-sans max-w-xl mx-auto">
            Preparamos cada item desta seleção com muito carinho para abençoar a construção do nosso novo lar.
          </p>
        </div>

        {/* Stats Summary - Placa Heráldica Emoldurada */}
        {summary && (
          <div className="flex justify-center mb-14">
            <div className="relative inline-flex items-center gap-8 md:gap-16 border border-border/80 px-10 py-5 bg-card/85 shadow-2xl shadow-black rounded-none">
              {/* Cantoneiras góticas decorativas */}
              <div className="absolute top-1.5 left-1.5 w-2 h-2 border-t border-l border-primary/60" />
              <div className="absolute top-1.5 right-1.5 w-2 h-2 border-t border-r border-primary/60" />
              <div className="absolute bottom-1.5 left-1.5 w-2 h-2 border-b border-l border-primary/60" />
              <div className="absolute bottom-1.5 right-1.5 w-2 h-2 border-b border-r border-primary/60" />

              <div className="text-center">
                <p className="text-3xl md:text-4xl font-serif text-foreground font-normal">{summary.available}</p>
                <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mt-1 font-serif">Disponíveis</p>
              </div>
              <div className="w-px h-10 bg-border/70" />
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-serif text-primary font-normal">{summary.reserved}</p>
                <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mt-1 font-serif">Reservados</p>
              </div>
            </div>
          </div>
        )}

        {/* Controls (Filter + Sort) */}
        {!isLoading && (
          <div className="flex flex-col gap-6 mb-12">
            {/* Category Tabs */}
            <div className="w-full flex justify-center">
              {categories.length > 1 && (
                <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full max-w-4xl">
                  <TabsList className="bg-transparent flex flex-wrap h-auto gap-2 p-0 justify-center">
                    {categories.map((cat) => (
                      <TabsTrigger
                        key={cat}
                        value={cat}
                        className="px-5 py-2 text-xs uppercase tracking-[0.2em] font-serif font-medium rounded-none border border-border/60 transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary data-[state=active]:shadow-glow-primary data-[state=inactive]:bg-card/40 data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:border-primary/50 data-[state=inactive]:hover:text-foreground shadow-none"
                      >
                        {cat}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              )}
            </div>

            {/* Sort Dropdown & Filters */}
            {gifts && gifts.length > 0 && (
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 w-full">
                {/* Search Bar - Left */}
                <div className="relative w-full lg:max-w-md flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/70" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar presentes no acervo..."
                    className="pl-9 h-11 w-full rounded-none border-border/70 bg-card/85 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-1 focus-visible:ring-primary/60 focus:border-primary transition-colors font-sans text-sm"
                  />
                </div>

                {/* Status and Sort Filters - Right */}
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0 justify-end">
                  <Select value={activeFilter} onValueChange={setActiveFilter}>
                    <SelectTrigger className="w-full sm:w-[170px] h-11 rounded-none border-border/70 bg-card/85 text-foreground focus:ring-1 focus:ring-primary/60 transition-colors font-serif tracking-wide text-xs uppercase">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border/80 rounded-none">
                      <SelectItem value="Todos" className="cursor-pointer font-serif text-xs uppercase tracking-wide">Todos os Status</SelectItem>
                      <SelectItem value="Disponíveis" className="cursor-pointer font-serif text-xs uppercase tracking-wide">Disponíveis</SelectItem>
                      <SelectItem value="Reservados" className="cursor-pointer font-serif text-xs uppercase tracking-wide">Reservados</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortOption} onValueChange={(val: any) => setSortOption(val)}>
                    <SelectTrigger className="w-full sm:w-[190px] h-11 rounded-none border-border/70 bg-card/85 text-foreground focus:ring-1 focus:ring-primary/60 transition-colors font-serif tracking-wide text-xs uppercase">
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border/80 rounded-none">
                      <SelectItem value="default" className="cursor-pointer font-serif text-xs uppercase tracking-wide">Ordem Padrão</SelectItem>
                      <SelectItem value="price-asc" className="cursor-pointer font-serif text-xs uppercase tracking-wide">Menor Preço</SelectItem>
                      <SelectItem value="price-desc" className="cursor-pointer font-serif text-xs uppercase tracking-wide">Maior Preço</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Gift Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col gap-4">
                <Skeleton className="w-full aspect-[4/3] " />
                <Skeleton className="h-6 w-1/3 " />
                <Skeleton className="h-4 w-full " />
                <Skeleton className="h-4 w-2/3 " />
              </div>
            ))}
          </div>
        ) : filteredGifts.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            <FreeValueGiftCard onClick={() => setShowFreeValueModal(true)} />
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
      <footer className="py-12 text-center border-t border-border/30 text-muted-foreground flex flex-col items-center gap-4">
        <p className="font-serif italic text-lg text-primary">Com amor, Helloisa &amp; Héber</p>
        <div className="text-sm max-w-sm px-4">
          <p className="font-medium text-foreground">Endereço para entrega de presentes físicos:</p>
          <p>R. Júlio José de Oliveira, 1250 - Colina Verde</p>
          <p>CEP: 45987-400</p>
        </div>
      </footer>

      {/* Modals */}
      <ReservationModal
        gift={selectedGift}
        isOpen={!!selectedGift}
        onClose={() => setSelectedGift(null)}
      />
      <FreeValueModal
        isOpen={showFreeValueModal}
        onClose={() => setShowFreeValueModal(false)}
      />

      {/* Tocador de Música Flutuante Inferior Direito */}
      <FloatingMusicPlayer
        isPlaying={isPlaying}
        onToggle={() => setIsPlaying(!isPlaying)}
      />
    </div>
  );
}
