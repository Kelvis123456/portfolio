"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Link } from "next-view-transitions";
import { AnimatePresence, motion } from "motion/react";
import { Menu, Search, X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { Monogram } from "@/components/ui/Monogram";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { useLanguage } from "@/lib/language-context";
import { useCommandPalette } from "@/lib/command-palette-context";
import { dictionary } from "@/content/dictionary";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";
import { pushModal, popModal, isTopModal } from "@/lib/modal-stack";
import { cn } from "@/lib/cn";

const NAV_IDS = ["about", "projects", "skills", "contact"] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { locale } = useLanguage();
  const { setOpen: setPaletteOpen } = useCommandPalette();
  const t = dictionary[locale];
  const pathname = usePathname();
  const isHome = pathname === `/${locale}`;
  const NAV_ITEMS = [
    { id: NAV_IDS[0], label: t.nav.about },
    { id: NAV_IDS[1], label: t.nav.projects },
    { id: NAV_IDS[2], label: t.nav.skills },
    { id: NAV_IDS[3], label: t.nav.contact },
  ];
  const scrollSpyId = useScrollSpy(NAV_IDS as unknown as string[]);
  const activeId = isHome ? scrollSpyId : null;

  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 24);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    lockScroll();
    const modalId = pushModal();

    const menu = menuRef.current;
    const focusable = menu?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
    focusable?.[0]?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (!isTopModal(modalId)) return;
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        setMobileOpen(false);
        return;
      }
      if (e.key !== "Tab" || !focusable || focusable.length === 0) return;
      e.stopPropagation();
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      popModal(modalId);
      unlockScroll();
      toggleButtonRef.current?.focus();
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
      <nav className="relative z-50 mx-auto flex items-center justify-between px-6 py-4">
        {isHome ? (
          <a href="#top">
            <Monogram />
            <span className="sr-only">Kelvis Guerrero</span>
          </a>
        ) : (
          <Link href={`/${locale}`}>
            <Monogram />
            <span className="sr-only">Kelvis Guerrero</span>
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
            ref={toggleButtonRef}
            type="button"
            aria-label={mobileOpen ? t.closeMenu : t.openMenu}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
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
            id="mobile-menu"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label={t.commandPalette.groupNavigation}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setMobileOpen(false);
            }}
            className="fixed inset-0 z-40 flex flex-col bg-background"
          >
            <div
              onClick={(e) => {
                if (e.target === e.currentTarget) setMobileOpen(false);
              }}
              className="flex flex-1 flex-col justify-center gap-1 px-8 pb-20"
            >
              {NAV_ITEMS.map((item, i) => {
                const active = activeId === item.id;
                const index = String(i + 1).padStart(2, "0");
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 + i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-baseline gap-3"
                  >
                    <span className="font-mono text-xs tracking-[0.2em] text-accent-text">{index}</span>
                    {isHome ? (
                      <a
                        href={`#${item.id}`}
                        aria-current={active ? "page" : undefined}
                        onClick={(e) => {
                          e.preventDefault();
                          setMobileOpen(false);
                          window.setTimeout(() => {
                            document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                          }, 280);
                        }}
                        className={cn(
                          "block py-2.5 font-display text-4xl tracking-tight transition-colors",
                          active ? "text-foreground" : "text-foreground/65"
                        )}
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        href={`/${locale}#${item.id}`}
                        onClick={() => setMobileOpen(false)}
                        className="block py-2.5 font-display text-4xl tracking-tight text-foreground/70"
                      >
                        {item.label}
                      </Link>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
