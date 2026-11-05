import type { LocalizedText } from "@/lib/language-context";

export interface OtherWork {
  title: string;
  description: LocalizedText;
  stack: string[];
  href: string;
}

export const otherWork: OtherWork[] = [
  {
    title: "task-manager",
    description: {
      en: "Vanilla JS task manager with a clean component architecture and 90 Jest tests.",
      es: "Gestor de tareas en JS vanilla con arquitectura de componentes limpia y 90 tests de Jest.",
    },
    stack: ["JavaScript", "Jest"],
    href: "https://github.com/Kelvis123456/task-manager",
  },
  {
    title: "netflix-dashboard",
    description: {
      en: "Data visualization dashboard for Netflix titles using Python, Plotly and Streamlit.",
      es: "Dashboard de visualización de datos de títulos de Netflix usando Python, Plotly y Streamlit.",
    },
    stack: ["Python", "Streamlit", "Plotly"],
    href: "https://github.com/Kelvis123456/netflix-dashboard",
  },
  {
    title: "personal-landing-page",
    description: {
      en: "An earlier personal portfolio site built with React/Vite with bilingual EN/ES support.",
      es: "Un portafolio personal anterior hecho con React/Vite con soporte bilingüe EN/ES.",
    },
    stack: ["React", "Vite", "i18next"],
    href: "https://github.com/Kelvis123456/personal-landing-page",
  },
  {
    title: "devops-final",
    description: {
      en: "Node.js app containerized with Docker, deployed via a GitHub Actions CI/CD pipeline.",
      es: "App Node.js containerizada con Docker, desplegada vía un pipeline de CI/CD en GitHub Actions.",
    },
    stack: ["Docker", "GitHub Actions", "Node.js"],
    href: "https://github.com/Kelvis123456/devops-final",
  },
  {
    title: "proyecto-gitflow",
    description: {
      en: "A small Node.js app built to practice the Git Flow branching model.",
      es: "Una pequeña app Node.js construida para practicar el modelo de branching Git Flow.",
    },
    stack: ["Node.js", "Git Flow"],
    href: "https://github.com/Kelvis123456/proyecto-gitflow",
  },
  {
    title: "prueba-login-automatizado",
    description: {
      en: "Automated login test suite with Selenium and Pytest, producing HTML reports.",
      es: "Suite de pruebas automatizadas de login con Selenium y Pytest, generando reportes HTML.",
    },
    stack: ["Python", "Selenium", "Pytest"],
    href: "https://github.com/Kelvis123456/prueba-login-automatizado",
  },
];
