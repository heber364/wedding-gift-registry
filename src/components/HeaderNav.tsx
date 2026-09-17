"use client";

import React, { useState, useEffect } from "react";

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Início", href: "#inicio" },
  { label: "Nossa História", href: "#historia" },
  { label: "Galeria", href: "#galeria" },
  { label: "Presentes", href: "#presentes" },
];

export function HeaderNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex justify-center px-4 py-4 md:py-6 pointer-events-none transition-all duration-500">
      <nav
        aria-label="Navegação Principal"
        className={`pointer-events-auto flex items-center gap-3 sm:gap-6 md:gap-8 px-6 sm:px-10 py-2.5 md:py-3 transition-all duration-500 ${
          scrolled
            ? "bg-background/90 border-b border-primary/30 shadow-2xl shadow-black/90"
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
              className="font-serif tracking-[0.2em] uppercase text-xs md:text-sm text-foreground/80 hover:text-primary transition-colors duration-300 relative py-1 group"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-primary group-hover:w-full transition-all duration-300 ease-out" />
            </a>
          </React.Fragment>
        ))}
      </nav>
    </header>
  );
}
