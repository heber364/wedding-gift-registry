"use client";

import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { MedievalDivider } from "@/components/ui/GothicOrnaments";

interface NavItem {
  label: string;
  href: string;
  roman: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Início", href: "#inicio", roman: "I" },
  { label: "Nossa História", href: "#historia", roman: "II" },
  { label: "Galeria", href: "#galeria", roman: "III" },
  { label: "Presentes", href: "#presentes", roman: "IV" },
];

export function HeaderNav() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // Handle escape key to close menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen]);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const targetId = href.replace("#", "");
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* ─── DESKTOP HEADER (≥ 768px) ─── */}
      <header className="fixed top-0 left-0 right-0 z-40 hidden md:flex justify-center px-4 py-4 md:py-6 pointer-events-none transition-all duration-500">
        <nav
          aria-label="Navegação Principal Desktop"
          className={`pointer-events-auto flex items-center gap-4 lg:gap-8 px-8 lg:px-10 py-3 transition-all duration-500 ${
            scrolled
              ? "bg-background/90 border-b border-primary/30 shadow-2xl shadow-black/90 backdrop-blur-md"
              : "bg-transparent border-b border-transparent"
          }`}
        >
          {NAV_ITEMS.map((item, idx) => (
            <React.Fragment key={item.href}>
              {idx > 0 && (
                <span className="text-primary/40 text-[10px] select-none">✦</span>
              )}
              <a
                href={item.href}
                onClick={(e) => handleScrollTo(e, item.href)}
                className="font-serif tracking-[0.2em] uppercase text-xs lg:text-sm text-foreground/80 hover:text-primary transition-colors duration-300 relative py-1 group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-primary group-hover:w-full transition-all duration-300 ease-out" />
              </a>
            </React.Fragment>
          ))}
        </nav>
      </header>

      {/* ─── MOBILE TOP BAR (< 768px) ─── */}
      <header className="fixed top-0 left-0 right-0 z-40 flex md:hidden items-center justify-between px-4 py-3 pointer-events-auto transition-all duration-500">
        <div
          className={`absolute inset-0 transition-all duration-500 pointer-events-none -z-10 ${
            scrolled
              ? "bg-background/95 border-b border-primary/30 shadow-xl shadow-black/80 backdrop-blur-md"
              : "bg-background/50 border-b border-border/20 backdrop-blur-xs"
          }`}
        />

        {/* Monograma do Casal */}
        <a
          href="#inicio"
          onClick={(e) => handleScrollTo(e, "#inicio")}
          className="font-serif tracking-[0.25em] text-xs uppercase text-foreground hover:text-primary transition-colors flex items-center gap-1.5"
        >
          <span>H</span>
          <span className="text-primary text-[10px]">✦</span>
          <span>H</span>
        </a>

        {/* Botão Acionador de Menu */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-expanded={isMobileMenuOpen}
          aria-label="Abrir menu de navegação"
          className="rounded-none border border-border/70 hover:border-primary/80 bg-card/60 active:bg-primary/10 px-3 py-1.5 text-xs font-serif tracking-[0.2em] uppercase flex items-center gap-2 text-foreground/90 hover:text-primary transition-all duration-300"
        >
          <Menu className="w-3.5 h-3.5 text-primary" />
          <span>Menu</span>
        </button>
      </header>

      {/* ─── MOBILE MENU OVERLAY / GAVETA GÓTICA (< 768px) ─── */}
      {isMobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu de Navegação"
          className="fixed inset-0 z-50 md:hidden bg-background/98 backdrop-blur-md flex flex-col justify-between p-6 sm:p-8 animate-in fade-in duration-300"
        >
          {/* Moldura de Cantoneiras Góticas Decorativas */}
          <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-primary/60 pointer-events-none" />
          <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-primary/60 pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-primary/60 pointer-events-none" />
          <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-primary/60 pointer-events-none" />

          {/* Top Bar do Modal */}
          <div className="flex items-center justify-between w-full border-b border-border/40 pb-4">
            <span className="font-serif tracking-[0.25em] text-xs uppercase text-primary font-medium">
              Helloisa &amp; Héber
            </span>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Fechar menu"
              className="rounded-none border border-border/70 hover:border-primary/80 active:bg-primary/10 px-3 py-1.5 font-serif text-xs uppercase tracking-[0.2em] flex items-center gap-1.5 text-foreground hover:text-primary transition-colors min-h-[40px]"
            >
              <X className="w-4 h-4 text-primary" />
              <span>Fechar</span>
            </button>
          </div>

          {/* Conteúdo Central: Lista Nobre de Links */}
          <div className="flex flex-col items-center justify-center my-auto w-full max-w-sm mx-auto">
            <p className="text-primary uppercase tracking-[0.3em] text-[10px] font-serif mb-2">
              Navegação
            </p>
            <MedievalDivider className="my-3 max-w-[200px]" />

            <nav className="flex flex-col w-full mt-4 space-y-1">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleScrollTo(e, item.href)}
                  className="group flex items-center justify-between py-4 px-4 border-b border-border/30 hover:border-primary/60 hover:bg-primary/5 transition-all duration-300"
                >
                  <span className="font-serif text-xl sm:text-2xl uppercase tracking-[0.25em] text-foreground group-hover:text-primary transition-colors">
                    {item.label}
                  </span>
                  <span className="font-serif italic text-primary/70 group-hover:text-primary text-sm tracking-widest transition-colors">
                    {item.roman} ✦
                  </span>
                </a>
              ))}
            </nav>
          </div>

          {/* Rodapé do Modal */}
          <div className="text-center pt-4 border-t border-border/40 space-y-1">
            <p className="font-serif tracking-widest uppercase text-[11px] text-muted-foreground">
              22 de Novembro de 2026
            </p>
            <p className="font-serif italic text-xs text-primary/80">
              Celebrando o nosso amor e união
            </p>
          </div>
        </div>
      )}
    </>
  );
}
