"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";

export function Lightbox({ images, alt }: { images: string[]; alt: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenIndex(null);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <>
      <div className={images.length > 1 ? "grid gap-4 sm:grid-cols-2" : "grid gap-4"}>
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="cursor-zoom-in overflow-hidden rounded-2xl border border-black/10 dark:border-white/10"
          >
            <Image src={src} alt={`${alt} ${i + 1}`} width={1280} height={800} className="h-auto w-full object-cover transition-opacity hover:opacity-90" />
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
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[85vh] max-w-[90vw]"
            >
              <Image
                src={images[openIndex]}
                alt={`${alt} ${openIndex + 1}`}
                width={1920}
                height={1200}
                className="max-h-[85vh] w-auto rounded-xl object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
