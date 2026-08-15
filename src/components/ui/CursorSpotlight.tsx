"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

export function CursorSpotlight() {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) return;
    const el = ref.current;
    if (!el) return;

    function handleMove(e: MouseEvent) {
      el!.style.setProperty("--spotlight-x", `${e.clientX}px`);
      el!.style.setProperty("--spotlight-y", `${e.clientY}px`);
    }

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [shouldReduceMotion]);

  if (shouldReduceMotion) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0"
      style={{
        background:
          "radial-gradient(600px circle at var(--spotlight-x, 50%) var(--spotlight-y, 15%), rgba(255,138,76,0.07), transparent 70%)",
      }}
    />
  );
}
