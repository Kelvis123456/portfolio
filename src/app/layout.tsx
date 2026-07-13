import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/lib/language-context";
import { siteConfig } from "@/content/siteConfig";
import { NetworkCanvas } from "@/components/ui/NetworkCanvas";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    <html
      lang="en"
      translate="no"
      suppressHydrationWarning
      className={`notranslate ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="fixed inset-0 z-0 bg-background" aria-hidden>
            <NetworkCanvas className="pointer-events-none absolute inset-0 h-full w-full opacity-60" />
          </div>
          <LanguageProvider>
            <div className="relative z-10 flex min-h-full flex-1 flex-col">{children}</div>
          </LanguageProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
