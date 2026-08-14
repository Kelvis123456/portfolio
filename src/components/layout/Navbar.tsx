"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Link } from "next-view-transitions";
import { AnimatePresence, motion } from "motion/react";
import { Menu, Search, X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { useLanguage } from "@/lib/language-context";
import { useCommandPalette } from "@/lib/command-palette-context";
import { dictionary } from "@/content/dictionary";
import { cn } from "@/lib/cn";

const NAV_IDS = ["about", "projects", "skills", "contact"] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { locale } = useLanguage();
  const { setOpen: setPaletteOpen } = useCommandPalette();
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

  useEffect(() => {
    if (!mobileOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300 lg:hidden",
        scrolled
          ? "border-b border-border/60 bg-background/70 backdrop-blur-md"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex items-center justify-between px-6 py-4">
        {isHome ? (
          <a href="#top" className="font-display text-lg font-semibold tracking-tight">
            Kelvis Guerrero
          </a>
        ) : (
          <Link href="/" className="font-display text-lg font-semibold tracking-tight">
            Kelvis Guerrero
          </Link>
        )}
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={t.commandPalette.open}
            onClick={() => setPaletteOpen(true)}
            className="flex h-9 items-center gap-1.5 rounded-full border border-border bg-surface px-3 text-foreground/60 hover:bg-surface-muted hover:text-foreground transition-colors"
          >
            <Search size={14} />
            <kbd className="hidden text-[10px] font-medium sm:inline">⌘K</kbd>
          </button>
          <LanguageToggle />
          <ThemeToggle />
          <button
            type="button"
            aria-label={mobileOpen ? t.closeMenu : t.openMenu}
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface hover:bg-surface-muted transition-colors"
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 flex flex-col bg-background"
          >
            <div className="flex flex-1 flex-col justify-center gap-1 px-8 pb-20">
              {NAV_ITEMS.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
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
                        "block py-2.5 font-display text-4xl tracking-tight transition-colors",
                        activeId === item.id ? "text-foreground" : "text-foreground/40"
                      )}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      href={`/#${item.id}`}
                      onClick={() => setMobileOpen(false)}
                      className="block py-2.5 font-display text-4xl tracking-tight text-foreground/70"
                    >
                      {item.label}
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
