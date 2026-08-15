import { skillGroups } from "@/content/skills";

const ITEMS = skillGroups.flatMap((group) => group.items);

export function Marquee() {
  return (
    <div
      aria-hidden
      className="relative w-full overflow-hidden border-y border-border py-6 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
    >
      <div className="group flex w-max animate-marquee gap-8 [animation-play-state:running] hover:[animation-play-state:paused]">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex shrink-0 gap-8">
            {ITEMS.map((item, i) => (
              <span
                key={`${dup}-${item}-${i}`}
                className="flex items-center gap-8 font-mono text-sm uppercase tracking-widest text-foreground/40"
              >
                {item}
                <span className="text-accent">◆</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
