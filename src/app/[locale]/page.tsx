import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/projects/Projects";
import { Skills } from "@/components/sections/Skills";
import { Contact } from "@/components/sections/Contact";
import { homeProjects, homeMetrics } from "@/content/projects-lite";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <About metrics={homeMetrics} />
      <Projects projects={homeProjects} />
      <Skills />
      <Contact />
    </main>
  );
}
