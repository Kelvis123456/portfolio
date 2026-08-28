"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const LABEL_SELECTOR = "[data-cursor-label]";

export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [finePointer, setFinePointer] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const activeRef = useRef(false);

  useEffect(() => {
    setFinePointer(window.matchMedia("(pointer: fine)").matches);
  }, []);

  useEffect(() => {
    if (shouldReduceMotion || !finePointer) return;
    const ring = ringRef.current;
    const pill = pillRef.current;
    if (!ring || !pill) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let x = targetX;
    let y = targetY;
    let prevX = x;
    let prevY = y;
    let frameId = 0;

    function handleMove(e: MouseEvent) {
      targetX = e.clientX;
      targetY = e.clientY;
    }

    function handleOver(e: MouseEvent) {
      const el = (e.target as HTMLElement)?.closest<HTMLElement>(LABEL_SELECTOR);
      const next = el?.dataset.cursorLabel ?? null;
      activeRef.current = !!next;
      setLabel(next);
    }

    function tick() {
      // position: lerp toward the pointer
      x += (targetX - x) * 0.18;
      y += (targetY - y) * 0.18;

      // velocity-driven squash/stretch — gives the ring some physical weight at
      // rest instead of a static circle, but stays neutral while morphed into a
      // label pill so the pill itself never distorts
      const dx = x - prevX;
      const dy = y - prevY;
      const speed = Math.min(Math.hypot(dx, dy), 40);
      const angle = speed > 0.4 ? (Math.atan2(dy, dx) * 180) / Math.PI : 0;
      const stretch = activeRef.current ? 0 : Math.min(speed * 0.02, 0.35);

      ring!.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(${angle}deg) scaleX(${1 + stretch}) scaleY(${1 - stretch * 0.5})`;
      pill!.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;

      prevX = x;
      prevY = y;
      frameId = requestAnimationFrame(tick);
    }

    window.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseover", handleOver);
    frameId = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseover", handleOver);
      cancelAnimationFrame(frameId);
    };
  }, [shouldReduceMotion, finePointer]);

  if (shouldReduceMotion || !finePointer) return null;

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        style={{ opacity: label ? 0 : 1, transition: "opacity 0.2s ease" }}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-8 w-8 rounded-full border border-foreground/40 will-change-transform"
      />
      <div ref={pillRef} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[9999] will-change-transform">
        <AnimatePresence>
          {label && (
            <motion.span
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="block whitespace-nowrap rounded-full bg-accent-text px-4 py-1.5 font-display text-sm font-medium tracking-tight text-accent-foreground"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
