import Link from "next/link";
import { ArrowLeft, ExternalLink, FolderGit2 } from "lucide-react";
import type { Project } from "@/content/projects";
import { StatusBadge } from "@/components/ui/StatusBadge";

function TechnicalCaseStudy({ project }: { project: Project }) {
  return (
    <>
      {project.problem && (
        <section className="mt-10">
          <h2 className="text-sm font-medium uppercase tracking-widest text-foreground/50">Problem</h2>
          <p className="mt-3 text-foreground/80">{project.problem}</p>
        </section>
      )}
      {project.solution && (
        <section className="mt-8">
          <h2 className="text-sm font-medium uppercase tracking-widest text-foreground/50">Solution</h2>
          <p className="mt-3 text-foreground/80">{project.solution}</p>
        </section>
      )}
      {project.architectureHighlights && (
        <section className="mt-8">
          <h2 className="text-sm font-medium uppercase tracking-widest text-foreground/50">
            Architecture highlights
          </h2>
          <ul className="mt-3 space-y-2">
            {project.architectureHighlights.map((item) => (
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

function DesignProcessCaseStudy({ project }: { project: Project }) {
  return (
    <section className="mt-10">
      <h2 className="text-sm font-medium uppercase tracking-widest text-foreground/50">Process</h2>
      <ol className="mt-4 space-y-4 border-l border-black/10 pl-6 dark:border-white/10">
        {project.process?.map((step, i) => (
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

function ProjectGallery({ project }: { project: Project }) {
  if (project.placeholderGallery) {
    return (
      <div className="mt-10 flex h-56 items-center justify-center rounded-2xl border border-dashed border-black/15 bg-black/[0.02] text-sm text-foreground/50 dark:border-white/15 dark:bg-white/[0.02]">
        Screenshots coming soon
      </div>
    );
  }
  return null;
}

export function ProjectDetail({ project }: { project: Project }) {
  return (
    <article className="mx-auto max-w-3xl px-6 py-28">
      <Link
        href="/#projects"
        className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors"
      >
        <ArrowLeft size={14} /> Back to projects
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{project.title}</h1>
        <StatusBadge status={project.status} />
      </div>
      <p className="mt-3 text-lg text-foreground/70">{project.tagline}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <span key={tech} className="rounded-full bg-black/5 px-3 py-1 text-xs text-foreground/70 dark:bg-white/10">
            {tech}
          </span>
        ))}
      </div>

      {project.metrics && (
        <div className="mt-8 flex flex-wrap gap-8 border-y border-black/10 py-6 dark:border-white/10">
          {project.metrics.map((metric) => (
            <div key={metric.label}>
              <div className="text-xl font-semibold">{metric.value}</div>
              <div className="text-xs text-foreground/60">{metric.label}</div>
            </div>
          ))}
        </div>
      )}

      <p className="mt-8 text-foreground/80">{project.summary}</p>

      <ProjectGallery project={project} />

      {project.kind === "software" ? (
        <TechnicalCaseStudy project={project} />
      ) : (
        <DesignProcessCaseStudy project={project} />
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
              {link.label}
            </a>
          ))}
        </div>
      )}
    </article>
  );
}
