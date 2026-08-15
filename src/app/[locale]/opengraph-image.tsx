import { ImageResponse } from "next/og";
import { siteConfig } from "@/content/siteConfig";
import type { Locale } from "@/lib/language-context";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "es" }];
}

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale: Locale = rawLocale === "es" ? "es" : "en";

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
          backgroundImage: "radial-gradient(circle at 25% 15%, rgba(255,138,76,0.35), transparent 55%)",
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#ff8a4c",
            marginBottom: 24,
          }}
        >
          {siteConfig.role[locale]}
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
          {siteConfig.tagline[locale]}
        </div>
      </div>
    ),
    { ...size }
  );
}
