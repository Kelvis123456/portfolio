"use client";

import { usePathname } from "next/navigation";
import { useTransitionRouter } from "next-view-transitions";
import { dictionary } from "@/content/dictionary";
import { useLanguage, type Locale } from "@/lib/language-context";

function swapLocaleInPath(pathname: string, next: Locale): string {
  const segments = pathname.split("/");
  segments[1] = next;
  return segments.join("/") || `/${next}`;
}

export function LanguageToggle() {
  const { locale } = useLanguage();
  const pathname = usePathname();
  const router = useTransitionRouter();
  const next: Locale = locale === "en" ? "es" : "en";

  function handleClick() {
    document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=31536000`;
    // Keep the section anchor: /en#projects should land on /es#projects, not the top.
    router.push(swapLocaleInPath(pathname, next) + window.location.hash);
  }

  return (
    <button
      type="button"
      // Shows where the click takes you (the other language), not where you are.
      aria-label={`${dictionary[locale].language}: ${next === "es" ? "Español" : "English"}`}
      lang={next}
      onClick={handleClick}
      className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-xs font-semibold uppercase hover:bg-surface-muted transition-colors"
    >
      {next}
    </button>
  );
}
