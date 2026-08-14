"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Link } from "next-view-transitions";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/content/projects";
import { ProjectCover } from "@/components/ui/ProjectCover";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { dictionary } from "@/content/dictionary";
import { useLanguage, t } from "@/lib/language-context";

export function ProjectPreviewPane({ project }: { project: Project | undefined }) {
  const shouldReduceMotion = useReducedMotion();
  const { locale } = useLanguage();
  const dict = dictionary[locale];

  if (!project) {
    return <div className="sticky top-24 aspect-[4/3] w-full max-w-[560px] rounded-2xl border border-dashed border-border" />;
  }

  return (
    <div className="sticky top-24 w-full max-w-[560px]">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-surface-muted">
        <AnimatePresence initial={false}>
          <motion.div
            key={project.slug}
            className="absolute inset-0"
            initial={shouldReduceMotion ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <ProjectCover
              project={project}
              className="h-full w-full"
              sizes="(min-width: 1024px) 560px, 100vw"
              quality={90}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-display text-2xl font-semibold tracking-tight">{project.title}</h3>
          <StatusBadge status={project.status} />
        </div>
        <p className="mt-2 text-sm text-foreground/70">{t(project.tagline, locale)}</p>
        {project.problem && (
          <p className="mt-2 line-clamp-2 text-sm text-foreground/65">{t(project.problem, locale)}</p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <span key={tech} className="rounded-full bg-surface-muted px-2.5 py-1 text-xs text-foreground/70">
              {tech}
            </span>
          ))}
        </div>
        <Link
          href={`/projects/${project.slug}`}
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[#c2410c] hover:underline dark:text-[#ff7b4d]"
        >
          {dict.projects.viewCaseStudy}
          <ArrowRight size={15} aria-hidden />
        </Link>
      </div>
    </div>
  );
}
