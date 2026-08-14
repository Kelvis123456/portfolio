import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "next-themes";
import { ViewTransitions } from "next-view-transitions";
import { LanguageProvider } from "@/lib/language-context";
import { CommandPaletteProvider } from "@/lib/command-palette-context";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@/content/siteConfig";
import { GradientCanvas } from "@/components/ui/GradientCanvas";
import { CursorSpotlight } from "@/components/ui/CursorSpotlight";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT", "WONK"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://portfolio-kelvis-g.vercel.app"),
  title: `${siteConfig.name} — ${siteConfig.role.en}`,
  description: siteConfig.tagline.en,
  other: {
    google: "notranslate",
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.name,
  jobTitle: siteConfig.role.en,
  description: siteConfig.bio.en,
  url: "https://portfolio-kelvis-g.vercel.app",
  email: `mailto:${siteConfig.email}`,
  sameAs: [siteConfig.github, siteConfig.linkedin],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html
        lang="en"
        translate="no"
        suppressHydrationWarning
        className={`notranslate ${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col bg-background text-foreground">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
          />
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <div className="fixed inset-0 z-0 bg-background" aria-hidden>
              <GradientCanvas className="pointer-events-none absolute inset-0 h-full w-full" />
            </div>
            <CursorSpotlight />
            <LanguageProvider>
              <CommandPaletteProvider>
                <ScrollProgress />
                <Sidebar />
                <Navbar />
                <div className="relative z-10 flex min-h-full flex-1 flex-col lg:pl-80">
                  {children}
                  <Footer />
                </div>
                <CommandPalette />
              </CommandPaletteProvider>
            </LanguageProvider>
          </ThemeProvider>
          <Analytics />
          <SpeedInsights />
        </body>
      </html>
    </ViewTransitions>
  );
}
