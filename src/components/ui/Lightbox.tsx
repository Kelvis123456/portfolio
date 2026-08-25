"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import { dictionary } from "@/content/dictionary";
import { useLanguage } from "@/lib/language-context";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";
import { pushModal, popModal, isTopModal } from "@/lib/modal-stack";

export function Lightbox({ images, alt }: { images: string[]; alt: string }) {
  const { locale } = useLanguage();
  const dict = dictionary[locale].lightbox;
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  // El lightbox parte "fit" (cabe en pantalla) -- "zoomed" muestra la imagen a
  // su resolución nativa dentro de un contenedor con scroll, para poder leer
  // texto chico de una captura de UI real sin que Next la re-escale/comprima
  // más allá de su tamaño original.
  const [zoomed, setZoomed] = useState(false);
  const [ratios, setRatios] = useState<Record<number, number>>({});
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const modalIdRef = useRef<symbol | null>(null);

  function showPrev() {
    setOpenIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
  }

  function showNext() {
    setOpenIndex((i) => (i === null ? null : (i + 1) % images.length));
  }

  function close() {
    setOpenIndex(null);
  }

  useEffect(() => {
    if (openIndex === null) return;
    function handleKey(e: KeyboardEvent) {
      if (!modalIdRef.current || !isTopModal(modalIdRef.current)) return;
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
      if (e.key !== "Tab") return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])'
      );
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openIndex, images.length]);

  useEffect(() => {
    setZoomed(false);
  }, [openIndex]);

  useEffect(() => {
    if (openIndex === null) return;
    const modalId = pushModal();
    modalIdRef.current = modalId;
    lockScroll();
    closeButtonRef.current?.focus();
    return () => {
      popModal(modalId);
      modalIdRef.current = null;
      unlockScroll();
      triggerRef.current?.focus();
    };
  }, [openIndex]);

  function handleThumbnailLoad(i: number, e: React.SyntheticEvent<HTMLImageElement>) {
    const img = e.currentTarget;
    if (img.naturalWidth && img.naturalHeight) {
      setRatios((r) => ({ ...r, [i]: img.naturalWidth / img.naturalHeight }));
    }
  }

  return (
    <>
      <div className={images.length > 1 ? "grid gap-4 sm:grid-cols-2" : "grid gap-4"}>
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={(e) => {
              triggerRef.current = e.currentTarget;
              setOpenIndex(i);
            }}
            style={{ aspectRatio: ratios[i] ?? 16 / 10 }}
            className="relative cursor-zoom-in overflow-hidden rounded-2xl border border-border bg-surface-muted"
          >
            <Image
              src={src}
              alt={`${alt} ${i + 1}`}
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              quality={90}
              onLoad={(e) => handleThumbnailLoad(i, e)}
              className="object-cover object-top transition-opacity hover:opacity-90"
            />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <motion.div
            ref={dialogRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={alt}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-6"
          >
            <button
              ref={closeButtonRef}
              type="button"
              aria-label={dict.close}
              onClick={(e) => {
                e.stopPropagation();
                close();
              }}
              className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <X size={18} />
            </button>
            <button
              type="button"
              aria-label={zoomed ? dict.zoomOut : dict.zoomIn}
              onClick={(e) => {
                e.stopPropagation();
                setZoomed((z) => !z);
              }}
              className="absolute right-20 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              {zoomed ? <ZoomOut size={18} /> : <ZoomIn size={18} />}
            </button>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label={dict.previousImage}
                  onClick={(e) => {
                    e.stopPropagation();
                    showPrev();
                  }}
                  className="absolute left-6 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  aria-label={dict.nextImage}
                  onClick={(e) => {
                    e.stopPropagation();
                    showNext();
                  }}
                  className="absolute right-6 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-xs text-white">
                  {openIndex + 1} / {images.length}
                </div>
              </>
            )}

            {/* Clicking the image bubbles to the backdrop and closes the lightbox
                (the standard convention) — zoom is only triggered by the dedicated
                button above, not by clicking the image itself. */}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className={
                zoomed
                  ? "relative max-h-[85vh] max-w-[90vw] overflow-auto rounded-xl"
                  : "relative max-h-[85vh] max-w-[90vw]"
              }
            >
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
