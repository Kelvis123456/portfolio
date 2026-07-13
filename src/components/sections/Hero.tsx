"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowDown, FolderGit2, Mail } from "lucide-react";
import { siteConfig } from "@/content/siteConfig";
import { dictionary } from "@/content/dictionary";
import { useLanguage, t } from "@/lib/language-context";
import { staggerContainer, wordReveal } from "@/lib/motion-variants";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { LinkedinIcon } from "@/components/ui/LinkedinIcon";
import { NetworkCanvas } from "@/components/ui/NetworkCanvas";
import { Terminal } from "@/components/ui/Terminal";

export function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const { locale } = useLanguage();
  const dict = dictionary[locale];

  const words = t(siteConfig.tagline, locale).split(" ");

  return (
    <section id="top" className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 pt-20">
      <NetworkCanvas />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(124,138,255,0.08),transparent_70%)]"
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer(0.06)}
        className="relative z-10 flex max-w-3xl flex-col items-center text-center"
      >
        <motion.span variants={wordReveal} className="mb-4 text-sm font-medium uppercase tracking-widest text-foreground/50">
          {t(siteConfig.role, locale)}
        </motion.span>

        <h1 className="flex flex-wrap justify-center gap-x-3 text-4xl font-semibold tracking-tight sm:text-6xl">
          {words.map((word, i) => (
            <motion.span key={i} variants={wordReveal} className="inline-block">
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.div variants={wordReveal} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <MagneticButton href="#projects" className="bg-foreground text-background">
            {dict.hero.viewProjects}
          </MagneticButton>
          <MagneticButton
            href={siteConfig.github}
            className="border border-black/10 dark:border-white/15"
          >
            <FolderGit2 size={16} /> {dict.hero.github}
          </MagneticButton>
          <MagneticButton
            href={siteConfig.linkedin}
            className="border border-black/10 dark:border-white/15"
          >
            <LinkedinIcon size={16} /> {dict.hero.linkedin}
          </MagneticButton>
          <MagneticButton
            href={`mailto:${siteConfig.email}`}
            className="border border-black/10 dark:border-white/15"
          >
            <Mail size={16} /> {dict.hero.contact}
          </MagneticButton>
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
        className="absolute bottom-10 z-10 text-foreground/40 hover:text-foreground/70 transition-colors"
      >
        <ArrowDown size={20} />
      </motion.a>
    </section>
  );
}
