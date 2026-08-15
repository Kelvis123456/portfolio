import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { siteConfig } from "@/content/siteConfig";

const BASE_URL = siteConfig.url;
const LOCALES = ["en", "es"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const homeRoutes: MetadataRoute.Sitemap = LOCALES.map((locale) => ({
    url: `${BASE_URL}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1,
  }));

  const projectRoutes: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    projects.map((project) => ({
      url: `${BASE_URL}/${locale}/projects/${project.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))
  );

  return [...homeRoutes, ...projectRoutes];
}
