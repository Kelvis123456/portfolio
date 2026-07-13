"use client";

import { motion } from "motion/react";
import { FolderGit2, Mail } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { siteConfig } from "@/content/siteConfig";
import { dictionary } from "@/content/dictionary";
import { useLanguage } from "@/lib/language-context";
import { fadeUp } from "@/lib/motion-variants";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { LinkedinIcon } from "@/components/ui/LinkedinIcon";

export function Contact() {
  const { locale } = useLanguage();
  const dict = dictionary[locale];

  return (
    <Section id="contact">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <motion.h2 variants={fadeUp} className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {dict.contact.heading}
        </motion.h2>
        <motion.p variants={fadeUp} className="mt-4 text-foreground/70">
          {dict.contact.body}
        </motion.p>
        <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <MagneticButton href={`mailto:${siteConfig.email}`} className="bg-foreground text-background">
            <Mail size={16} /> {siteConfig.email}
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
        </motion.div>
      </div>
    </Section>
  );
}
