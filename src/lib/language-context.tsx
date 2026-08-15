"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";

export type Locale = "en" | "es";

export interface LocalizedText {
  en: string;
  es: string;
}

export interface LocalizedList {
  en: string[];
  es: string[];
}

const LanguageContext = createContext<Locale | null>(null);

export function LanguageProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return <LanguageContext.Provider value={locale}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const locale = useContext(LanguageContext);
  if (!locale) throw new Error("useLanguage must be used within a LanguageProvider");
  return { locale };
}

export function t(text: LocalizedText, locale: Locale): string {
  return text[locale];
}

export function tList(list: LocalizedList, locale: Locale): string[] {
  return list[locale];
}
