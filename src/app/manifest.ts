import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kelvis Guerrero — Portfolio",
    short_name: "Kelvis Guerrero",
    description: "Building SaaS platforms, mobile apps, and games — end to end.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf8f5",
    theme_color: "#ff5a1f",
    icons: [
      { src: "/icon/192", sizes: "192x192", type: "image/png" },
      { src: "/icon/512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
