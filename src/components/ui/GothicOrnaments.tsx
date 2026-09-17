import React from "react";

/**
 * Delicado marcador de nó floral com espinhos e rosa em tons bordô
 */
export function RoseMarker({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="12" cy="12" r="10" className="stroke-primary/40 fill-background" strokeWidth="1.5" />
      {/* Pétalas da rosa */}
      <path
        d="M12 7C9.5 7 8 8.8 8 11C8 13.5 10 15 12 16.5C14 15 16 13.5 16 11C16 8.8 14.5 7 12 7Z"
        className="fill-primary"
      />
      <path
        d="M12 9C10.5 9 9.8 10 9.8 11.2C9.8 12.5 11 13.5 12 14.2C13 13.5 14.2 12.5 14.2 11.2C14.2 10 13.5 9 12 9Z"
        className="fill-primary-foreground/30"
      />
      {/* Espinhos e folhagens */}
      <path
        d="M5 12C7 11 8 13 9 12M15 12C16 13 17 11 19 12M12 5C11 7 13 8 12 9M12 15C13 16 11 17 12 19"
        className="stroke-primary"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Divisor medieval gótico com espinhos e flor central
 */
export function MedievalDivider({ className = "my-12" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 w-full max-w-lg mx-auto ${className}`}>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/40 to-primary/80" />
      <div className="flex items-center gap-2 text-primary">
        <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5L8 0Z" />
        </svg>
        <RoseMarker className="w-5 h-5 drop-shadow-[0_0_8px_rgba(138,28,48,0.4)]" />
        <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5L8 0Z" />
        </svg>
      </div>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent via-primary/40 to-primary/80" />
    </div>
  );
}

/**
 * Segmento vertical com espinhos para a linha do tempo
 */
export function ThornLine({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex flex-col items-center justify-center w-6 h-full ${className}`}>
      {/* Linha base central */}
      <div className="w-[2px] h-full bg-gradient-to-b from-primary/20 via-primary/60 to-primary/20" />
      {/* Espinhos projetados lateralmente */}
      <svg
        className="absolute top-1/4 w-5 h-5 text-primary/70 -translate-x-1/2 pointer-events-none"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M10 0C10 5 3 7 0 10C3 13 10 15 10 20C10 15 17 13 20 10C17 7 10 5 10 0Z" />
      </svg>
      <svg
        className="absolute top-3/4 w-4 h-4 text-primary/50 translate-x-1/2 pointer-events-none"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M10 2C10 6 5 8 2 10C5 12 10 14 10 18C10 14 15 12 18 10C15 8 10 6 10 2Z" />
      </svg>
    </div>
  );
}
