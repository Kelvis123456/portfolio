"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { dictionary } from "@/content/dictionary";
import { useLanguage } from "@/lib/language-context";

export default function NotFound() {
  const { locale } = useLanguage();
  const dict = dictionary[locale];

  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-32 text-center">
        <span className="text-sm font-medium uppercase tracking-widest text-foreground/50">404</span>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{dict.notFound.heading}</h1>
        <p className="mt-4 max-w-md text-foreground/70">{dict.notFound.body}</p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          <ArrowLeft size={16} /> {dict.notFound.backHome}
        </Link>
      </main>
      <Footer />
    </>
  );
}
