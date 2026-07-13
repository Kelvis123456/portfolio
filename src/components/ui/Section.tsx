"use client";

import { motion, useReducedMotion } from "motion/react";
import { fadeUp } from "@/lib/motion-variants";
import { cn } from "@/lib/cn";

export function Section({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      id={id}
      className={cn("relative w-full py-24 sm:py-32", className)}
      initial={shouldReduceMotion ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeUp}
    >
      {children}
    </motion.section>
  );
}
