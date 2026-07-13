"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { Project } from "@/content/projects";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useLanguage, t } from "@/lib/language-context";
import { cn } from "@/lib/cn";

export function ProjectCard({ project, large = false }: { project: Project; large?: boolean }) {
  const { locale } = useLanguage();

  return (
    <Link href={`/projects/${project.slug}`} className="block h-full">
      <motion.article
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        className={cn(
          "flex h-full flex-col justify-between rounded-2xl border p-6 transition-shadow hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/40",
          project.kind === "game-design"
            ? "border-dashed border-black/15 dark:border-white/15"
            : "border-black/10 dark:border-white/10",
          large ? "sm:p-8" : ""
        )}
      >
        <div>
          <div className="flex items-center justify-between gap-3">
            <h3 className={cn("font-semibold tracking-tight", large ? "text-2xl" : "text-lg")}>
              {project.title}
            </h3>
            <StatusBadge status={project.status} />
          </div>
          <p className="mt-2 text-sm text-foreground/70">{t(project.tagline, locale)}</p>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {project.stack.slice(0, large ? 6 : 4).map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-black/5 px-2.5 py-1 text-xs text-foreground/70 dark:bg-white/10"
            >
              {tech}
            </span>
          ))}
        </div>
      </motion.article>
    </Link>
  );
}
