# Portfolio

Personal portfolio site — interactive case studies of real projects, built with Next.js, TypeScript, Tailwind CSS, and Framer Motion.

## Stack

- Next.js 16 (App Router, Turbopack) + TypeScript
- Tailwind CSS v4 (CSS-first `@theme`, no `tailwind.config.*`)
- `motion` (Framer Motion) for interactions, scroll reveals, and view transitions (`next-view-transitions`)
- `next-themes` for dark/light mode
- A hand-rolled i18n dictionary/context (`src/lib/language-context.tsx`) for English/Spanish — no `next-intl`, no URL-based locale routing (yet)
- No CMS — all content is typed data in `src/content/`
- Vercel Analytics + Speed Insights
- No test suite, no linter/formatter config, no CI — this is a solo portfolio, verified via `tsc --noEmit` + `next build` + manual/Playwright smoke passes

## Structure

```
src/
├─ app/                      — routes: home, /projects/[slug]; also generates the
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

Project data lives in `src/content/projects.ts` as typed data, driving both the project grid/hover-preview and the static `/projects/[slug]` detail pages via `generateStaticParams`. On desktop (`lg+`), the projects section shows a list with a sticky preview pane instead of the card grid used everywhere else.

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
