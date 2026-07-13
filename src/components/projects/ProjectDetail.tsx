"use client";

import Link from "next/link";
import { ArrowLeft, ExternalLink, FolderGit2 } from "lucide-react";
import type { Project } from "@/content/projects";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Lightbox } from "@/components/ui/Lightbox";
import { dictionary } from "@/content/dictionary";
import { useLanguage, t, tList, type Locale } from "@/lib/language-context";

function TechnicalCaseStudy({ project, locale }: { project: Project; locale: Locale }) {
  const dict = dictionary[locale];
  return (
    <>
      {project.problem && (
        <section className="mt-10">
          <h2 className="text-sm font-medium uppercase tracking-widest text-foreground/50">{dict.detail.problem}</h2>
          <p className="mt-3 text-foreground/80">{t(project.problem, locale)}</p>
        </section>
      )}
      {project.solution && (
        <section className="mt-8">
          <h2 className="text-sm font-medium uppercase tracking-widest text-foreground/50">{dict.detail.solution}</h2>
          <p className="mt-3 text-foreground/80">{t(project.solution, locale)}</p>
        </section>
      )}
      {project.architectureHighlights && (
        <section className="mt-8">
          <h2 className="text-sm font-medium uppercase tracking-widest text-foreground/50">
            {dict.detail.architectureHighlights}
          </h2>
          <ul className="mt-3 space-y-2">
            {tList(project.architectureHighlights, locale).map((item) => (
              <li key={item} className="flex gap-3 text-foreground/80">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/40" />
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

function DesignProcessCaseStudy({ project, locale }: { project: Project; locale: Locale }) {
  const dict = dictionary[locale];
  const steps = project.process ? tList(project.process, locale) : [];
  return (
    <section className="mt-10">
      <h2 className="text-sm font-medium uppercase tracking-widest text-foreground/50">{dict.detail.process}</h2>
      <ol className="mt-4 space-y-4 border-l border-border pl-6">
        {steps.map((step, i) => (
          <li key={step} className="relative text-foreground/80">
            <span className="absolute -left-[27px] flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[10px] font-semibold text-background">
              {i + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>
    </section>
  );
}

function ProjectGallery({ project, locale }: { project: Project; locale: Locale }) {
  const dict = dictionary[locale];
  if (project.gallery && project.gallery.length > 0) {
    return (
      <div className="mt-10">
        <Lightbox images={project.gallery} alt={`${project.title} screenshot`} />
      </div>
    );
  }
  if (project.placeholderGallery) {
    return (
      <div className="mt-10 flex h-56 items-center justify-center rounded-2xl border border-dashed border-border bg-surface-muted/40 text-sm text-foreground/50">
        {dict.detail.screenshotsComingSoon}
      </div>
    );
  }
  return null;
}

export function ProjectDetail({ project }: { project: Project }) {
  const { locale } = useLanguage();
  const dict = dictionary[locale];

  return (
    <article className="mx-auto max-w-3xl px-6 py-28">
      <Link
        href="/#projects"
        className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors"
      >
        <ArrowLeft size={14} /> {dict.projects.backToProjects}
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{project.title}</h1>
        <StatusBadge status={project.status} />
      </div>
      <p className="mt-3 text-lg text-foreground/70">{t(project.tagline, locale)}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <span key={tech} className="rounded-full bg-surface-muted px-3 py-1 text-xs text-foreground/70">
            {tech}
          </span>
        ))}
      </div>

      {project.metrics && (
        <div className="mt-8 flex flex-wrap gap-8 border-y border-border py-6">
          {project.metrics.map((metric) => (
            <div key={metric.label.en}>
              <div className="text-xl font-semibold">{metric.value}</div>
              <div className="text-xs text-foreground/60">{t(metric.label, locale)}</div>
            </div>
          ))}
        </div>
      )}

      <p className="mt-8 text-foreground/80">{t(project.summary, locale)}</p>

      <ProjectGallery project={project} locale={locale} />

      {project.kind === "software" ? (
        <TechnicalCaseStudy project={project} locale={locale} />
      ) : (
        <DesignProcessCaseStudy project={project} locale={locale} />
      )}

      {project.links.length > 0 && (
        <div className="mt-12 flex flex-wrap gap-4">
          {project.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={link.href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              {link.icon === "github" ? <FolderGit2 size={16} /> : <ExternalLink size={16} />}
              {t(link.label, locale)}
            </a>
          ))}
        </div>
      )}
    </article>
  );
}
