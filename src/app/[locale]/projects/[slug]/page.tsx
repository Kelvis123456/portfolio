import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { projects } from "@/content/projects";
import { ProjectDetail } from "@/components/projects/ProjectDetail";
import { siteConfig } from "@/content/siteConfig";
import type { Locale } from "@/lib/language-context";

const LOCALES: Locale[] = ["en", "es"];

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => projects.map((project) => ({ locale, slug: project.slug })));
}

// Entre 50 y 155 caracteres: el tagline solo se queda corto (40 en algunos proyectos) y Google rellena lo que falta.
function metaDescription(tagline: string, summary: string): string {
  const full = `${tagline.replace(/\.$/, "")}. ${summary}`;
  if (full.length <= 155) return full;
  const cut = full.slice(0, 155);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[.,;:]+$/, "")}…`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = rawLocale === "es" ? "es" : "en";
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.title} | Kelvis Guerrero`,
    description: metaDescription(project.tagline[locale], project.summary[locale]),
    alternates: {
      canonical: `${siteConfig.url}/${locale}/projects/${slug}`,
      languages: {
        en: `${siteConfig.url}/en/projects/${slug}`,
        es: `${siteConfig.url}/es/projects/${slug}`,
        "x-default": `${siteConfig.url}/en/projects/${slug}`,
      },
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <main className="flex flex-1 flex-col">
      <ProjectDetail project={project} />
    </main>
  );
}
