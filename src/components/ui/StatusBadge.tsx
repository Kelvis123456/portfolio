import type { ProjectStatus } from "@/content/projects";
import { cn } from "@/lib/cn";

const STATUS_CONFIG: Record<ProjectStatus, { label: string; dot: string; text: string }> = {
  live: { label: "Live", dot: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" },
  "in-development": { label: "In Development", dot: "bg-amber-500", text: "text-amber-600 dark:text-amber-400" },
  concept: { label: "Concept", dot: "bg-violet-500", text: "text-violet-600 dark:text-violet-400" },
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium", config.text)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
}
