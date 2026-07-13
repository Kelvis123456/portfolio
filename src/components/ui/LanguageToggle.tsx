"use client";

import { AnimatePresence, motion } from "motion/react";
import { useLanguage } from "@/lib/language-context";
import { dictionary } from "@/content/dictionary";

export function LanguageToggle() {
  const { locale, setLocale, mounted } = useLanguage();

  if (!mounted) {
    return <div className="h-9 w-9" />;
  }

  const next = locale === "en" ? "es" : "en";

  return (
    <button
      type="button"
      aria-label={dictionary[locale].language}
      onClick={() => setLocale(next)}
      className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border text-xs font-semibold uppercase hover:bg-surface-muted transition-colors overflow-hidden"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={locale}
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 8, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {locale}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
