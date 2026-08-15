"use client";

import { siteConfig } from "@/content/siteConfig";
import { dictionary } from "@/content/dictionary";
import { useLanguage } from "@/lib/language-context";

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
          <a href={siteConfig.github} target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">
            {dict.footer.github}
          </a>
        </div>
      </div>
    </footer>
  );
}
