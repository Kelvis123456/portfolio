"use client";

import { Link } from "next-view-transitions";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/content/projects";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useLanguage, t } from "@/lib/language-context";
import { cn } from "@/lib/cn";

export function ProjectListRow({
  project,
  index,
  active,
  onActivate,
}: {
  project: Project;
  index: number;
  active: boolean;
  onActivate: () => void;
}) {
  const { locale } = useLanguage();

  return (
    <Link
      href={`/projects/${project.slug}`}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      className={cn(
        "group flex items-start gap-4 rounded-xl border px-5 py-4 transition-colors",
        active ? "border-accent/40 bg-surface" : "border-transparent hover:bg-surface"
      )}
    >
      <span className="mt-0.5 font-mono text-xs text-foreground/40">{String(index + 1).padStart(2, "0")}</span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-display font-semibold tracking-tight">{project.title}</h3>
          <StatusBadge status={project.status} />
        </div>
        <p className="mt-1 text-sm text-foreground/70">{t(project.tagline, locale)}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {project.stack.slice(0, 4).map((tech) => (
            <span key={tech} className="rounded-full bg-surface-muted px-2.5 py-1 text-xs text-foreground/70">
              {tech}
            </span>
          ))}
        </div>
      </div>
      <ArrowUpRight
        aria-hidden
        size={18}
        className={cn(
          "mt-0.5 shrink-0 text-foreground/30 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
          active && "text-accent"
        )}
      />
    </Link>
  );
}
