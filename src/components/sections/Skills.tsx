"use client";

import { motion, useReducedMotion } from "motion/react";
import { Section } from "@/components/ui/Section";
import { skillGroups } from "@/content/skills";
import { dictionary } from "@/content/dictionary";
import { useLanguage, t } from "@/lib/language-context";
import { staggerContainer, fadeUp } from "@/lib/motion-variants";

export function Skills() {
  const { locale } = useLanguage();
  const dict = dictionary[locale];
  const shouldReduceMotion = useReducedMotion();

  return (
    <Section id="skills">
      <div className="mx-auto max-w-5xl px-6">
        <motion.h2 variants={fadeUp} className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {dict.skills.heading}
        </motion.h2>

        <motion.div variants={staggerContainer(0.1)} className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group) => (
            <motion.div key={group.category.en} variants={fadeUp}>
              <h3 className="text-sm font-medium uppercase tracking-widest text-foreground/50">
                {t(group.category, locale)}
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <motion.span
                    key={item}
                    whileHover={shouldReduceMotion ? undefined : { scale: 1.06, rotate: -2 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="rounded-full border border-border px-3 py-1.5 text-sm hover:border-accent-2/50 transition-colors"
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
