"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export function useScrollSpy(ids: string[], options?: IntersectionObserverInit) {
  const [activeId, setActiveId] = useState<string>(ids[0] ?? "");
  const ratios = useRef(new Map<string, number>());
  // The [locale] layout survives navigation, so without this the observer
  // keeps watching unmounted sections after project page -> home.
  const pathname = usePathname();

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.current.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
        let bestId = "";
        let bestRatio = 0;
        for (const id of ids) {
          const ratio = ratios.current.get(id) ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }
        setActiveId(bestId);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1], ...options }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids, options, pathname]);

  return activeId;
}
