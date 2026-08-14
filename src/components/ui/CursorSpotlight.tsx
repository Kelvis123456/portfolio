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

    let frameId = 0;
    let pendingX = 0;
    let pendingY = 0;

    function handleMove(e: MouseEvent) {
      pendingX = e.clientX;
      pendingY = e.clientY;
      if (frameId) return;
      frameId = requestAnimationFrame(() => {
        frameId = 0;
        el!.style.setProperty("--spotlight-x", `${pendingX}px`);
        el!.style.setProperty("--spotlight-y", `${pendingY}px`);
      });
    }

    window.addEventListener("mousemove", handleMove);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [shouldReduceMotion]);

  if (shouldReduceMotion) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0"
      style={{
        background:
          "radial-gradient(600px circle at var(--spotlight-x, 50%) var(--spotlight-y, 15%), rgba(255,138,76,0.12), transparent 70%)",
      }}
    />
  );
}
