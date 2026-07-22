"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { X, ZoomIn, ZoomOut } from "lucide-react";

export function Lightbox({ images, alt }: { images: string[]; alt: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  // El lightbox parte "fit" (cabe en pantalla) -- "zoomed" muestra la imagen a
  // su resolución nativa dentro de un contenedor con scroll, para poder leer
  // texto chico de una captura de UI real sin que Next la re-escale/comprima
  // más allá de su tamaño original.
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenIndex(null);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    setZoomed(false);
  }, [openIndex]);

  return (
    <>
      <div className={images.length > 1 ? "grid gap-4 sm:grid-cols-2" : "grid gap-4"}>
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="cursor-zoom-in overflow-hidden rounded-2xl border border-border"
          >
            <Image
              src={src}
              alt={`${alt} ${i + 1}`}
              width={1440}
              height={900}
              quality={100}
              className="h-auto w-full object-cover object-top transition-opacity hover:opacity-90"
            />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenIndex(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-6"
          >
            <button
              type="button"
              aria-label="Close"
              onClick={() => setOpenIndex(null)}
              className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <X size={18} />
            </button>
            <button
              type="button"
              aria-label={zoomed ? "Zoom out" : "Zoom in"}
              onClick={(e) => {
                e.stopPropagation();
                setZoomed((z) => !z);
              }}
              className="absolute right-20 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              {zoomed ? <ZoomOut size={18} /> : <ZoomIn size={18} />}
            </button>
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                setZoomed((z) => !z);
              }}
              className={
                zoomed
                  ? "relative max-h-[85vh] max-w-[90vw] cursor-zoom-out overflow-auto rounded-xl"
                  : "relative max-h-[85vh] max-w-[90vw] cursor-zoom-in"
              }
            >
              {/* Ancho/alto real de origen (1440px de captura Desktop) -- nunca más
                  grande, para que next/image nunca haga upscale (eso era el bug:
                  pedía 1920x1200 de un source de 1440px de ancho, forzando un
                  reescalado hacia arriba que se ve borroso). En modo "zoomed" se
                  renderiza a resolución nativa 1:1 dentro de un contenedor con
                  scroll, en vez de encogerla para que quepa en la pantalla. */}
              <Image
                src={images[openIndex]}
                alt={`${alt} ${openIndex + 1}`}
                width={1440}
                height={900}
                quality={100}
                className={zoomed ? "w-auto max-w-none rounded-xl" : "max-h-[85vh] w-auto rounded-xl object-contain"}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
