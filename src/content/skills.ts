import type { LocalizedText } from "@/lib/language-context";

export interface SkillGroup {
  category: LocalizedText;
  items: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    category: { en: "Backend", es: "Backend" },
    items: ["NestJS", "Node.js", "Python", "PostgreSQL", "Redis", "Prisma"],
  },
  {
    category: { en: "Frontend", es: "Frontend" },
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
  },
  {
    category: { en: "Mobile", es: "Móvil" },
    items: ["Flutter", "Riverpod", "Supabase"],
  },
  {
    category: { en: "Game Dev", es: "Desarrollo de juegos" },
    items: ["Unity", "C#", "Netcode for GameObjects", "Game Design"],
  },
  {
    category: { en: "DevOps & Tooling", es: "DevOps y herramientas" },
    items: ["Docker", "GitHub Actions", "CI/CD", "Git Flow"],
  },
];
