"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { useLanguage } from "@/lib/language-context";
import { dictionary } from "@/content/dictionary";
import { cn } from "@/lib/cn";

const NAV_IDS = ["about", "projects", "skills", "contact"] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { locale } = useLanguage();
  const t = dictionary[locale];
  const pathname = usePathname();
  const isHome = pathname === "/";
  const NAV_ITEMS = [
    { id: NAV_IDS[0], label: t.nav.about },
    { id: NAV_IDS[1], label: t.nav.projects },
    { id: NAV_IDS[2], label: t.nav.skills },
    { id: NAV_IDS[3], label: t.nav.contact },
  ];
  const scrollSpyId = useScrollSpy(NAV_IDS as unknown as string[]);
  const activeId = isHome ? scrollSpyId : null;

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
          ? "border-b border-border/60 bg-background/70 backdrop-blur-md"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        {isHome ? (
          <a href="#top" className="text-sm font-semibold tracking-tight">
            Kelvis Guerrero
          </a>
        ) : (
          <Link href="/" className="text-sm font-semibold tracking-tight">
            Kelvis Guerrero
          </Link>
        )}
        <ul className="hidden items-center gap-6 sm:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.id} className="relative">
              {isHome ? (
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
              ) : (
                <Link href={`/#${item.id}`} className="relative text-sm text-foreground/60 transition-colors hover:text-foreground">
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
          <button
            type="button"
            aria-label={mobileOpen ? t.closeMenu : t.openMenu}
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-surface-muted transition-colors sm:hidden"
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="flex flex-col overflow-hidden border-b border-black/5 bg-background/95 backdrop-blur-md px-6 sm:hidden dark:border-white/5"
          >
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                {isHome ? (
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setMobileOpen(false);
                      window.setTimeout(() => {
                        document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                      }, 280);
                    }}
                    className={cn(
                      "block py-3 text-sm transition-colors",
                      activeId === item.id ? "text-foreground" : "text-foreground/60"
                    )}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    href={`/#${item.id}`}
                    onClick={() => setMobileOpen(false)}
                    className="block py-3 text-sm text-foreground/60 transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  );
}
