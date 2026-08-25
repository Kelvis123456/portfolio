import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LanguageProvider, type Locale } from "@/lib/language-context";
import { CommandPaletteProvider } from "@/lib/command-palette-context";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@/content/siteConfig";

const LOCALES: Locale[] = ["en", "es"];

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = rawLocale === "es" ? "es" : "en";

  return {
    metadataBase: new URL(siteConfig.url),
    title: `${siteConfig.name} — ${siteConfig.role[locale]}`,
    description: siteConfig.tagline[locale],
    alternates: {
      canonical: `${siteConfig.url}/${locale}`,
      languages: {
        en: `${siteConfig.url}/en`,
        es: `${siteConfig.url}/es`,
      },
    },
    other: {
      google: "notranslate",
    },
  };
}

function personJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    jobTitle: siteConfig.role[locale],
    description: siteConfig.bio[locale],
    url: siteConfig.url,
    email: `mailto:${siteConfig.email}`,
    sameAs: [siteConfig.github, siteConfig.linkedin],
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale: rawLocale } = await params;
  if (!LOCALES.includes(rawLocale as Locale)) notFound();
  const locale = rawLocale as Locale;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd(locale)) }}
      />
      <LanguageProvider locale={locale}>
        <CommandPaletteProvider>
          <ScrollProgress />
          <Sidebar />
          <Navbar />
          <div id="main-content" tabIndex={-1} className="relative z-10 flex min-h-full flex-1 flex-col outline-none lg:pl-80">
            {children}
            <Footer />
          </div>
          <CommandPalette />
        </CommandPaletteProvider>
      </LanguageProvider>
    </>
  );
}
