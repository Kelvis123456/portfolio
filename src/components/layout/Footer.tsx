"use client";

import { siteConfig } from "@/content/siteConfig";
import { dictionary } from "@/content/dictionary";
import { useLanguage } from "@/lib/language-context";

const PERFORMANCE_DATE_LABEL: Record<string, string> = {
  en: new Date(`${siteConfig.performance.date}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }),
  es: new Date(`${siteConfig.performance.date}T00:00:00Z`).toLocaleDateString("es-DO", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }),
};

export function Footer({ year }: { year: number }) {
  const { locale } = useLanguage();
  const dict = dictionary[locale];

  return (
    <footer className="w-full border-t border-border/60 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-6 text-center text-sm text-foreground/60 sm:flex-row sm:justify-between sm:text-left">
        <p>
          © {year} {siteConfig.name}
        </p>
        <div className="flex items-center gap-4">
          <span
            title={`${siteConfig.performance.method} — ${siteConfig.performance.date}`}
            className="text-xs text-foreground/45"
          >
            {siteConfig.performance.score}/100 {dict.footer.performance} · {PERFORMANCE_DATE_LABEL[locale]}
          </span>
          <a href={siteConfig.github} target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">
            {dict.footer.github}
          </a>
        </div>
      </div>
    </footer>
  );
}
