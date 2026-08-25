"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowDown } from "lucide-react";
import { GithubIcon } from "@/components/ui/GithubIcon";
import { siteConfig } from "@/content/siteConfig";
import { dictionary } from "@/content/dictionary";
import { useLanguage, t } from "@/lib/language-context";
import { staggerContainer, wordReveal } from "@/lib/motion-variants";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { LinkedinIcon } from "@/components/ui/LinkedinIcon";
import { Terminal } from "@/components/ui/Terminal";
import { CopyableEmailButton } from "@/components/ui/CopyableEmailButton";

export function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const { locale } = useLanguage();
  const dict = dictionary[locale];

  const words = t(siteConfig.tagline, locale).split(" ");

  return (
    <section id="top" className="relative flex min-h-[90vh] w-full flex-col items-center justify-center overflow-hidden px-6 pt-24 lg:min-h-screen">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(255,138,76,0.16),transparent_70%)]"
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer(0.04)}
        className="relative z-10 flex w-full max-w-3xl flex-col items-center text-center"
      >
        <motion.span
          variants={wordReveal}
          className="mb-5 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-accent-text lg:hidden"
        >
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
          {t(siteConfig.role, locale)}
        </motion.span>

        <h1 className="w-full text-balance text-[clamp(2rem,5.5vw,4rem)] font-display font-medium leading-[1.08] tracking-tight">
          {words.map((word, i) => (
            <span key={i}>
              <motion.span variants={wordReveal} className="inline-block">
                {word}
              </motion.span>
              {i < words.length - 1 ? " " : ""}
            </span>
          ))}
        </h1>

        <motion.div variants={wordReveal} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <MagneticButton href="#projects" className="bg-foreground text-background">
            {dict.hero.viewProjects}
          </MagneticButton>
          <MagneticButton
            href={siteConfig.github}
            target="_blank"
            rel="noreferrer"
            className="border border-border bg-surface"
          >
            <GithubIcon size={16} /> {dict.hero.github}
          </MagneticButton>
          <MagneticButton
            href={siteConfig.linkedin}
            target="_blank"
            rel="noreferrer"
            className="border border-border bg-surface"
          >
            <LinkedinIcon size={16} /> {dict.hero.linkedin}
          </MagneticButton>
          <CopyableEmailButton label={dict.hero.contact} className="border border-border bg-surface" />
        </motion.div>

        <motion.div variants={wordReveal} className="mt-12 w-full max-w-md">
          <Terminal />
        </motion.div>
      </motion.div>

      <motion.a
        href="#about"
        aria-label={dict.scrollDown}
        animate={shouldReduceMotion ? undefined : { y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        className="absolute bottom-10 z-10 text-foreground/65 hover:text-foreground/70 transition-colors"
      >
        <ArrowDown size={20} />
      </motion.a>
    </section>
  );
}
