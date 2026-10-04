// One drawing of the KG mark so the header, favicon, app icon and OG image can't drift apart.
export function KgMark({ size, color = "currentColor" }: { size: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth={9}>
      <path d="M20 22V78" />
      <path d="M40 22L21 50L40 78" />
      <path d="M86 35A20 28 0 1 0 88 52H70" />
    </svg>
  );
}
