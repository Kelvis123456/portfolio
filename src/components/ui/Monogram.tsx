import { cn } from "@/lib/cn";
import { KgMark } from "@/components/ui/KgMark";

// The tile is the same ink as the dark-mode page, so it needs its own border to read as a shape there.
export function Monogram({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("inline-flex h-9 w-9 shrink-0 overflow-hidden rounded-xl border border-border bg-[#12100d]", className)}
    >
      <KgMark size={34} tile={false} viewBox="36 36 440 440" />
    </span>
  );
}
