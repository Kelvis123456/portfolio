import { ImageResponse } from "next/og";
import { projects } from "@/content/projects";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  const title = project?.title ?? "Kelvis Guerrero";
  const tagline = project?.tagline.en ?? "Software Developer";
  const isGameDesign = project?.kind === "game-design";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0d0b09",
          backgroundImage: isGameDesign
            ? "radial-gradient(circle at 75% 20%, rgba(111,227,201,0.3), transparent 55%)"
            : "radial-gradient(circle at 25% 15%, rgba(255,138,76,0.35), transparent 55%)",
        }}
      >
        <div
          style={{
            fontSize: 26,
            fontWeight: 600,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: isGameDesign ? "#6fe3b4" : "#ff7b4d",
            marginBottom: 20,
          }}
        >
          {isGameDesign ? "Game Design Case Study" : "Case Study"}
        </div>
        <div
          style={{
            fontSize: 80,
            fontWeight: 700,
            color: "#f1ece3",
            textAlign: "center",
            padding: "0 80px",
            lineHeight: 1.1,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 30,
            color: "#9b9388",
            marginTop: 28,
            textAlign: "center",
            padding: "0 120px",
          }}
        >
          {tagline}
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#9b9388", marginTop: 48 }}>
          Kelvis Guerrero
        </div>
      </div>
    ),
    { ...size }
  );
}
