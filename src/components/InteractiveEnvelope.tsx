"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const kraftTexture = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")`;

export function InteractiveEnvelope() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [isBroken, setIsBroken] = useState(false); // Mantém o estado de "quebrado" do lacre

  useEffect(() => {
    setIsMounted(true);
    // Checa sessionStorage para não exibir toda vez
    const hasSeen = sessionStorage.getItem("hasSeenInvitation");
    if (hasSeen) {
      setIsVisible(false);
    }
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    // Evita scroll da página enquanto o envelope não sumir
    if (isVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isVisible, isMounted]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        sessionStorage.setItem("hasSeenInvitation", "true");
      }, 1000); // Espera 1s para a aba abrir antes de começar a desaparecer
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOpen) return;
    setIsOpen(true);
    setIsBroken(true);
  };

  if (!isMounted) {
    return (
      <div className="fixed inset-0 z-[100000] bg-background flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        <p className="font-serif text-muted-foreground tracking-widest text-sm uppercase">Carregando</p>
      </div>
    );
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 backdrop-blur-md overflow-hidden perspective-[1200px]"
          initial={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          <div className="relative w-[90vw] max-w-[800px] aspect-[4/3] md:aspect-[16/9] mx-auto flex items-center justify-center">

            {/* Fundo (Costas do Envelope) */}
            <div
              className="absolute inset-0 bg-[#4a131c] shadow-2xl rounded-sm"
              style={{ backgroundImage: kraftTexture }}
            />

            {/* Abas Frontais (Esquerda, Direita e Base) */}
            <div
              className="absolute inset-0 z-[3] pointer-events-none bg-[#5c1a24]"
              style={{
                backgroundImage: kraftTexture,
                clipPath: 'polygon(0 0, 50% 50%, 100% 0, 100% 100%, 0 100%)',
                boxShadow: 'inset 0 0 50px rgba(0,0,0,0.6)'
              }}
            >
              {/* Sombras para definir o vinco das dobras */}
              <div className="absolute inset-0 border border-black/10 mix-blend-multiply" />
              {/* Linhas diagonais usando gradientes podem simular os limites, mas o clip-path e o drop-shadow já fazem o trabalho visual pesado */}
            </div>

            {/* Aba Superior (Flap) */}
            <motion.div
              className="absolute top-0 left-0 w-full h-[55%] origin-top drop-shadow-2xl"
              initial={{ rotateX: 0, zIndex: 4 }}
              animate={{
                rotateX: isOpen ? 180 : 0,
                zIndex: isOpen ? 1 : 4
              }}
              transition={{
                rotateX: { duration: 1, delay: isOpen ? 0 : 0, ease: "easeInOut" },
                zIndex: { duration: 0, delay: isOpen ? 0.8 : 0 }
              }}
            >
              {/* Desenho da Aba com clipPath (isolado para não cortar o lacre) */}
              <div
                className="absolute inset-0 bg-[#6a1d29]"
                style={{
                  backgroundImage: kraftTexture,
                  clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                }}
              />

              {/* O Lacre de Cera */}
              <motion.button
                onClick={handleOpen}
                disabled={isOpen || isBroken}
                className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#111] flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                style={{
                  boxShadow: 'inset 0 0 12px rgba(255,255,255,0.15), 0 5px 15px rgba(0,0,0,0.8)',
                  border: '1px solid #2a2a2a'
                }}
                initial={{ opacity: 1, scale: 1 }}
                animate={
                  isBroken
                    ? { opacity: 0, scale: 0 } // Lacre "quebra"/desaparece ao abrir permanentemente
                    : {
                      boxShadow: [
                        'inset 0 0 12px rgba(255,255,255,0.15), 0 5px 15px rgba(0,0,0,0.8), 0 0 0 0 rgba(17,17,17,0.6)',
                        'inset 0 0 12px rgba(255,255,255,0.15), 0 5px 15px rgba(0,0,0,0.8), 0 0 0 15px rgba(17,17,17,0)'
                      ]
                    }
                }
                transition={isBroken ? { duration: 0.3 } : { repeat: Infinity, duration: 1.5 }}
              >
                <div className="w-[80%] h-[80%] rounded-full border border-[#444] flex items-center justify-center bg-[#0a0a0a]">
                  <span className="font-serif italic text-white/90 text-lg md:text-2xl drop-shadow-md">
                    H<span className="text-sm mx-1">&</span>H
                  </span>
                </div>
              </motion.button>
            </motion.div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
