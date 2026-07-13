"use client";

import { useRef, useState } from "react";
import { Check, Mail } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { siteConfig } from "@/content/siteConfig";
import { dictionary } from "@/content/dictionary";
import { useLanguage } from "@/lib/language-context";

export function CopyableEmailButton({ label, className }: { label: string; className?: string }) {
  const { locale } = useLanguage();
  const dict = dictionary[locale];
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function handleClick() {
    try {
      await navigator.clipboard.writeText(siteConfig.email);
    } catch {
      return;
    }
    setCopied(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), 1800);
  }

  return (
    <MagneticButton href={`mailto:${siteConfig.email}`} onClick={handleClick} className={className}>
      {copied ? <Check size={16} /> : <Mail size={16} />}
      {copied ? dict.contact.emailCopied : label}
    </MagneticButton>
  );
}
