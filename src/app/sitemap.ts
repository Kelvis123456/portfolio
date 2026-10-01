import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { siteConfig } from "@/content/siteConfig";

const BASE_URL = siteConfig.url;
const LOCALES = ["en", "es"] as const;

// No lastModified: it was new Date() on every build, so every URL claimed to
// change on every deploy and Google learns to ignore the field.
export default function sitemap(): MetadataRoute.Sitemap {
  const homeRoutes: MetadataRoute.Sitemap = LOCALES.map((locale) => ({
    url: `${BASE_URL}/${locale}`,
    changeFrequency: "weekly",
    priority: 1,
  }));

  const projectRoutes: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    projects.map((project) => ({
      url: `${BASE_URL}/${locale}/projects/${project.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  );

  const privacyRoutes: MetadataRoute.Sitemap = LOCALES.map((locale) => ({
    url: `${BASE_URL}/${locale}/privacy`,
    changeFrequency: "yearly",
    priority: 0.2,
  }));

  return [...homeRoutes, ...projectRoutes, ...privacyRoutes];
}
