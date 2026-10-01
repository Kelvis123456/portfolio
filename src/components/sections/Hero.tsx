"use client";

import type { CSSProperties } from "react";
import { m, useReducedMotion } from "motion/react";
import { ArrowDown, FileText } from "lucide-react";
import { GithubIcon } from "@/components/ui/GithubIcon";
import { siteConfig } from "@/content/siteConfig";
import { dictionary } from "@/content/dictionary";
import { useLanguage, t } from "@/lib/language-context";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Terminal } from "@/components/ui/Terminal";
import { CopyableEmailButton } from "@/components/ui/CopyableEmailButton";

// Stagger for the CSS entrance (.hero-in in globals.css).
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const { locale } = useLanguage();
  const dict = dictionary[locale];

  return (
    <section
      id="top"
      className="relative flex min-h-[90svh] w-full flex-col items-center justify-center overflow-hidden px-6 pt-24 lg:min-h-screen"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(255,138,76,0.16),transparent_70%)]"
      />

      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center text-center">
        {/* Desktop shows name + role in the sidebar; on mobile this is the only place. */}
        <p className="hero-in mb-5 flex flex-col items-center gap-1.5 lg:hidden">
          <span className="font-display text-xl font-semibold tracking-tight">{siteConfig.name}</span>
          <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-orange-800 dark:text-accent-text">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            {t(siteConfig.role, locale)}
          </span>
        </p>

        <h1
          style={delay(60)}
          className="hero-in w-full text-balance text-[clamp(2rem,5.5vw,4rem)] font-display font-medium leading-[1.08] tracking-tight"
        >
          {t(siteConfig.tagline, locale)}
        </h1>

        <p
          style={delay(140)}
          className="hero-in mt-6 flex items-start gap-2 text-left text-sm text-muted-foreground sm:items-center"
        >
          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent-2 sm:mt-0" aria-hidden />
          {dict.hero.available}
        </p>

        <div style={delay(200)} className="hero-in mt-10 flex flex-wrap items-center justify-center gap-4">
          <MagneticButton href="#projects" className="bg-foreground text-background hover:bg-foreground/88">
            {dict.hero.viewProjects}
          </MagneticButton>
          <MagneticButton
            href={locale === "es" ? "/resume-es.pdf" : "/resume-en.pdf"}
            target="_blank"
            rel="noreferrer"
            className="border border-border bg-surface hover:border-accent-text/30 hover:bg-surface-muted"
          >
            <FileText size={16} /> {dict.hero.resume}
          </MagneticButton>
          <MagneticButton
            href={siteConfig.github}
            target="_blank"
            rel="noreferrer"
            className="border border-border bg-surface hover:border-accent-text/30 hover:bg-surface-muted"
          >
            <GithubIcon size={16} /> {dict.hero.github}
          </MagneticButton>
          <CopyableEmailButton
            label={dict.hero.contact}
            className="border border-border bg-surface hover:border-accent-text/30 hover:bg-surface-muted"
          />
        </div>

        <div style={delay(260)} className="hero-in mt-12 hidden w-full max-w-md sm:block">
          <Terminal />
        </div>
      </div>

      <m.a
        href="#about"
        aria-label={dict.scrollDown}
        animate={shouldReduceMotion ? undefined : { y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        className="absolute bottom-10 z-10 hidden text-foreground/65 transition-colors hover:text-foreground lg:block"
      >
        <ArrowDown size={20} />
      </m.a>
    </section>
  );
}
