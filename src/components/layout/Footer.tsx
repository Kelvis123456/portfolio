"use client";

import { siteConfig } from "@/content/siteConfig";
import { dictionary } from "@/content/dictionary";
import { useLanguage } from "@/lib/language-context";

// Spelled out instead of toLocaleDateString: Node's ICU and the browser's
// disagree on es-DO abbreviations ("ago" vs "ago."), a hydration mismatch.
const MONTHS = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  es: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
};
const [perfYear, perfMonth] = siteConfig.performance.date.split("-").map(Number);
const PERFORMANCE_DATE_LABEL: Record<string, string> = {
  en: `${MONTHS.en[perfMonth - 1]} ${perfYear}`,
  es: `${MONTHS.es[perfMonth - 1]} ${perfYear}`,
};

export function Footer() {
  const { locale } = useLanguage();
  const dict = dictionary[locale];
  // Computed directly rather than via an effect+state (which flashed an
  // empty value on first paint) — this is a static site, so the year is
  // effectively "frozen" at build time either way, same as the performance
  // date label above; a same-render value avoids the flash for free.
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border/60 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-6 text-center text-sm text-foreground/60 sm:flex-row sm:justify-between sm:text-left">
        <p>
          © {year} {siteConfig.name}
        </p>
        <div className="flex items-center gap-4">
          <span
            title={`${siteConfig.performance.method} — ${siteConfig.performance.date}`}
            className="text-xs text-foreground/60"
          >
            {siteConfig.performance.score}/100 {dict.footer.performance} · {PERFORMANCE_DATE_LABEL[locale]}
          </span>
          <a
            href={siteConfig.github}
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground transition-colors"
          >
            {dict.footer.github}
          </a>
        </div>
      </div>
    </footer>
  );
}
