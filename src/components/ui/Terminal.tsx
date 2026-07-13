"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";

type LogLine = { label: string; detail: string };

const LOG_LINES: LogLine[] = [
  { label: "rentedge — pricing-engine", detail: "reglas cargadas" },
  { label: "connect5 — relay", detail: "conexión multijugador estable" },
  { label: "monarch — supabase", detail: "auth + RLS activos" },
  { label: "build — next.js", detail: "0 errores, 0 warnings" },
];

const TYPE_SPEED_MS = 18;
const LINE_PAUSE_MS = 220;
const LOOP_PAUSE_MS = 2600;

export function Terminal({ className }: { className?: string }) {
  const shouldReduceMotion = useReducedMotion();
  const [typed, setTyped] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (shouldReduceMotion) {
      setTyped(LOG_LINES.map((l) => `${l.label} — ${l.detail}`));
      return;
    }

    let cancelled = false;
    let lineIdx = 0;
    let charIdx = 0;
    let lines: string[] = [];

    function scheduleNext(fn: () => void, delay: number) {
      timeoutRef.current = setTimeout(() => {
        if (!cancelled) fn();
      }, delay);
    }

    function typeChar() {
      const full = `${LOG_LINES[lineIdx].label} — ${LOG_LINES[lineIdx].detail}`;
      charIdx++;
      const draft = [...lines, full.slice(0, charIdx)];
      setTyped(draft);
      setActiveIndex(lineIdx);
      if (charIdx < full.length) {
        scheduleNext(typeChar, TYPE_SPEED_MS);
      } else {
        lines = [...lines, full];
        lineIdx++;
        charIdx = 0;
        if (lineIdx < LOG_LINES.length) {
          scheduleNext(typeChar, LINE_PAUSE_MS);
        } else {
          scheduleNext(() => {
            lines = [];
            lineIdx = 0;
            charIdx = 0;
            setTyped([]);
            scheduleNext(typeChar, TYPE_SPEED_MS);
          }, LOOP_PAUSE_MS);
        }
      }
    }

    scheduleNext(typeChar, TYPE_SPEED_MS);

    return () => {
      cancelled = true;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [shouldReduceMotion]);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-surface font-mono text-[12.5px]",
        className
      )}
    >
      <div className="flex items-center gap-1.5 border-b border-border bg-surface-muted px-3 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
        <span className="ml-2.5 tracking-wide text-muted-foreground">kelvis@systems: status</span>
      </div>
      <div className="min-h-[168px] px-3.5 py-4 leading-[1.85] text-foreground/80">
        {typed.map((line, i) => (
          <div key={i} className="whitespace-pre">
            <span className="text-accent-2">✓</span> {line}
            {!shouldReduceMotion && i === activeIndex && i === typed.length - 1 && (
              <span className="ml-0.5 inline-block h-3 w-1.5 translate-y-0.5 animate-pulse bg-accent" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
