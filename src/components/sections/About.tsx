"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { MapPin } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/content/siteConfig";
import { dictionary } from "@/content/dictionary";
import { useLanguage, t } from "@/lib/language-context";
import { staggerContainer, fadeUp } from "@/lib/motion-variants";

function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let frameId = 0;
    const duration = 1200;
    const start = performance.now();
    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) frameId = requestAnimationFrame(tick);
    }
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [inView, value]);

  return <span ref={ref}>{display.toLocaleString()}</span>;
}

export function About() {
  const { locale } = useLanguage();
  const dict = dictionary[locale];
  const shouldReduceMotion = useReducedMotion();
  const initials = siteConfig.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <Section id="about">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading index="01" className="mb-10">
          {dict.about.heading}
        </SectionHeading>

        <motion.div variants={staggerContainer(0.1)} className="grid gap-4 sm:grid-cols-6">
          <motion.div
            variants={fadeUp}
            className="flex flex-col gap-6 rounded-2xl border border-border bg-surface p-8 shadow-sm sm:col-span-4 sm:flex-row sm:items-center dark:shadow-none dark:ring-1 dark:ring-white/5"
          >
            <motion.div
              className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/20 to-accent-2/20 font-display text-2xl font-semibold"
              style={{ transformStyle: "preserve-3d" }}
              whileHover={shouldReduceMotion ? undefined : { rotateX: -6, rotateY: 6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              {initials}
            </motion.div>
            <p className="text-foreground/70">{t(siteConfig.bio, locale)}</p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-surface p-8 text-center shadow-sm sm:col-span-2 dark:shadow-none dark:ring-1 dark:ring-white/5"
          >
            <MapPin size={20} className="text-foreground/65" />
            <p className="text-sm text-foreground/70">
              {dict.about.basedIn}
              <br />
              {t(siteConfig.location, locale)}
            </p>
          </motion.div>

          {siteConfig.metrics.map((metric) => (
            <motion.div
              key={metric.label.en}
              variants={fadeUp}
              className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:col-span-2 dark:shadow-none dark:ring-1 dark:ring-white/5"
            >
              <div className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                <AnimatedNumber value={metric.value} />
                {metric.label.en === "Lines of code (approx.)" && "+"}
              </div>
              <div className="mt-1 text-xs text-foreground/60">{t(metric.label, locale)}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}
