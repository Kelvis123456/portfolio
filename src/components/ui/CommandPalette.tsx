"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useTransitionRouter } from "next-view-transitions";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "next-themes";
import { Search, User, FolderGit2, Code2, Gamepad2, Sparkles, Mail, Sun, Moon, Download } from "lucide-react";
import { LinkedinIcon } from "@/components/ui/LinkedinIcon";
import { GithubIcon } from "@/components/ui/GithubIcon";
import { projects } from "@/content/projects";
import { siteConfig } from "@/content/siteConfig";
import { dictionary } from "@/content/dictionary";
import { useLanguage, t } from "@/lib/language-context";
import { useCommandPalette } from "@/lib/command-palette-context";
import { cn } from "@/lib/cn";

const SECTION_IDS = ["about", "projects", "skills", "contact"] as const;
const SECTION_ICONS: Record<(typeof SECTION_IDS)[number], React.ComponentType<{ size?: number; className?: string }>> = {
  about: User,
  projects: FolderGit2,
  skills: Sparkles,
  contact: Mail,
};

type PaletteGroup = "navigation" | "projects" | "actions";

interface PaletteItem {
  id: string;
  group: PaletteGroup;
  label: string;
  keywords?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  onSelect: () => void;
}

export function CommandPalette() {
  const { open, setOpen } = useCommandPalette();
  const { locale } = useLanguage();
  const dict = dictionary[locale];
  const { resolvedTheme, setTheme } = useTheme();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const router = useTransitionRouter();

  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function close() {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  }

  function goToSection(id: string) {
    if (isHome) {
      close();
      window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    } else {
      close();
      router.push(`/#${id}`);
    }
  }

  const isDark = resolvedTheme === "dark";

  const items: PaletteItem[] = [
    ...SECTION_IDS.map((id) => ({
      id: `nav-${id}`,
      group: "navigation" as const,
      label: dict.nav[id],
      icon: SECTION_ICONS[id],
      onSelect: () => goToSection(id),
    })),
    ...projects.map((project) => ({
      id: `project-${project.slug}`,
      group: "projects" as const,
      label: project.title,
      keywords: `${t(project.tagline, locale)} ${project.stack.join(" ")}`,
      icon: project.kind === "game-design" ? Gamepad2 : Code2,
      onSelect: () => {
        close();
        router.push(`/projects/${project.slug}`);
      },
    })),
    {
      id: "action-theme",
      group: "actions",
      label: isDark ? dict.commandPalette.switchToLight : dict.commandPalette.switchToDark,
      icon: isDark ? Sun : Moon,
      onSelect: () => {
        setTheme(isDark ? "light" : "dark");
        close();
      },
    },
    {
      id: "action-copy-email",
      group: "actions",
      label: copied ? dict.commandPalette.emailCopied : dict.commandPalette.copyEmail,
      keywords: siteConfig.email,
      icon: Mail,
      onSelect: () => {
        navigator.clipboard
          .writeText(siteConfig.email)
          .then(() => {
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1800);
          })
          .catch(() => {});
      },
    },
    {
      id: "action-github",
      group: "actions",
      label: dict.commandPalette.viewGithub,
      icon: GithubIcon,
      onSelect: () => {
        close();
        window.open(siteConfig.github, "_blank", "noopener,noreferrer");
      },
    },
    {
      id: "action-linkedin",
      group: "actions",
      label: dict.commandPalette.viewLinkedin,
      icon: LinkedinIcon,
      onSelect: () => {
        close();
        window.open(siteConfig.linkedin, "_blank", "noopener,noreferrer");
      },
    },
    {
      id: "action-resume",
      group: "actions",
      label: dict.contact.downloadResume,
      icon: Download,
      onSelect: () => {
        close();
        const href = locale === "es" ? "/resume-es.pdf" : "/resume-en.pdf";
        const filename = locale === "es" ? "Kelvis-Guerrero-CV.pdf" : "Kelvis-Guerrero-Resume.pdf";
        const link = document.createElement("a");
        link.href = href;
        link.download = filename;
        link.click();
      },
    },
  ];

  const q = query.trim().toLowerCase();
  const filtered = q
    ? items.filter((item) => `${item.label} ${item.keywords ?? ""}`.toLowerCase().includes(q))
    : items;

  const groups: { key: PaletteGroup; label: string }[] = [
    { key: "navigation", label: dict.commandPalette.groupNavigation },
    { key: "projects", label: dict.commandPalette.groupProjects },
    { key: "actions", label: dict.commandPalette.groupActions },
  ];

  useEffect(() => {
    setActiveIndex(0);
  }, [query, open]);

  useEffect(() => {
    if (open) {
      const id = window.setTimeout(() => inputRef.current?.focus(), 10);
      document.body.style.overflow = "hidden";
      return () => {
        window.clearTimeout(id);
        document.body.style.overflow = "";
      };
    }
    document.body.style.overflow = "";
  }, [open]);

  useEffect(() => {
    function handleGlobalKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!open);
      }
    }
    window.addEventListener("keydown", handleGlobalKey);
    return () => window.removeEventListener("keydown", handleGlobalKey);
  }, [open, setOpen]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      close();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      filtered[activeIndex]?.onSelect();
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[200] flex items-start justify-center bg-black/50 px-4 pt-[12vh] backdrop-blur-sm"
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl shadow-black/20 dark:shadow-black/50"
          >
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
              <Search size={16} className="shrink-0 text-foreground/40" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={dict.commandPalette.placeholder}
                className="w-full bg-transparent text-sm outline-none placeholder:text-foreground/40"
              />
              <kbd className="hidden shrink-0 rounded border border-border px-1.5 py-0.5 text-[10px] text-foreground/40 sm:block">
                esc
              </kbd>
            </div>

            <div className="max-h-[50vh] overflow-y-auto p-2">
              {filtered.length === 0 && (
                <p className="px-3 py-8 text-center text-sm text-foreground/50">{dict.commandPalette.noResults}</p>
              )}
              {groups.map((group) => {
                const groupItems = filtered.filter((item) => item.group === group.key);
                if (groupItems.length === 0) return null;
                return (
                  <div key={group.key} className="mb-2 last:mb-0">
                    <p className="px-3 py-1.5 text-xs font-medium uppercase tracking-widest text-foreground/40">
                      {group.label}
                    </p>
                    {groupItems.map((item) => {
                      const index = filtered.indexOf(item);
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onMouseEnter={() => setActiveIndex(index)}
                          onClick={() => item.onSelect()}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                            index === activeIndex ? "bg-surface-muted text-foreground" : "text-foreground/70"
                          )}
                        >
                          <Icon size={16} className="shrink-0 text-foreground/50" />
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            <div className="hidden items-center gap-4 border-t border-border px-4 py-2.5 text-xs text-foreground/40 sm:flex">
              <span className="flex items-center gap-1.5">
                <kbd className="rounded border border-border px-1.5 py-0.5">↑</kbd>
                <kbd className="rounded border border-border px-1.5 py-0.5">↓</kbd>
                {dict.commandPalette.hintNavigate}
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="rounded border border-border px-1.5 py-0.5">↵</kbd>
                {dict.commandPalette.hintSelect}
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="rounded border border-border px-1.5 py-0.5">esc</kbd>
                {dict.commandPalette.hintClose}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
