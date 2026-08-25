"use client";

import { usePathname } from "next/navigation";
import { Link } from "next-view-transitions";
import { ArrowLeft } from "lucide-react";
import { dictionary } from "@/content/dictionary";
import type { Locale } from "@/lib/language-context";

export default function NotFound() {
  const pathname = usePathname();
  const locale: Locale = pathname?.startsWith("/es") ? "es" : "en";
  const dict = dictionary[locale];

  return (
    <main className="flex min-h-full flex-1 flex-col items-center justify-center px-6 py-32 text-center">
      <span className="text-sm font-medium uppercase tracking-widest text-foreground/65">404</span>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{dict.notFound.heading}</h1>
      <p className="mt-4 max-w-md text-foreground/70">{dict.notFound.body}</p>
      <Link
        href={`/${locale}`}
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
      >
        <ArrowLeft size={16} /> {dict.notFound.backHome}
      </Link>
    </main>
  );
}
