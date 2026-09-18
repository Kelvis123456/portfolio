import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "next-themes";
import { MotionConfig, LazyMotion, domMax } from "motion/react";
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
      {/*
        No `lang` attribute here on purpose (react-doctor's `html-has-lang`
        flag) — this root layout deliberately sits ABOVE `[locale]` and stays
        locale-invariant (see the WebGL/ThemeProvider remount lesson in this
        project's memory: putting locale-dependent content here would remount
        the GradientCanvas/ThemeProvider on every locale switch). Tried
        `next/root-params` to read the child segment's locale from here
        anyway, but its detection stops at the FIRST layout.tsx found walking
        down from `app/`, i.e. this one — it can't see into `[locale]/` at
        all when a plain layout already exists above it, so there's no
        supported way to get the real locale into this specific file's SSR
        output. The inline script below sets it from the URL as early as
        possible instead (correct before first paint, just not present in the
        raw server-rendered markup for a no-JS client).
      */}
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
          {/*
            domMax covers every motion feature already used across this app
            (layout/layoutId animations, exit animations, gestures) — loaded
            once here so every `m.*` component below shares it instead of
            each `motion.*` import bundling its own copy of the engine.
          */}
          <LazyMotion features={domMax} strict>
            <MotionConfig reducedMotion="user">
              <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                <div className="fixed inset-0 z-0 bg-background" aria-hidden>
                  <GradientCanvas className="pointer-events-none absolute inset-0 h-full w-full" />
                </div>
                <CursorSpotlight />
                {children}
              </ThemeProvider>
            </MotionConfig>
          </LazyMotion>
          <Analytics />
          <SpeedInsights />
        </body>
      </html>
    </ViewTransitions>
  );
}
