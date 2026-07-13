"use client";

import type { ProjectStatus } from "@/content/projects";
import { dictionary } from "@/content/dictionary";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/cn";

const STATUS_STYLE: Record<ProjectStatus, { dot: string; text: string }> = {
  live: { dot: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" },
  "in-development": { dot: "bg-amber-500", text: "text-amber-600 dark:text-amber-400" },
  concept: { dot: "bg-violet-500", text: "text-violet-600 dark:text-violet-400" },
};

const STATUS_KEY: Record<ProjectStatus, "live" | "inDevelopment" | "concept"> = {
  live: "live",
  "in-development": "inDevelopment",
  concept: "concept",
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const { locale } = useLanguage();
  const style = STATUS_STYLE[status];
  const label = dictionary[locale].status[STATUS_KEY[status]];
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium", style.text)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", style.dot)} />
      {label}
    </span>
  );
}
