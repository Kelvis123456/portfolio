"use client";

import { motion } from "motion/react";
import { FolderGit2, Mail } from "lucide-react";
import { LinkedinIcon } from "@/components/ui/LinkedinIcon";
import { Section } from "@/components/ui/Section";
import { siteConfig } from "@/content/siteConfig";
import { fadeUp } from "@/lib/motion-variants";
import { MagneticButton } from "@/components/ui/MagneticButton";

export function Contact() {
  return (
    <Section id="contact">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <motion.h2 variants={fadeUp} className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Let&apos;s talk
        </motion.h2>
        <motion.p variants={fadeUp} className="mt-4 text-foreground/70">
          Have a project in mind, or just want to say hi? My inbox is open.
        </motion.p>
        <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <MagneticButton href={`mailto:${siteConfig.email}`} className="bg-foreground text-background">
            <Mail size={16} /> {siteConfig.email}
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
        </motion.div>
      </div>
    </Section>
  );
}
