import { ImageResponse } from "next/og";

export const contentType = "image/png";

// 192 for the tab/Android, 512 for the install splash -- the manifest asks for both.
export function generateImageMetadata() {
  return [192, 512].map((px) => ({ id: String(px), size: { width: px, height: px }, contentType }));
}

export default async function Icon({ id }: { id: Promise<string | number> }) {
  const px = Number(await id);
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: px * (40 / 192),
        background: "linear-gradient(135deg, #ff5a1f 0%, #ff7b4d 100%)",
      }}
    >
      <div style={{ fontSize: px / 2, fontWeight: 700, color: "#fff8f2" }}>KG</div>
    </div>,
    { width: px, height: px },
  );
}
