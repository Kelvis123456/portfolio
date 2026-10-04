import { cn } from "@/lib/cn";
import { KgMark } from "@/components/ui/KgMark";

export function Monogram({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-accent-text",
        className,
      )}
    >
      <KgMark size={22} />
    </span>
  );
}
