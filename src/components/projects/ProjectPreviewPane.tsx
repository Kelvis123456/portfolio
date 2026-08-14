"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Project } from "@/content/projects";
import { ProjectCover } from "@/components/ui/ProjectCover";

export function ProjectPreviewPane({ project }: { project: Project | undefined }) {
  const shouldReduceMotion = useReducedMotion();

  if (!project) {
    return <div className="sticky top-24 aspect-[4/3] w-full max-w-[560px] rounded-2xl border border-dashed border-border" />;
  }

  return (
    <div className="sticky top-24 w-full max-w-[560px]">
      <AnimatePresence mode={shouldReduceMotion ? "sync" : "wait"} initial={false}>
        <motion.div
          key={project.slug}
          initial={shouldReduceMotion ? undefined : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={shouldReduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <ProjectCover
            project={project}
            className="aspect-[4/3] rounded-2xl border border-border"
            sizes="(min-width: 1024px) 560px, 100vw"
            quality={90}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
