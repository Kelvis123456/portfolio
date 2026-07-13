"use client";

import { motion } from "motion/react";
import { Download, FolderGit2, Mail } from "lucide-react";
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
            className="border border-border bg-surface"
          >
            <FolderGit2 size={16} /> {dict.hero.github}
          </MagneticButton>
          <MagneticButton
            href={siteConfig.linkedin}
            className="border border-border bg-surface"
          >
            <LinkedinIcon size={16} /> {dict.hero.linkedin}
          </MagneticButton>
          <MagneticButton
            href={locale === "es" ? "/resume-es.pdf" : "/resume-en.pdf"}
            download={locale === "es" ? "Kelvis-Guerrero-CV.pdf" : "Kelvis-Guerrero-Resume.pdf"}
            className="border border-border bg-surface"
          >
            <Download size={16} /> {dict.contact.downloadResume}
          </MagneticButton>
        </motion.div>
      </div>
    </Section>
  );
}
