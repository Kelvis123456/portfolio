"use client";

import type { RefObject } from "react";
import { cn } from "@/lib/cn";

export type PaletteGroup = "navigation" | "projects" | "actions";

export interface PaletteItem {
  id: string;
  group: PaletteGroup;
  label: string;
  keywords?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  onSelect: () => void;
}

interface CommandPaletteResultsProps {
  groups: { key: PaletteGroup; label: string }[];
  filtered: PaletteItem[];
  activeIndex: number;
  noResultsLabel: string;
  itemRefs: RefObject<Record<string, HTMLButtonElement | null>>;
  onHoverItem: (index: number) => void;
}

export function CommandPaletteResults({
  groups,
  filtered,
  activeIndex,
  noResultsLabel,
  itemRefs,
  onHoverItem,
}: CommandPaletteResultsProps) {
  return (
    <div id="command-palette-listbox" role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
      {filtered.length === 0 && (
        <p className="px-3 py-8 text-center text-sm text-foreground/65">{noResultsLabel}</p>
      )}
      {groups.map((group) => {
        const groupItems = filtered.filter((item) => item.group === group.key);
        if (groupItems.length === 0) return null;
        return (
          <div key={group.key} className="mb-2 last:mb-0">
            <p className="px-3 py-1.5 text-xs font-medium uppercase tracking-widest text-foreground/65">
              {group.label}
            </p>
            {groupItems.map((item) => {
              const index = filtered.indexOf(item);
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  id={`command-palette-option-${item.id}`}
                  ref={(el) => {
                    itemRefs.current[item.id] = el;
                  }}
                  type="button"
                  role="option"
                  aria-selected={index === activeIndex}
                  onMouseEnter={() => onHoverItem(index)}
                  onClick={() => item.onSelect()}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                    index === activeIndex ? "bg-surface-muted text-foreground" : "text-foreground/70"
                  )}
                >
                  <Icon size={16} className="shrink-0 text-foreground/65" />
                  {item.label}
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
