"use client";

import { useEffect, useState } from "react";

/** "⌘K" on Apple devices, "Ctrl K" everywhere else. Server renders ⌘K; fixed after mount. */
export function ShortcutKey({ className }: { className?: string }) {
  const [isMac, setIsMac] = useState(true);
  useEffect(() => setIsMac(/Mac|iPhone|iPad/.test(navigator.userAgent)), []);
  return <kbd className={className}>{isMac ? "⌘K" : "Ctrl K"}</kbd>;
}
