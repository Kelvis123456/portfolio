"use client";

import type { ProjectLite } from "@/content/projects-lite";
import { dictionary } from "@/content/dictionary";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/cn";

// Spelled out instead of toLocaleDateString: Node's ICU and the browser's
// disagree on es-DO abbreviations ("ago" vs "ago."), a hydration mismatch.
const MONTHS = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  es: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
};

/** "Solo · Since Jul 2026 · Private repo": who built it, since when, whether the code can be checked. */
export function ProjectMeta({ project, className }: { project: ProjectLite; className?: string }) {
  const { locale } = useLanguage();
  const d = dictionary[locale].detail;
  const [year, month] = project.started.split("-").map(Number);
  const repo =
    project.visibility === "private"
      ? d.privateRepo
      : project.links.some((l) => l.icon === "github")
        ? d.publicRepo
        : null;
  const parts = [d.solo, `${d.since} ${MONTHS[locale][month - 1]} ${year}`, repo].filter(Boolean);

  return (
    <p className={cn("font-mono text-xs uppercase tracking-wide text-foreground/65", className)}>{parts.join(" · ")}</p>
  );
}
