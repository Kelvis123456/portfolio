"use client";

import { Link } from "next-view-transitions";
import { siteConfig } from "@/content/siteConfig";
import { dictionary } from "@/content/dictionary";
import { useLanguage } from "@/lib/language-context";

export function Footer() {
  const { locale } = useLanguage();
  const dict = dictionary[locale];
  // Computed directly rather than via an effect+state, which flashed an
  // empty value on first paint.
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border/60 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-6 text-center text-sm text-foreground/60 sm:flex-row sm:justify-between sm:text-left">
        <p>
          © {year} {siteConfig.name}
        </p>
        <div className="flex items-center gap-4">
          <a
            href={siteConfig.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-10 items-center hover:text-foreground transition-colors"
          >
            {dict.footer.github}
          </a>
          <Link
            href={`/${locale}/privacy`}
            className="inline-flex min-h-10 items-center hover:text-foreground transition-colors"
          >
            {dict.footer.privacy}
          </Link>
        </div>
      </div>
    </footer>
  );
}
