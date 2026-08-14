import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #ff5a1f 0%, #ff7b4d 100%)",
        }}
      >
        <div style={{ fontSize: 90, fontWeight: 700, color: "#fff8f2" }}>KG</div>
      </div>
    ),
    { ...size }
  );
}
