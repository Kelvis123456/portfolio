"use client";

import { Link } from "next-view-transitions";
import { motion, useReducedMotion } from "motion/react";
import { Star } from "lucide-react";
import type { Project } from "@/content/projects";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ProjectCover } from "@/components/ui/ProjectCover";
import { dictionary } from "@/content/dictionary";
import { useLanguage, t } from "@/lib/language-context";
import { cn } from "@/lib/cn";

export function ProjectCard({ project, large = false }: { project: Project; large?: boolean }) {
  const { locale } = useLanguage();
  const dict = dictionary[locale];
  const shouldReduceMotion = useReducedMotion();

  return (
    <Link href={`/${locale}/projects/${project.slug}`} data-cursor-label={dict.cursor.view} className="block h-full">
      <motion.article
        whileHover={shouldReduceMotion ? undefined : { y: -6 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        className={cn(
          "flex h-full flex-col overflow-hidden rounded-2xl border bg-surface shadow-sm transition-shadow hover:shadow-xl hover:shadow-black/5 dark:shadow-none dark:ring-1 dark:ring-white/5 dark:hover:shadow-black/40",
          project.kind === "game-design"
            ? "border-dashed border-border"
            : "border-border"
        )}
      >
        <ProjectCover
          project={project}
          fit={project.coverFit}
          className={cn("aspect-[16/10]", large ? "sm:aspect-[21/9]" : "")}
        />

        <div className={cn("flex flex-1 flex-col justify-between p-6", large ? "sm:p-8" : "")}>
          <div>
            <div className="flex items-center justify-between gap-3">
              <h3
                style={{ viewTransitionName: `project-title-${project.slug}` } as React.CSSProperties}
                className={cn("font-display font-semibold tracking-tight", large ? "text-2xl" : "text-lg")}
              >
                {project.title}
              </h3>
              <div className="flex items-center gap-2">
                {project.featured && (
                  <Star aria-label={dict.projects.featured} size={13} className="fill-accent-text text-accent-text" />
                )}
                <StatusBadge status={project.status} />
              </div>
            </div>
            <p className="mt-2 text-sm text-foreground/70">{t(project.tagline, locale)}</p>
            {project.problem && (
              <p className="mt-2 line-clamp-2 text-sm text-foreground/60">{t(project.problem, locale)}</p>
            )}
            {project.metrics?.[0] && (
              <p className="mt-2 text-xs font-medium text-accent-text">
                {project.metrics[0].value} · {t(project.metrics[0].label, locale)}
              </p>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {project.stack.slice(0, large ? 6 : 4).map((tech) => (
              <span
                key={tech}
                className="rounded-full bg-surface-muted px-2.5 py-1 text-xs text-foreground/70"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
