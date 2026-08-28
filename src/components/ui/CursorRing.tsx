"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

const HOVER_SELECTOR = "a, button, [role='button'], input, textarea, select";

export function CursorRing() {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [finePointer, setFinePointer] = useState(false);

  useEffect(() => {
    setFinePointer(window.matchMedia("(pointer: fine)").matches);
  }, []);

  useEffect(() => {
    if (shouldReduceMotion || !finePointer) return;
    const el = ref.current;
    if (!el) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let x = targetX;
    let y = targetY;
    let scale = 1;
    let targetScale = 1;
    let frameId = 0;

    function handleMove(e: MouseEvent) {
      targetX = e.clientX;
      targetY = e.clientY;
      targetScale = (e.target as HTMLElement).closest(HOVER_SELECTOR) ? 1.8 : 1;
    }

    function tick() {
      x += (targetX - x) * 0.18;
      y += (targetY - y) * 0.18;
      scale += (targetScale - scale) * 0.2;
      el!.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale})`;
      frameId = requestAnimationFrame(tick);
    }

    window.addEventListener("mousemove", handleMove);
    frameId = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(frameId);
    };
  }, [shouldReduceMotion, finePointer]);

  if (shouldReduceMotion || !finePointer) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9999] h-3 w-3 rounded-full border border-foreground/40 will-change-transform"
    />
  );
}
