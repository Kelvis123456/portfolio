# Portfolio

This is my personal site — where I put up real, working case studies of the things I've built instead of just listing them on a page. I built it while job hunting, so the priority was showing actual product decisions (why I picked a stack, what tradeoff I made and why) rather than a generic "skills" list.

## Why this stack

- **Next.js 16 (App Router, Turbopack) + TypeScript.** No surprises here — App Router gives me static generation for the project detail pages (`/projects/[slug]` via `generateStaticParams`) without needing a server for content that never changes at runtime.
- **Tailwind v4**, using the new CSS-first `@theme` instead of a `tailwind.config.*` file — simpler for a project this size, no config file to keep in sync with the CSS.
- **No CMS.** Content lives as typed data in `src/content/` (`projects.ts`, the skills list, the EN/ES dictionary). For ~9 projects and two languages, a headless CMS would've been more infrastructure than the problem needed — a typed object is easier to review in a diff and doesn't need a network call to render.
- **A hand-rolled i18n context (`src/lib/language-context.tsx`)** instead of `next-intl`. I went this way because the only thing I actually needed was a dictionary lookup plus `/en`/`/es` URL routing (`src/proxy.ts`) — pulling in a full i18n library felt like solving a problem I didn't have. If this site grew to real plural rules, date/number formatting, or way more locales, I'd swap it for a real library at that point rather than keep hand-rolling.
- **`motion` (Framer Motion)** for the scroll reveals, hover-preview panel, and page transitions (`next-view-transitions`). This is a portfolio — the interaction polish is part of what I'm trying to demonstrate, not decoration for its own sake.
- **Vercel Analytics + Speed Insights**, because I wanted real visitor/performance numbers instead of guessing.

## What's *not* here, on purpose

No test suite, no linter/formatter config, no CI. This is a solo static-ish site with no backend logic to regression-test — for changes here I lean on `tsc --noEmit`, `next build`, and a manual/Playwright smoke pass rather than pretending a test suite would be pulling real weight on a project like this.

## Structure

```
src/
├─ app/                      — routes live under [locale] (/en, /es via src/proxy.ts):
│                              home, /projects/[slug]; also generates the
│                              favicon/apple-icon, OG images, manifest, sitemap, robots.txt
├─ components/
│  ├─ layout/                — Sidebar (desktop nav), Navbar (mobile nav + menu), Footer
│  ├─ sections/              — Hero, About, Skills, Contact
│  ├─ projects/              — ProjectCard/ProjectListRow (mobile vs. desktop), the
│  │                           desktop hover-preview pane, Projects grid, ProjectDetail
│  └─ ui/                    — Section, StatusBadge, MagneticButton, ThemeToggle,
│                              CommandPalette (⌘K), Lightbox, GradientCanvas (WebGL
│                              background), CursorSpotlight, Terminal, Marquee
├─ content/                  — typed project/skills/site data + the EN/ES dictionary
├─ hooks/                    — useScrollSpy
└─ lib/                      — cn(), shared motion variants, language-context, scroll-lock
```

On desktop (`lg+`), the projects section shows a list with a sticky hover-preview pane instead of the card grid used everywhere else — small enough screens don't have the room for a hover state to make sense, so they get the grid instead.

## Running it

```bash
npm install
npm run dev
```

## Building

```bash
npm run build
npm run start   # serve the production build locally
```
