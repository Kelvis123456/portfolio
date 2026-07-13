export interface SkillGroup {
  category: string;
  items: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    category: "Backend",
    items: ["NestJS", "Node.js", "Python", "PostgreSQL", "Redis", "Prisma"],
  },
  {
    category: "Frontend",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
  },
  {
    category: "Mobile",
    items: ["Flutter", "Riverpod", "Supabase"],
  },
  {
    category: "Game Dev",
    items: ["Unity", "C#", "Netcode for GameObjects", "Game Design"],
  },
  {
    category: "DevOps & Tooling",
    items: ["Docker", "GitHub Actions", "CI/CD", "Git Flow"],
  },
];
