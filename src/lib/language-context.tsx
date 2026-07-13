"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Locale = "en" | "es";

export interface LocalizedText {
  en: string;
  es: string;
}

export interface LocalizedList {
  en: string[];
  es: string[];
}

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  mounted: boolean;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "locale";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "es") {
      setLocaleState(stored);
    } else {
      const browserLang = window.navigator.language.toLowerCase();
      setLocaleState(browserLang.startsWith("es") ? "es" : "en");
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.lang = locale;
  }, [locale, mounted]);

  function setLocale(next: Locale) {
    setLocaleState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, mounted }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}

export function t(text: LocalizedText, locale: Locale): string {
  return text[locale];
}

export function tList(list: LocalizedList, locale: Locale): string[] {
  return list[locale];
}
