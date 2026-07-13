"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Section } from "@/components/ui/Section";
import { siteConfig } from "@/content/siteConfig";
import { staggerContainer, fadeUp } from "@/lib/motion-variants";

function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1200;
    const start = performance.now();
    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [inView, value]);

  return <span ref={ref}>{display.toLocaleString()}</span>;
}

export function About() {
  const initials = siteConfig.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <Section id="about">
      <div className="mx-auto grid max-w-5xl gap-12 px-6 sm:grid-cols-[220px_1fr]">
        <motion.div
          variants={fadeUp}
          className="mx-auto flex h-40 w-40 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-sky-500/20 text-3xl font-semibold sm:mx-0"
          style={{ transformStyle: "preserve-3d" }}
          whileHover={{ rotateX: -6, rotateY: 6, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          {initials}
        </motion.div>

        <div>
          <motion.h2 variants={fadeUp} className="text-2xl font-semibold tracking-tight sm:text-3xl">
            About
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 max-w-xl text-foreground/70">
            {siteConfig.bio} Based in {siteConfig.location}.
          </motion.p>

          <motion.div
            variants={staggerContainer(0.1)}
            className="mt-8 grid grid-cols-3 gap-6 max-w-md"
          >
            {siteConfig.metrics.map((metric) => (
              <motion.div key={metric.label} variants={fadeUp}>
                <div className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  <AnimatedNumber value={metric.value} />
                  {metric.label === "Lines of code (approx.)" && "+"}
                </div>
                <div className="mt-1 text-xs text-foreground/60">{metric.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
