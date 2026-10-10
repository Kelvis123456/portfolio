import { ImageResponse } from "next/og";

import { KgMark } from "@/components/ui/KgMark";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(<KgMark size={size.width} radius={0} />, { ...size });
}
