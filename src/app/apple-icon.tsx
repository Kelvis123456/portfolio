import { ImageResponse } from "next/og";

import { KgMark } from "@/components/ui/KgMark";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#ff5a1f",
      }}
    >
      <KgMark size={130} color="#fff8f2" />
    </div>,
    { ...size },
  );
}
