import { ImageResponse } from "next/og";
import { siteConfig } from "@/content/siteConfig";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
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
          backgroundColor: "#0b0c10",
          backgroundImage: "radial-gradient(circle at 25% 15%, rgba(139,123,255,0.35), transparent 55%)",
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#8b7bff",
            marginBottom: 24,
          }}
        >
          {siteConfig.role.en}
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#f2f2f5",
            textAlign: "center",
            padding: "0 80px",
            lineHeight: 1.15,
          }}
        >
          {siteConfig.name}
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#9497a3",
            marginTop: 28,
            textAlign: "center",
            padding: "0 100px",
          }}
        >
          {siteConfig.tagline.en}
        </div>
      </div>
    ),
    { ...size }
  );
}
