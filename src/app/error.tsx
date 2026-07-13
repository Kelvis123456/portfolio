"use client";

import { useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { dictionary } from "@/content/dictionary";
import { useLanguage } from "@/lib/language-context";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { locale } = useLanguage();
  const dict = dictionary[locale];

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-32 text-center">
        <span className="text-sm font-medium uppercase tracking-widest text-foreground/50">
          {dict.errorPage.eyebrow}
        </span>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{dict.errorPage.heading}</h1>
        <p className="mt-4 max-w-md text-foreground/70">{dict.errorPage.body}</p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          <RefreshCw size={16} /> {dict.errorPage.retry}
        </button>
      </main>
      <Footer />
    </>
  );
}
