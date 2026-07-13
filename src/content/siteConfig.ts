import type { LocalizedText } from "@/lib/language-context";

export const siteConfig = {
  name: "Kelvis Guerrero",
  role: {
    en: "Software Developer",
    es: "Desarrollador de Software",
  } satisfies LocalizedText,
  tagline: {
    en: "Building SaaS platforms, mobile apps, and games — end to end.",
    es: "Construyendo plataformas SaaS, apps móviles y videojuegos — de principio a fin.",
  } satisfies LocalizedText,
  bio: {
    en: "Software Development student (ITLA), currently in the Full-Stack + AI program at Alterna Academy. Backend internship experience building REST APIs and Worker Services in C#/.NET, plus independent work shipping SaaS platforms, mobile apps, and original game prototypes.",
    es: "Estudiante de Desarrollo de Software (ITLA), actualmente en el programa Full-Stack + IA de Alterna Academy. Experiencia de pasantía en backend construyendo APIs REST y Worker Services en C#/.NET, además de trabajo independiente lanzando plataformas SaaS, apps móviles y prototipos de videojuegos originales.",
  } satisfies LocalizedText,
  email: "kelvisguerrero03@gmail.com",
  github: "https://github.com/Kelvis123456",
  linkedin: "https://www.linkedin.com/in/kelvis-guerrero-45b953418",
  location: {
    en: "Santo Domingo, Dominican Republic",
    es: "Santo Domingo, República Dominicana",
  } satisfies LocalizedText,
  metrics: [
    { label: { en: "Projects shipped", es: "Proyectos lanzados" } satisfies LocalizedText, value: 14 },
    { label: { en: "Lines of code (approx.)", es: "Líneas de código (aprox.)" } satisfies LocalizedText, value: 60000 },
    { label: { en: "Tech stacks", es: "Stacks tecnológicos" } satisfies LocalizedText, value: 8 },
  ],
};

export type SiteConfig = typeof siteConfig;
