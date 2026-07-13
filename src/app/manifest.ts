import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kelvis Guerrero — Portfolio",
    short_name: "Kelvis Guerrero",
    description: "Building SaaS platforms, mobile apps, and games — end to end.",
    start_url: "/",
    display: "standalone",
    background_color: "#fafafa",
    theme_color: "#6d5bf5",
    icons: [
      { src: "/icon", sizes: "192x192", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
