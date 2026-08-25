"use client";

import Image from "next/image";
import { Code2, Gamepad2 } from "lucide-react";
import type { Project } from "@/content/projects";
import { dictionary } from "@/content/dictionary";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/cn";

const GRADIENTS = [
  "from-orange-500/25 via-amber-500/10 to-transparent",
  "from-emerald-500/25 via-teal-500/10 to-transparent",
  "from-amber-600/25 via-yellow-500/10 to-transparent",
  "from-red-500/20 via-orange-500/10 to-transparent",
  "from-teal-500/20 via-emerald-500/10 to-transparent",
];

function gradientForSlug(slug: string) {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) | 0;
  }
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}

export function ProjectCover({
  project,
  priority = false,
  sizes,
  quality,
  fit = "cover",
  className,
}: {
  project: Project;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  fit?: "cover" | "contain";
  className?: string;
}) {
  const { locale } = useLanguage();
  const cover = project.gallery?.[0];
  const transitionStyle = { viewTransitionName: `project-cover-${project.slug}` } as React.CSSProperties;

  if (cover) {
    return (
      <div style={transitionStyle} className={cn("relative isolate w-full overflow-hidden bg-surface-muted", className)}>
        <Image
          src={cover}
          alt={`${project.title} ${dictionary[locale].lightbox.screenshot}`}
          fill
          priority={priority}
          sizes={sizes ?? "(min-width: 640px) 50vw, 100vw"}
          quality={quality}
          className={fit === "contain" ? "object-contain" : "object-cover object-top"}
        />
      </div>
    );
  }

  const Icon = project.kind === "game-design" ? Gamepad2 : Code2;

  return (
    <div
      style={transitionStyle}
      className={cn(
        "relative isolate flex w-full items-center justify-center overflow-hidden bg-surface-muted bg-gradient-to-br",
        gradientForSlug(project.slug),
        className
      )}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.15] [background-image:radial-gradient(currentColor_1px,transparent_1px)] [background-size:16px_16px]"
      />
      <Icon aria-hidden size={40} strokeWidth={1.5} className="relative text-foreground/30" />
    </div>
  );
}
