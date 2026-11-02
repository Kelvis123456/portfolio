"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";
import { useLanguage, t, type LocalizedText } from "@/lib/language-context";

type LogLine = { label: string; detail: LocalizedText };

// Every line is a number already stated in a case study (projects.ts), not a made-up log.
const LOG_LINES: LogLine[] = [
  { label: "rentedge — backend", detail: { en: "1,260 tests (unit + e2e)", es: "1,260 tests (unit + e2e)" } },
  {
    label: "agendabot — sql server",
    detail: { en: "8 parallel bookings, 1 committed", es: "8 reservas en paralelo, 1 confirmada" },
  },
  {
    label: "reservaya — postgres",
    detail: { en: "overlap re-checked under row lock", es: "solapamiento revisado con lock de fila" },
  },
  { label: "reservaya — api", detail: { en: "76 backend tests", es: "76 tests de backend" } },
  { label: "willforge — supabase", detail: { en: "auth + RLS active", es: "auth + RLS activos" } },
];

const TYPE_SPEED_MS = 18;
const LINE_PAUSE_MS = 220;
const SEED_COUNT = 3;

function useIsVisible(ref: React.RefObject<HTMLElement | null>) {
  const [isVisible, setIsVisible] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), {
      threshold: 0.1,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  useEffect(() => {
    function handleVisibilityChange() {
      setIsPageVisible(document.visibilityState === "visible");
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  return isVisible && isPageVisible;
}

export function Terminal({ className }: { className?: string }) {
  const shouldReduceMotion = useReducedMotion();
  const { locale } = useLanguage();
  const [typed, setTyped] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const isVisible = useIsVisible(containerRef);
  const active = isVisible && !shouldReduceMotion;
  const hasSeededRef = useRef(false);

  useEffect(() => {
    if (shouldReduceMotion) {
      setTyped(LOG_LINES.map((l) => `${l.label} — ${t(l.detail, locale)}`));
      return;
    }

    if (!active) return;

    const seedFirstRun = !hasSeededRef.current;
    hasSeededRef.current = true;

    let cancelled = false;
    let lineIdx = seedFirstRun ? SEED_COUNT : 0;
    let charIdx = 0;
    let lines: string[] = seedFirstRun
      ? LOG_LINES.slice(0, SEED_COUNT).map((l) => `${l.label} — ${t(l.detail, locale)}`)
      : [];

    if (seedFirstRun) {
      setTyped(lines);
      setActiveIndex(lineIdx);
    }

    function scheduleNext(fn: () => void, delay: number) {
      timeoutRef.current = setTimeout(() => {
        if (!cancelled) fn();
      }, delay);
    }

    function typeChar() {
      const full = `${LOG_LINES[lineIdx].label} — ${t(LOG_LINES[lineIdx].detail, locale)}`;
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
        // Types the log once and stays: a looping wipe-and-retype kept
        // pulling the eye back to the hero while reading the rest of the page.
        if (lineIdx < LOG_LINES.length) scheduleNext(typeChar, LINE_PAUSE_MS);
      }
    }

    scheduleNext(typeChar, TYPE_SPEED_MS);

    return () => {
      cancelled = true;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [active, shouldReduceMotion, locale]);

  useEffect(() => {
    const el = logRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [typed]);

  return (
    <div
      ref={containerRef}
      className={cn("overflow-hidden rounded-xl border border-border bg-surface font-mono text-[12.5px]", className)}
    >
      <div className="flex items-center gap-1.5 border-b border-border bg-surface-muted px-3 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
        <span className="ml-2.5 tracking-wide text-muted-foreground">kelvis@systems: status</span>
      </div>
      <div
        ref={logRef}
        className="h-[168px] overflow-y-auto overscroll-contain px-3.5 py-4 text-left leading-[1.85] text-foreground/80 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {typed.map((line, i) => (
          <div key={`${i}-${line}`} className="whitespace-pre-wrap break-words">
            <span className="text-accent-2-text">✓</span> {line}
            {!shouldReduceMotion && i === activeIndex && i === typed.length - 1 && (
              <span className="ml-0.5 inline-block h-3 w-1.5 translate-y-0.5 animate-pulse bg-accent" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
