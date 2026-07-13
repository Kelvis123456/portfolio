# Portfolio

Personal portfolio site — interactive case studies of real projects, built with Next.js, TypeScript, Tailwind CSS, and Framer Motion.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Framer Motion (`motion`) for interactions and transitions
- `next-themes` for dark/light mode

## Structure

```
src/
├─ app/                      — routes: home, /projects/[slug]
├─ components/
│  ├─ layout/                — Navbar, Footer
│  ├─ sections/               — Hero, About, Skills, Contact
│  ├─ projects/               — ProjectCard, Projects grid, ProjectDetail
│  └─ ui/                     — Section, StatusBadge, MagneticButton, ThemeToggle
├─ content/                  — typed project/skills/site data (no CMS)
├─ hooks/                    — useMousePosition, useScrollSpy
└─ lib/                      — cn(), shared motion variants
```

Project data lives in `src/content/projects.ts` as typed data, driving both the project grid and the static `/projects/[slug]` detail pages via `generateStaticParams`.

## Running it

```bash
npm install
npm run dev
```

## Building

```bash
npm run build
```
