"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { useTheme } from "next-themes";

type Node = { x: number; y: number; vx: number; vy: number };

export function NetworkCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let nodes: Node[] = [];
    const mouse = { x: -9999, y: -9999 };
    let frameId = 0;

    const rgb = isDark ? "124, 138, 255" : "74, 63, 207";
    const dotAlpha = isDark ? 0.85 : 0.75;
    const linkAlphaMultiplier = isDark ? 0.28 : 0.4;
    const dotColor = `rgba(${rgb}, ${dotAlpha})`;
    const lineColor = (alpha: number) => `rgba(${rgb}, ${alpha})`;

    function resize() {
      if (!parent || !canvas) return;
      const rect = parent.getBoundingClientRect();
      width = canvas.width = rect.width * dpr;
      height = canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      const count = Math.min(60, Math.floor((rect.width * rect.height) / 16000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25 * dpr,
        vy: (Math.random() - 0.5) * 0.25 * dpr,
      }));
    }

    function drawStatic() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      const linkDist = 130 * dpr;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < linkDist) {
            ctx.strokeStyle = lineColor((1 - dist / linkDist) * linkAlphaMultiplier);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        ctx.fillStyle = dotColor;
        ctx.beginPath();
        ctx.arc(nodes[i].x, nodes[i].y, 1.6 * dpr, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function frame() {
      if (!ctx) return;
      const linkDist = 130 * dpr;
      ctx.clearRect(0, 0, width, height);
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        const d2 = dx * dx + dy * dy;
        const repelRadius = 160 * dpr;
        if (d2 < repelRadius * repelRadius) {
          const d = Math.sqrt(d2) || 1;
          n.x -= (dx / d) * 0.6 * dpr;
          n.y -= (dy / d) * 0.6 * dpr;
        }
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < linkDist) {
            ctx.strokeStyle = lineColor((1 - dist / linkDist) * linkAlphaMultiplier);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        ctx.fillStyle = dotColor;
        ctx.beginPath();
        ctx.arc(nodes[i].x, nodes[i].y, 1.6 * dpr, 0, Math.PI * 2);
        ctx.fill();
      }
      frameId = requestAnimationFrame(frame);
    }

    function handleMouseMove(e: MouseEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) * dpr;
      mouse.y = (e.clientY - rect.top) * dpr;
    }

    function handleMouseLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    if (shouldReduceMotion) {
      drawStatic();
    } else {
      frameId = requestAnimationFrame(frame);
    }

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [shouldReduceMotion, isDark]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={className ?? "pointer-events-none absolute inset-0 h-full w-full"}
    />
  );
}
