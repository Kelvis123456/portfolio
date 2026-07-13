"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import type { Project } from "@/content/projects";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useLanguage, t } from "@/lib/language-context";
import { cn } from "@/lib/cn";

export function ProjectCard({ project, large = false }: { project: Project; large?: boolean }) {
  const { locale } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const rotateX = useSpring(useMotionValue(0), { stiffness: 300, damping: 22 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 300, damping: 22 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (shouldReduceMotion) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateX.set(py * -6);
    rotateY.set(px * 6);
  }

  function handleMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <Link href={`/projects/${project.slug}`} className="block h-full">
      <motion.article
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={shouldReduceMotion ? undefined : { y: -6 }}
        style={shouldReduceMotion ? undefined : { rotateX, rotateY, transformPerspective: 600 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        className={cn(
          "flex h-full flex-col justify-between rounded-2xl border p-6 transition-shadow hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/40",
          project.kind === "game-design"
            ? "border-dashed border-border"
            : "border-border",
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
              className="rounded-full bg-surface-muted px-2.5 py-1 text-xs text-foreground/70"
            >
              {tech}
            </span>
          ))}
        </div>
      </motion.article>
    </Link>
  );
}
