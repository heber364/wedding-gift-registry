"use client";

import React from "react";

/**
 * Máscara óptica suave na rolagem.
 * Aplica um leve desfoque óptico (backdrop blur fraco e sutil) nas bordas
 * superior e inferior da tela, sem vinhetas escuras ou gradientes pesados,
 * preservando a visibilidade natural e suavizando as extremidades.
 */
export function ScrollFocusMask() {
  return (
    <>
      {/* Borrão Suave Superior (sem vinheta escura) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 inset-x-0 h-20 sm:h-24 md:h-28 z-30 overflow-hidden select-none"
      >
        <div
          className="absolute inset-0 backdrop-blur-[3px]"
          style={{
            maskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0) 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0) 100%)",
          }}
        />
      </div>

      {/* Borrão Suave Inferior (sem vinheta escura) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-0 inset-x-0 h-20 sm:h-24 md:h-28 z-30 overflow-hidden select-none"
      >
        <div
          className="absolute inset-0 backdrop-blur-[3px]"
          style={{
            maskImage:
              "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0) 100%)",
            WebkitMaskImage:
              "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0) 100%)",
          }}
        />
      </div>
    </>
  );
}
