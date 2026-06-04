"use client";
import React, { useState, useMemo } from "react";
import { useListGifts, useGetGiftsSummary } from "@/lib/api-client-react";
import { GiftCard } from "@/components/GiftCard";
import { ReservationModal } from "@/components/ReservationModal";
import type { Gift } from "@/lib/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";

const RoseSVG = () => (
  <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true">
    <g opacity="0.85">
      <ellipse cx="60" cy="68" rx="28" ry="18" fill="#7c1f35" opacity="0.7" />
      <ellipse cx="60" cy="62" rx="22" ry="15" fill="#8a2236" opacity="0.8" />
      <ellipse cx="52" cy="56" rx="16" ry="11" fill="#9b2d42" opacity="0.9" />
      <ellipse cx="68" cy="54" rx="14" ry="10" fill="#9b2d42" opacity="0.85" />
      <ellipse cx="44" cy="62" rx="13" ry="9" fill="#8a2236" opacity="0.75" />
      <ellipse cx="76" cy="60" rx="13" ry="9" fill="#8a2236" opacity="0.75" />
      <ellipse cx="60" cy="48" rx="12" ry="9" fill="#b03050" opacity="0.9" />
      <ellipse cx="56" cy="44" rx="9" ry="7" fill="#c0364e" opacity="0.9" />
      <ellipse cx="64" cy="42" rx="9" ry="7" fill="#c0364e" opacity="0.85" />
      <ellipse cx="60" cy="38" rx="7" ry="6" fill="#d44060" opacity="0.95" />
      <ellipse cx="60" cy="34" rx="5" ry="4" fill="#e05070" opacity="1" />
      <ellipse cx="38" cy="72" rx="10" ry="14" fill="#3a6b2a" opacity="0.7" transform="rotate(-20,38,72)" />
      <ellipse cx="82" cy="74" rx="10" ry="14" fill="#3a6b2a" opacity="0.65" transform="rotate(20,82,74)" />
      <line x1="60" y1="86" x2="60" y2="105" stroke="#2e5222" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="50" cy="97" rx="9" ry="12" fill="#3a6b2a" opacity="0.6" transform="rotate(-15,50,97)" />
    </g>
  </svg>
);

const CornerOrnament = ({ position }: { position: "tl" | "tr" | "bl" | "br" }) => {
  const transforms: Record<string, string> = {
    tl: "",
    tr: "scale(-1,1)",
    bl: "scale(1,-1)",
    br: "scale(-1,-1)",
  };
  return (
    <svg
      viewBox="0 0 80 80"
      xmlns="http://www.w3.org/2000/svg"
      className="w-16 h-16 md:w-20 md:h-20 absolute"
      style={{
        top: position.startsWith("t") ? 0 : "auto",
        bottom: position.startsWith("b") ? 0 : "auto",
        left: position.endsWith("l") ? 0 : "auto",
        right: position.endsWith("r") ? 0 : "auto",
      }}
      aria-hidden="true"
    >
      <g transform={`translate(${position.endsWith("r") ? 80 : 0},${position.startsWith("b") ? 80 : 0}) ${transforms[position]}`} opacity="0.45" stroke="#9b2d42" strokeWidth="1.2" fill="none">
        <path d="M2,2 L2,30" strokeLinecap="round" />
        <path d="M2,2 L30,2" strokeLinecap="round" />
        <path d="M2,2 Q18,18 38,2" strokeLinecap="round" opacity="0.6" />
        <path d="M2,2 Q18,18 2,38" strokeLinecap="round" opacity="0.6" />
        <circle cx="2" cy="2" r="2" fill="#9b2d42" opacity="0.8" />
        <circle cx="30" cy="2" r="1.2" fill="#9b2d42" opacity="0.5" />
        <circle cx="2" cy="30" r="1.2" fill="#9b2d42" opacity="0.5" />
        <path d="M10,2 Q14,10 18,2" opacity="0.4" />
        <path d="M2,10 Q10,14 2,18" opacity="0.4" />
      </g>
    </svg>
  );
};

export default function Home() {
  const { data: gifts, isLoading } = useListGifts();
  const { data: summary } = useGetGiftsSummary();

  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("Todos");

  const categories = useMemo(() => {
    if (!gifts) return [];
    const cats = Array.from(new Set(gifts.map((g) => g.category).filter(Boolean) as string[])).sort();
    return ["Todos", ...cats];
  }, [gifts]);

  const filteredGifts = useMemo(() => {
    if (!gifts) return [];
    if (activeCategory === "Todos") return gifts;
    return gifts.filter((g) => g.category === activeCategory);
  }, [gifts, activeCategory]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Hero Header */}
      <header className="relative py-24 md:py-32 flex flex-col items-center justify-center text-center px-4 border-b border-border/30 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />

        {/* Corner ornaments */}
        <CornerOrnament position="tl" />
        <CornerOrnament position="tr" />
        <CornerOrnament position="bl" />
        <CornerOrnament position="br" />

        {/* Rose decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 md:w-24 md:h-24 -translate-y-1/3 z-10 pointer-events-none">
          <RoseSVG />
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
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Stats Summary */}
        {summary && (
          <div className="flex justify-center mb-12">
            <div className="inline-flex gap-8 md:gap-16 border border-border/50 px-8 py-4 bg-card/30 backdrop-blur-sm">
              <div className="text-center">
                <p className="text-2xl font-serif text-foreground">{summary.available}</p>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mt-1">Disponíveis</p>
              </div>
              <div className="w-px bg-border/50" />
              <div className="text-center">
                <p className="text-2xl font-serif text-primary">{summary.reserved}</p>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mt-1">Reservados</p>
              </div>
            </div>
          </div>
        )}

        {/* Category Tabs */}
        {!isLoading && categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`
                  px-5 py-2 text-xs uppercase tracking-[0.2em] font-medium border transition-all duration-300
                  ${activeCategory === cat
                    ? "bg-primary text-primary-foreground border-primary shadow-[0_0_20px_rgba(138,28,48,0.3)]"
                    : "bg-transparent text-muted-foreground border-border/40 hover:border-primary/50 hover:text-foreground"
                  }
                `}
              >
                {cat}
              </button>
            ))}
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
            <p className="font-serif text-2xl">Nenhum presente nesta categoria.</p>
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
