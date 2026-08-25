import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "next-themes";
import { MotionConfig } from "motion/react";
import { ViewTransitions } from "next-view-transitions";
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
  style: ["normal"],
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ViewTransitions>
      <html
        translate="no"
        suppressHydrationWarning
        className={`notranslate ${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
      >
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html:
                '(function(){var m=location.pathname.match(/^\\/(en|es)(?:\\/|$)/);document.documentElement.lang=m?m[1]:"en";})();',
            }}
          />
        </head>
        <body className="min-h-full flex flex-col bg-background text-foreground">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-background"
          >
            Skip to content
          </a>
          <MotionConfig reducedMotion="user">
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              <div className="fixed inset-0 z-0 bg-background" aria-hidden>
                <GradientCanvas className="pointer-events-none absolute inset-0 h-full w-full" />
              </div>
              <CursorSpotlight />
              {children}
            </ThemeProvider>
          </MotionConfig>
          <Analytics />
          <SpeedInsights />
        </body>
      </html>
    </ViewTransitions>
  );
}
