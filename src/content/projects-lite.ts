import { projects, type Project } from "@/content/projects";

// What the home page's client components actually render. The full Project
// (case-study text, galleries, process) stays on the server, so it doesn't ship
// in the home bundle. Only import this file from server components.
export type ProjectLite = Pick<
  Project,
  | "slug"
  | "title"
  | "tagline"
  | "kind"
  | "category"
  | "status"
  | "visibility"
  | "featured"
  | "market"
  | "started"
  | "stack"
  | "links"
  | "problem"
  | "metrics"
  | "gallery"
  | "galleryAlt"
  | "coverFit"
>;

function toLite(p: Project): ProjectLite {
  return {
    slug: p.slug,
    title: p.title,
    tagline: p.tagline,
    kind: p.kind,
    category: p.category,
    status: p.status,
    visibility: p.visibility,
    featured: p.featured,
    market: p.market,
    started: p.started,
    stack: p.stack,
    // ProjectMeta only checks whether a GitHub link exists
    links: p.links.filter((l) => l.icon === "github").slice(0, 1),
    problem: p.problem,
    metrics: p.metrics?.slice(0, 1),
    // covers only read the first image and its alt text
    gallery: p.gallery?.slice(0, 1),
    galleryAlt: p.galleryAlt && { en: p.galleryAlt.en.slice(0, 1), es: p.galleryAlt.es.slice(0, 1) },
    coverFit: p.coverFit,
  };
}

export const homeProjects: ProjectLite[] = projects.map(toLite);

export const homeMetrics = [
  {
    label: { en: "Case studies", es: "Casos de estudio" },
    value: projects.length,
    suffix: "",
  },
  {
    label: { en: "Live or playable now", es: "En vivo o jugables" },
    value: projects.filter((p) => p.status === "live").length,
    suffix: "",
  },
  {
    label: { en: "Automated tests in RentEdge", es: "Tests automatizados en RentEdge" },
    value: 1900,
    suffix: "+",
  },
];
