import { cn } from "@/lib/cn";

export function Monogram({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface font-display text-sm font-semibold tracking-tight text-accent-text",
        className
      )}
    >
      KG
    </span>
  );
}
