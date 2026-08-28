"use client";

import { motion } from "motion/react";
import { Download } from "lucide-react";
import { GithubIcon } from "@/components/ui/GithubIcon";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/content/siteConfig";
import { dictionary } from "@/content/dictionary";
import { useLanguage } from "@/lib/language-context";
import { fadeUp } from "@/lib/motion-variants";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { LinkedinIcon } from "@/components/ui/LinkedinIcon";
import { CopyableEmailButton } from "@/components/ui/CopyableEmailButton";

export function Contact() {
  const { locale } = useLanguage();
  const dict = dictionary[locale];

  return (
    <Section id="contact" className="sm:py-24">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <SectionHeading index="04" className="justify-center">
          {dict.contact.heading}
        </SectionHeading>
        <motion.p variants={fadeUp} className="mt-4 text-foreground/70">
          {dict.contact.body}
        </motion.p>
        <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <CopyableEmailButton
            label={siteConfig.email}
            className="min-w-[270px] justify-center bg-foreground text-background hover:bg-foreground/88"
          />
          <MagneticButton
            href={siteConfig.github}
            target="_blank"
            rel="noreferrer"
            className="border border-border bg-surface hover:border-accent-text/30 hover:bg-surface-muted"
          >
            <GithubIcon size={16} /> {dict.hero.github}
          </MagneticButton>
          <MagneticButton
            href={siteConfig.linkedin}
            target="_blank"
            rel="noreferrer"
            className="border border-border bg-surface hover:border-accent-text/30 hover:bg-surface-muted"
          >
            <LinkedinIcon size={16} /> {dict.hero.linkedin}
          </MagneticButton>
        </motion.div>
        <motion.a
          variants={fadeUp}
          href={locale === "es" ? "/resume-es.pdf" : "/resume-en.pdf"}
          download={locale === "es" ? "Kelvis-Guerrero-CV.pdf" : "Kelvis-Guerrero-Resume.pdf"}
          data-cursor-label={dict.cursor.download}
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-foreground/70 hover:text-foreground hover:underline transition-colors"
        >
          <Download size={14} /> {dict.contact.downloadResume}
        </motion.a>
      </div>
    </Section>
  );
}
