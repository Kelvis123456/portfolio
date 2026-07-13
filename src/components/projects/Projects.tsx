"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Section } from "@/components/ui/Section";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { projects, otherWork, type ProjectCategory } from "@/content/projects";
import { dictionary } from "@/content/dictionary";
import { useLanguage, t } from "@/lib/language-context";
import { fadeUp } from "@/lib/motion-variants";
import { cn } from "@/lib/cn";

export function Projects() {
  const [filter, setFilter] = useState<ProjectCategory | "all">("all");
  const { locale } = useLanguage();
  const dict = dictionary[locale];

  const FILTERS: { label: string; value: ProjectCategory | "all" }[] = [
    { label: dict.projects.filterAll, value: "all" },
    { label: dict.projects.filterSoftware, value: "software" },
    { label: dict.projects.filterGameDesign, value: "game" },
  ];

  const filtered = useMemo(
    () => projects.filter((p) => filter === "all" || p.category === filter),
    [filter]
  );

  const flagship = filtered.find((p) => p.slug === "rentedge" || p.featured);

  return (
    <Section id="projects">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div variants={fadeUp} className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{dict.projects.heading}</h2>
          <div className="flex gap-1 rounded-full border border-black/10 p-1 dark:border-white/10">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={cn(
                  "relative rounded-full px-3 py-1.5 text-sm transition-colors",
                  filter === f.value ? "text-background" : "text-foreground/70 hover:text-foreground"
                )}
              >
                {filter === f.value && (
                  <motion.span
                    layoutId="filterPill"
                    className="absolute inset-0 rounded-full bg-foreground"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{f.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div className="mt-10 grid gap-5 sm:grid-cols-2">
          <AnimatePresence mode="popLayout" initial={false}>
            {filtered.map((project, index) => (
              <motion.div
                layout
                key={project.slug}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.25, delay: index * 0.04 }}
                className={project === flagship ? "sm:col-span-2" : ""}
              >
                <ProjectCard project={project} large={project === flagship} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-16">
          <h3 className="text-sm font-medium uppercase tracking-widest text-foreground/50">
            {dict.projects.moreProjects}
          </h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {otherWork.map((item) => (
              <a
                key={item.title}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col gap-1 rounded-xl border border-black/10 p-4 text-sm transition-colors hover:border-black/20 dark:border-white/10 dark:hover:border-white/25"
              >
                <span className="font-medium group-hover:underline">{item.title}</span>
                <span className="text-foreground/60">{t(item.description, locale)}</span>
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
