"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";

export function MagneticButton({
  children,
  className,
  href,
  onClick,
  download,
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  download?: boolean | string;
}) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  function handleMouseMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    setOffset({ x: relX * 0.3, y: relY * 0.3 });
  }

  function handleMouseLeave() {
    setOffset({ x: 0, y: 0 });
  }

  const Component = href ? motion.a : motion.button;

  return (
    <Component
      ref={ref as never}
      href={href}
      download={download}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: "spring", stiffness: 150, damping: 12, mass: 0.5 }}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors",
        className
      )}
    >
      {children}
    </Component>
  );
}
