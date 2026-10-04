import { cn } from "@/lib/cn";
import { KgMark } from "@/components/ui/KgMark";

export function Monogram({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn("inline-flex shrink-0", className)}>
      <KgMark size={36} />
    </span>
  );
}
