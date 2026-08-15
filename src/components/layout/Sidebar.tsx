"use client";

import { usePathname } from "next/navigation";
import { Link } from "next-view-transitions";
import { motion } from "motion/react";
import { FolderGit2, Mail, Search } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { LinkedinIcon } from "@/components/ui/LinkedinIcon";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { useLanguage, t } from "@/lib/language-context";
import { useCommandPalette } from "@/lib/command-palette-context";
import { dictionary } from "@/content/dictionary";
import { siteConfig } from "@/content/siteConfig";
import { cn } from "@/lib/cn";

const NAV_IDS = ["about", "projects", "skills", "contact"] as const;

export function Sidebar() {
  const { locale } = useLanguage();
  const dict = dictionary[locale];
  const { setOpen: setPaletteOpen } = useCommandPalette();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const scrollSpyId = useScrollSpy(NAV_IDS as unknown as string[]);
  const activeId = isHome ? scrollSpyId : null;

  const NAV_ITEMS = [
    { id: NAV_IDS[0], label: dict.nav.about },
    { id: NAV_IDS[1], label: dict.nav.projects },
    { id: NAV_IDS[2], label: dict.nav.skills },
    { id: NAV_IDS[3], label: dict.nav.contact },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-80 flex-col justify-between border-r border-border/60 bg-background/50 p-10 backdrop-blur-sm lg:flex">
      <div>
        {isHome ? (
          <a href="#top" className="block">
            <span className="font-display text-2xl font-semibold tracking-tight">{siteConfig.name}</span>
          </a>
        ) : (
          <Link href="/" className="block">
            <span className="font-display text-2xl font-semibold tracking-tight">{siteConfig.name}</span>
          </Link>
        )}
        <span className="mt-2 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] text-accent-text">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
          {t(siteConfig.role, locale)}
        </span>

        <nav className="mt-12 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const active = activeId === item.id;
            const content = (
              <>
                <motion.span
                  animate={{ width: active ? 32 : 16 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="h-px shrink-0 bg-current"
                />
                {item.label}
              </>
            );
            return isHome ? (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group flex items-center gap-3 py-2 text-sm transition-colors",
                  active ? "text-foreground" : "text-foreground/65 hover:text-foreground"
                )}
              >
                {content}
              </a>
            ) : (
              <Link
                key={item.id}
                href={`/#${item.id}`}
                className="group flex items-center gap-3 py-2 text-sm text-foreground/65 transition-colors hover:text-foreground"
              >
                {content}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 text-foreground/65">
          <a href={siteConfig.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-foreground transition-colors">
            <FolderGit2 size={17} />
          </a>
          <a href={siteConfig.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-foreground transition-colors">
            <LinkedinIcon size={17} />
          </a>
          <a href={`mailto:${siteConfig.email}`} aria-label="Email" className="hover:text-foreground transition-colors">
            <Mail size={17} />
          </a>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={dict.commandPalette.open}
            onClick={() => setPaletteOpen(true)}
            className="flex h-9 items-center gap-1.5 rounded-full border border-border bg-surface px-3 text-foreground/60 hover:bg-surface-muted hover:text-foreground transition-colors"
          >
            <Search size={14} />
            <kbd className="text-[10px] font-medium">⌘K</kbd>
          </button>
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
