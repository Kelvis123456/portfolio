import type { Locale } from "@/lib/language-context";

export const dictionary = {
  en: {
    nav: { about: "About", projects: "Projects", skills: "Skills", contact: "Contact" },
    hero: { viewProjects: "View projects", github: "GitHub", linkedin: "LinkedIn", contact: "Contact" },
    about: { heading: "About", basedIn: "Based in" },
    projects: {
      heading: "Projects",
      filterAll: "All",
      filterSoftware: "Software",
      filterGameDesign: "Game Design",
      moreProjects: "More projects",
      backToProjects: "Back to projects",
    },
    status: { live: "Live", inDevelopment: "In Development", concept: "Concept" },
    detail: {
      problem: "Problem",
      solution: "Solution",
      architectureHighlights: "Architecture highlights",
      process: "Process",
      screenshotsComingSoon: "Screenshots coming soon",
    },
    skills: { heading: "Skills" },
    contact: {
      heading: "Let's talk",
      body: "Have a project in mind, or just want to say hi? My inbox is open.",
    },
    footer: { github: "GitHub", linkedin: "LinkedIn", email: "Email" },
    language: "Language",
    scrollDown: "Scroll down",
    toggleTheme: "Toggle theme",
  },
  es: {
    nav: { about: "Sobre mí", projects: "Proyectos", skills: "Habilidades", contact: "Contacto" },
    hero: { viewProjects: "Ver proyectos", github: "GitHub", linkedin: "LinkedIn", contact: "Contacto" },
    about: { heading: "Sobre mí", basedIn: "Ubicado en" },
    projects: {
      heading: "Proyectos",
      filterAll: "Todos",
      filterSoftware: "Software",
      filterGameDesign: "Diseño de juegos",
      moreProjects: "Más proyectos",
      backToProjects: "Volver a proyectos",
    },
    status: { live: "En vivo", inDevelopment: "En desarrollo", concept: "Concepto" },
    detail: {
      problem: "Problema",
      solution: "Solución",
      architectureHighlights: "Puntos clave de arquitectura",
      process: "Proceso",
      screenshotsComingSoon: "Capturas próximamente",
    },
    skills: { heading: "Habilidades" },
    contact: {
      heading: "Hablemos",
      body: "¿Tienes un proyecto en mente, o solo quieres saludar? Mi bandeja de entrada está abierta.",
    },
    footer: { github: "GitHub", linkedin: "LinkedIn", email: "Correo" },
    language: "Idioma",
    scrollDown: "Bajar",
    toggleTheme: "Cambiar tema",
  },
} satisfies Record<Locale, unknown>;

export function useDictionary(locale: Locale) {
  return dictionary[locale];
}
