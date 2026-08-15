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
    return (
      <div className="sticky top-24 aspect-[16/10] w-full max-w-[560px] self-start rounded-2xl border border-dashed border-border" />
    );
  }

  return (
    <div className="sticky top-24 w-full max-w-[560px] self-start">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border bg-surface-muted">
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

      <div className="mt-4">
        <div className="flex items-center justify-between gap-3">
          <h3
            style={{ viewTransitionName: `project-title-${project.slug}` } as React.CSSProperties}
            className="font-display text-xl font-semibold tracking-tight"
          >
            {project.title}
          </h3>
          <StatusBadge status={project.status} />
        </div>
        <p className="mt-1.5 text-sm text-foreground/70">{t(project.tagline, locale)}</p>
        {project.problem && (
          <p className="mt-1.5 line-clamp-1 text-sm text-foreground/65">{t(project.problem, locale)}</p>
        )}
        {project.metrics?.[0] && (
          <p className="mt-1.5 text-xs font-medium text-accent-text">
            {project.metrics[0].value} · {t(project.metrics[0].label, locale)}
          </p>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          {project.stack.slice(0, 5).map((tech) => (
            <span key={tech} className="rounded-full bg-surface-muted px-2.5 py-1 text-xs text-foreground/70">
              {tech}
            </span>
          ))}
        </div>
        <Link
          href={`/${locale}/projects/${project.slug}`}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent-text hover:underline"
        >
          {dict.projects.viewCaseStudy}
          <ArrowRight size={15} aria-hidden />
        </Link>
      </div>
    </div>
  );
}
