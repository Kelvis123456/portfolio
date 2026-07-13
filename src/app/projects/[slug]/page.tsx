import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { projects } from "@/content/projects";
import { ProjectDetail } from "@/components/projects/ProjectDetail";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return { title: `${project.title} — Kelvis Guerrero`, description: project.tagline.en };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col">
        <ProjectDetail project={project} />
      </main>
      <Footer />
    </>
  );
}
