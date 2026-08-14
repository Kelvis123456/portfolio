"use client";

import { motion, useReducedMotion } from "motion/react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { skillGroups } from "@/content/skills";
import { dictionary } from "@/content/dictionary";
import { useLanguage, t } from "@/lib/language-context";
import { staggerContainer, fadeUp } from "@/lib/motion-variants";
import { cn } from "@/lib/cn";

export function Skills() {
  const { locale } = useLanguage();
  const dict = dictionary[locale];
  const shouldReduceMotion = useReducedMotion();

  return (
    <Section id="skills">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading index="03">{dict.skills.heading}</SectionHeading>

        <motion.div variants={staggerContainer(0.1)} className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {skillGroups.map((group) => (
            <motion.div
              key={group.category.en}
              variants={fadeUp}
              className={cn(
                "rounded-2xl border border-border bg-surface p-6",
                group.items.length >= 5 ? "lg:col-span-3" : "lg:col-span-2"
              )}
            >
              <h3 className="text-sm font-medium uppercase tracking-widest text-foreground/65">
                {t(group.category, locale)}
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <motion.span
                    key={item}
                    whileHover={shouldReduceMotion ? undefined : { scale: 1.06, rotate: -2 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="rounded-full border border-border bg-surface-muted px-3 py-1.5 text-sm hover:border-accent-2/50 transition-colors"
                  >
                    {item}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}
