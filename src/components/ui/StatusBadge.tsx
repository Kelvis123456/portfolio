"use client";

import type { ProjectStatus } from "@/content/projects";
import { dictionary } from "@/content/dictionary";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/cn";

const STATUS_STYLE: Record<ProjectStatus, { dot: string; text: string }> = {
  live: { dot: "bg-accent-2", text: "text-accent-2-text" },
  "in-development": { dot: "bg-accent-warn", text: "text-accent-warn" },
  concept: { dot: "border border-muted-foreground/70", text: "text-muted-foreground" },
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
