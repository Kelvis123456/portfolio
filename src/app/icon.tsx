import { ImageResponse } from "next/og";

export const size = { width: 192, height: 192 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 40,
          background: "linear-gradient(135deg, #6d5bf5 0%, #8b7bff 100%)",
        }}
      >
        <div style={{ fontSize: 96, fontWeight: 700, color: "#ffffff" }}>KG</div>
      </div>
    ),
    { ...size }
  );
}
