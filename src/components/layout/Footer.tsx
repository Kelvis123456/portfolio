import { siteConfig } from "@/content/siteConfig";

export function Footer() {
  return (
    <footer className="w-full border-t border-black/5 dark:border-white/5 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-6 text-center text-sm text-foreground/60 sm:flex-row sm:justify-between sm:text-left">
        <p>
          © {new Date().getFullYear()} {siteConfig.name}
        </p>
        <div className="flex items-center gap-4">
          <a href={siteConfig.github} target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">
            GitHub
          </a>
          <a href={`mailto:${siteConfig.email}`} className="hover:text-foreground transition-colors">
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
