"use client";

import { motion } from "motion/react";
import { fadeUp } from "@/lib/motion-variants";
import { cn } from "@/lib/cn";

export function SectionHeading({
  index,
  children,
  className,
}: {
  index: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={fadeUp} className={cn("flex items-baseline gap-3", className)}>
      <span className="font-mono text-sm text-accent">{index}</span>
      <h2 className="text-3xl font-display font-semibold tracking-tight sm:text-4xl">{children}</h2>
    </motion.div>
  );
}
