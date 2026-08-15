"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
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
  onClick?: (e: React.MouseEvent) => void;
  download?: boolean | string;
}) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const shouldReduceMotion = useReducedMotion();

  function handleMouseMove(e: React.MouseEvent) {
    if (shouldReduceMotion) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    const clamp = (v: number) => Math.max(-10, Math.min(10, v));
    setOffset({ x: clamp(relX * 0.15), y: clamp(relY * 0.15) });
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
      transition={{ type: "spring", stiffness: 200, damping: 20, mass: 0.4 }}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors",
        className
      )}
    >
      {children}
    </Component>
  );
}
