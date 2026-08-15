"use client";

import { Link } from "next-view-transitions";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { projects, type Project } from "@/content/projects";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ProjectCover } from "@/components/ui/ProjectCover";
import { Lightbox } from "@/components/ui/Lightbox";
import { GithubIcon } from "@/components/ui/GithubIcon";
import { dictionary } from "@/content/dictionary";
import { useLanguage, t, tList, type Locale } from "@/lib/language-context";

function TechnicalCaseStudy({ project, locale }: { project: Project; locale: Locale }) {
  const dict = dictionary[locale];
  return (
    <>
      {project.problem && (
        <section className="mt-10 max-w-[68ch]">
          <h2 className="text-sm font-medium uppercase tracking-widest text-foreground/65">{dict.detail.problem}</h2>
          <p className="mt-3 leading-relaxed text-foreground/80">{t(project.problem, locale)}</p>
        </section>
      )}
      {project.solution && (
        <section className="mt-8 max-w-[68ch]">
          <h2 className="text-sm font-medium uppercase tracking-widest text-foreground/65">{dict.detail.solution}</h2>
          <p className="mt-3 leading-relaxed text-foreground/80">{t(project.solution, locale)}</p>
        </section>
      )}
      {project.architectureHighlights && (
        <section className="mt-8 max-w-[68ch]">
          <h2 className="text-sm font-medium uppercase tracking-widest text-foreground/65">
            {dict.detail.architectureHighlights}
          </h2>
          <ul className="mt-3 space-y-2">
            {tList(project.architectureHighlights, locale).map((item) => (
              <li key={item} className="flex gap-3 leading-relaxed text-foreground/80">
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
    <section className="mt-10 max-w-[68ch]">
      <h2 className="text-sm font-medium uppercase tracking-widest text-foreground/65">{dict.detail.process}</h2>
      <ol className="mt-4 space-y-4 border-l border-border pl-6">
        {steps.map((step, i) => (
          <li key={step} className="relative leading-relaxed text-foreground/80">
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
  const rest = project.gallery?.slice(1) ?? [];
  if (rest.length === 0) return null;
  return (
    <div className="mt-10">
      <Lightbox images={rest} alt={`${project.title} screenshot`} />
    </div>
  );
}

export function ProjectDetail({ project }: { project: Project }) {
  const { locale } = useLanguage();
  const dict = dictionary[locale];

  const index = projects.findIndex((p) => p.slug === project.slug);
  const prev = index > 0 ? projects[index - 1] : projects[projects.length - 1];
  const next = index >= 0 && index < projects.length - 1 ? projects[index + 1] : projects[0];

  return (
    <article className="mx-auto max-w-3xl px-6 py-28">
      <Link
        href="/#projects"
        className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors"
      >
        <ArrowLeft size={14} /> {dict.projects.backToProjects}
      </Link>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{project.title}</h1>
        <StatusBadge status={project.status} />
      </div>
      <p className="mt-3 max-w-[68ch] text-lg leading-relaxed text-foreground/70">{t(project.tagline, locale)}</p>

      <div className="mt-6">
        <ProjectCover
          project={project}
          priority
          fit="contain"
          sizes="(min-width: 768px) 768px, 100vw"
          className="aspect-[16/9] rounded-2xl border border-border"
        />
        {project.placeholderGallery && (
          <p className="mt-3 text-center text-xs text-foreground/65">{dict.detail.screenshotsComingSoon}</p>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <span key={tech} className="rounded-full bg-surface-muted px-3 py-1 text-xs text-foreground/70">
            {tech}
          </span>
        ))}
      </div>

      {project.metrics && (
        <div className="mt-8 grid grid-cols-2 gap-6 border-y border-border py-6 sm:grid-cols-3">
          {project.metrics.map((metric) => (
            <div key={metric.label.en}>
              <div className="text-lg font-semibold">{metric.value}</div>
              <div className="text-xs text-foreground/65">{t(metric.label, locale)}</div>
            </div>
          ))}
        </div>
      )}

      <p className="mt-8 max-w-[68ch] leading-relaxed text-foreground/80">{t(project.summary, locale)}</p>

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
              {link.icon === "github" ? <GithubIcon size={16} /> : <ExternalLink size={16} />}
              {t(link.label, locale)}
            </a>
          ))}
        </div>
      )}

      {projects.length > 1 && (
        <div className="mt-16 grid gap-4 border-t border-border pt-8 sm:grid-cols-2">
          <Link
            href={`/projects/${prev.slug}`}
            className="group rounded-xl border border-border bg-surface p-5 shadow-sm transition-colors hover:bg-surface-muted dark:shadow-none dark:ring-1 dark:ring-white/5"
          >
            <span className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-foreground/65">
              <ArrowLeft size={12} /> {dict.projects.previousProject}
            </span>
            <span className="mt-2 block font-display text-lg font-semibold tracking-tight group-hover:underline">
              {prev.title}
            </span>
          </Link>
          <Link
            href={`/projects/${next.slug}`}
            className="group rounded-xl border border-border bg-surface p-5 text-right shadow-sm transition-colors hover:bg-surface-muted dark:shadow-none dark:ring-1 dark:ring-white/5"
          >
            <span className="flex items-center justify-end gap-1.5 text-xs uppercase tracking-widest text-foreground/65">
              {dict.projects.nextProject} <ArrowRight size={12} />
            </span>
            <span className="mt-2 block font-display text-lg font-semibold tracking-tight group-hover:underline">
              {next.title}
            </span>
          </Link>
        </div>
      )}
    </article>
  );
}
