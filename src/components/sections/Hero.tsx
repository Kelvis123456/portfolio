"use client";

import { motion, useReducedMotion, useTransform } from "motion/react";
import { ArrowDown, FolderGit2, Mail } from "lucide-react";
import { LinkedinIcon } from "@/components/ui/LinkedinIcon";
import { siteConfig } from "@/content/siteConfig";
import { staggerContainer, wordReveal } from "@/lib/motion-variants";
import { useMousePosition } from "@/hooks/useMousePosition";
import { MagneticButton } from "@/components/ui/MagneticButton";

export function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const { x, y } = useMousePosition();
  const bgX = useTransform(x, (v) => v - 300);
  const bgY = useTransform(y, (v) => v - 300);

  const words = siteConfig.tagline.split(" ");

  return (
    <section id="top" className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 pt-20">
      {!shouldReduceMotion && (
        <motion.div
          aria-hidden
          style={{ x: bgX, y: bgY }}
          className="pointer-events-none absolute h-[600px] w-[600px] rounded-full bg-gradient-to-br from-violet-500/20 via-sky-500/10 to-transparent blur-3xl"
        />
      )}

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer(0.06)}
        className="relative z-10 flex max-w-3xl flex-col items-center text-center"
      >
        <motion.span variants={wordReveal} className="mb-4 text-sm font-medium uppercase tracking-widest text-foreground/50">
          {siteConfig.role}
        </motion.span>

        <h1 className="flex flex-wrap justify-center gap-x-3 text-4xl font-semibold tracking-tight sm:text-6xl">
          {words.map((word, i) => (
            <motion.span key={i} variants={wordReveal} className="inline-block">
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p variants={wordReveal} className="mt-6 max-w-xl text-base text-foreground/70 sm:text-lg">
          {siteConfig.bio}
        </motion.p>

        <motion.div variants={wordReveal} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <MagneticButton href="#projects" className="bg-foreground text-background">
            View projects
          </MagneticButton>
          <MagneticButton
            href={siteConfig.github}
            className="border border-black/10 dark:border-white/15"
          >
            <FolderGit2 size={16} /> GitHub
          </MagneticButton>
          <MagneticButton
            href={siteConfig.linkedin}
            className="border border-black/10 dark:border-white/15"
          >
            <LinkedinIcon size={16} /> LinkedIn
          </MagneticButton>
          <MagneticButton
            href={`mailto:${siteConfig.email}`}
            className="border border-black/10 dark:border-white/15"
          >
            <Mail size={16} /> Contact
          </MagneticButton>
        </motion.div>
      </motion.div>

      <motion.a
        href="#about"
        aria-label="Scroll down"
        animate={shouldReduceMotion ? undefined : { y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        className="absolute bottom-10 z-10 text-foreground/40 hover:text-foreground/70 transition-colors"
      >
        <ArrowDown size={20} />
      </motion.a>
    </section>
  );
}
