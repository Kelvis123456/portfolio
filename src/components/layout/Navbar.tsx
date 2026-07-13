"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { useLanguage } from "@/lib/language-context";
import { dictionary } from "@/content/dictionary";
import { cn } from "@/lib/cn";

const NAV_IDS = ["about", "projects", "skills", "contact"] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { locale } = useLanguage();
  const t = dictionary[locale];
  const NAV_ITEMS = [
    { id: NAV_IDS[0], label: t.nav.about },
    { id: NAV_IDS[1], label: t.nav.projects },
    { id: NAV_IDS[2], label: t.nav.skills },
    { id: NAV_IDS[3], label: t.nav.contact },
  ];
  const activeId = useScrollSpy(NAV_IDS as unknown as string[]);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 24);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-black/5 dark:border-white/5 bg-background/70 backdrop-blur-md"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <a href="#top" className="text-sm font-semibold tracking-tight">
          Kelvis Guerrero
        </a>
        <ul className="hidden items-center gap-6 sm:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.id} className="relative">
              <a
                href={`#${item.id}`}
                className={cn(
                  "relative text-sm transition-colors",
                  activeId === item.id ? "text-foreground" : "text-foreground/60 hover:text-foreground"
                )}
              >
                {item.label}
                {activeId === item.id && (
                  <motion.span
                    layoutId="navIndicator"
                    className="absolute -bottom-1 left-0 right-0 h-px bg-foreground"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
