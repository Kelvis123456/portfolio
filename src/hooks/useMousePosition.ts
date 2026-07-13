"use client";

import { useEffect } from "react";
import { useMotionValue, useSpring } from "motion/react";

export function useMousePosition() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { damping: 30, stiffness: 120 });
  const springY = useSpring(y, { damping: 30, stiffness: 120 });

  useEffect(() => {
    function handleMove(e: MouseEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
    }
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [x, y]);

  return { x: springX, y: springY };
}
