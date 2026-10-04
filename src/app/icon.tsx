import { ImageResponse } from "next/og";

import { KgMark } from "@/components/ui/KgMark";

export const contentType = "image/png";

// 192 for the tab/Android, 512 for the install splash -- the manifest asks for both.
export function generateImageMetadata() {
  return [192, 512].map((px) => ({ id: String(px), size: { width: px, height: px }, contentType }));
}

export default async function Icon({ id }: { id: Promise<string | number> }) {
  const px = Number(await id);
  return new ImageResponse(
    <KgMark size={px} />,
    { width: px, height: px },
  );
}
