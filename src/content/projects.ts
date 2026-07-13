export type ProjectStatus = "live" | "in-development" | "concept";
export type ProjectKind = "software" | "game-design";

export interface ProjectLink {
  label: string;
  href: string;
  icon?: "github" | "external";
}

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  kind: ProjectKind;
  status: ProjectStatus;
  visibility?: "public" | "private";
  featured: boolean;
  stack: string[];
  role: string;
  summary: string;
  problem?: string;
  solution?: string;
  architectureHighlights?: string[];
  process?: string[];
  metrics?: { label: string; value: string }[];
  links: ProjectLink[];
  placeholderGallery?: boolean;
}

export const projects: Project[] = [
  {
    slug: "rentedge",
    title: "RentEdge",
    tagline: "Pricing & revenue management SaaS for rent-a-car companies",
    kind: "software",
    status: "in-development",
    visibility: "private",
    featured: true,
    stack: ["NestJS", "Next.js", "PostgreSQL", "TimescaleDB", "Redis", "Python", "Prisma", "Turborepo"],
    role: "Full-stack architect & developer",
    summary:
      "A multi-tenant SaaS platform that automates pricing, competitive intelligence, and revenue management for rent-a-car companies — the kind of system that usually costs six figures to license from an incumbent vendor.",
    problem:
      "Rent-a-car companies price vehicles manually or with static spreadsheets, missing real-time competitive shifts and leaving margin on the table. Existing enterprise tools are expensive, closed, and slow to adapt.",
    solution:
      "A modular-monolith pricing engine with a deterministic rules DSL, hard safety clamps (price floors/ceilings that can never be crossed), automatic competitor rate intelligence, and alerting — all multi-tenant from day one with real JWT/RBAC isolation.",
    architectureHighlights: [
      "NestJS + Next.js monorepo (Turborepo) with a Python microservice layer for scraping and ML forecasting, isolated by workload profile",
      "Deterministic rules engine with condition/action evaluation and conflict resolution by specificity — auditable by design, ML is a future suggestion layer, not a black box",
      "Multi-tenant JWT/RBAC with tenant isolation enforced in every use case, verified end-to-end (403 on cross-tenant access)",
      "Automated competitive rate intelligence via lightweight adapters that call OTA internal APIs directly instead of browser automation where possible",
      "PostgreSQL + TimescaleDB for pricing/occupancy time series, Redis + BullMQ for repricing events",
    ],
    metrics: [
      { label: "Backend tests", value: "60+ (unit + e2e)" },
      { label: "Services", value: "API + Web + 2 Python microservices" },
    ],
    links: [
      { label: "Private repository — available on request", href: "mailto:kelvisguerrero03@gmail.com?subject=RentEdge%20repo%20access", icon: "external" },
    ],
  },
  {
    slug: "monarch",
    title: "MONARCH",
    tagline: "An RPG progression system built on top of a real fitness app",
    kind: "software",
    status: "live",
    visibility: "private",
    featured: true,
    stack: ["Flutter", "Riverpod", "Supabase", "PostgreSQL", "go_router"],
    role: "Solo developer",
    summary:
      "A fitness app that turns real workouts into RPG progression — ranks from E to S, guilds, boss raids, a skill tree, a season pass, and daily quests — all backed by a real Postgres schema, not local mock data.",
    problem:
      "Most gamified fitness apps fake their progression systems with client-side state. I wanted every stat, rank, and reward tied to a real, persisted workout.",
    solution:
      "Every XP gain, stat bonus, and unlock is computed server-side from logged workouts, with Supabase Row Level Security enforcing per-user data isolation.",
    architectureHighlights: [
      "Guild system with real weekly XP aggregation across members and guild-level challenges",
      "Skill tree and Shadow Army systems gated by real workout/streak/rank thresholds, not flags",
      "Season Pass with tiered rewards, XP tracks, and time-limited boosts applied server-side",
      "Daily Quests generated deterministically per (date, rank) with a configurable rest-day schedule",
    ],
    metrics: [
      { label: "Lines of Dart", value: "~19,900" },
      { label: "Screens", value: "23" },
    ],
    links: [
      { label: "Private repository — available on request", href: "mailto:kelvisguerrero03@gmail.com?subject=MONARCH%20repo%20access", icon: "external" },
    ],
    placeholderGallery: true,
  },
  {
    slug: "recetas-app",
    title: "recetas-app",
    tagline: "A recipe web app with a fast, animated UI",
    kind: "software",
    status: "live",
    featured: false,
    stack: ["React 19", "Vite", "TypeScript", "Tailwind CSS v4", "Framer Motion"],
    role: "Solo developer",
    summary:
      "A recipe browsing and search app built to explore React 19 and Tailwind v4 together, with Framer Motion powering the transitions.",
    links: [{ label: "Source", href: "https://github.com/Kelvis123456/recetas-app", icon: "github" }],
  },
  {
    slug: "connect5",
    title: "Connect5",
    tagline: "Connect-Four-style board game with real online multiplayer",
    kind: "software",
    status: "live",
    featured: true,
    stack: ["Unity 6", "C#", "Netcode for GameObjects", "Unity Relay"],
    role: "Solo developer",
    summary:
      "A five-in-a-row board game with a local AI opponent and real online multiplayer — peer connection handled through Unity Relay so there's no port forwarding, no dedicated server to run.",
    problem:
      "Most solo Unity board-game projects stop at local hotseat play. I wanted to ship the harder part: a real lobby and netcode-synced match state.",
    solution:
      "A clean separation between board logic, AI, and network layers means the same board/win-detection code runs identically whether the match is local or online.",
    architectureHighlights: [
      "Board/win-detection logic fully decoupled from input and rendering",
      "Netcode for GameObjects + Unity Relay for NAT-free online play",
      "Lobby flow for hosting/joining online matches",
      "Local AI opponent for single-player matches",
    ],
    metrics: [{ label: "C# scripts", value: "50" }],
    links: [{ label: "Source", href: "https://github.com/Kelvis123456/connect5", icon: "github" }],
    placeholderGallery: true,
  },
  {
    slug: "detective-game",
    title: "Detective Game",
    tagline: "A narrative detective game with a real case/evidence engine",
    kind: "software",
    status: "live",
    featured: false,
    stack: ["React 19", "TypeScript", "Vite", "Zustand", "Framer Motion", "Howler", "Vitest"],
    role: "Solo developer",
    summary:
      "Investigate crime scenes, gather evidence, interrogate suspects, and make an accusation across three full cases — driven by dedicated Case, Evidence, and Interrogation engines rather than hardcoded per-scene logic.",
    architectureHighlights: [
      "CaseEngine, EvidenceEngine, and InterrogationEngine decoupled from the 8-scene UI flow (MainMenu → CaseSelection → CaseIntro → CrimeScene → Interrogation → EvidenceBoard → Accusation → Resolution)",
      "3 full cases implemented as data, independent of the engines that run them",
      "Zustand for global game state, Framer Motion for scene transitions, Howler for audio",
    ],
    metrics: [{ label: "Cases", value: "3" }, { label: "Test files", value: "7 (Vitest)" }],
    links: [{ label: "Source", href: "https://github.com/Kelvis123456/detective-game", icon: "github" }],
    placeholderGallery: true,
  },
  {
    slug: "phase",
    title: "PHASE",
    tagline: "A roguelite built around echoes of your own past actions",
    kind: "game-design",
    status: "concept",
    featured: false,
    stack: ["Unity 2022 LTS", "URP", "C#", "FMOD"],
    role: "Game designer / solo studio",
    summary:
      "\"Your past already knows the answer.\" A mobile roguelite where every action creates an echo that replays your movements — combined with bullet-time, you coordinate your present with your own past to solve rooms.",
    process: [
      "Market research across the mobile games market, identifying an underserved niche in physics-driven roguelites",
      "35 concepts generated and narrowed to 5 finalists, then 1 approved design",
      "Full Game Design Document — core loop, progression, economy, accessibility",
      "Art direction — pixel art at 480×270, echo shader system, full style guide",
      "Technical architecture — Service Locator + ScriptableObject events, per-layer time scales for bullet-time",
      "Vertical Slice plan with a real working prototype (14 C# scripts: player controller, echo system, time manager)",
    ],
    metrics: [{ label: "Design docs", value: "11 files, ~870KB" }],
    links: [{ label: "Source", href: "https://github.com/Kelvis123456/phase-game-design", icon: "github" }],
    placeholderGallery: true,
  },
  {
    slug: "skim",
    title: "SKIM",
    tagline: "Stone-skipping physics, built for mobile",
    kind: "game-design",
    status: "concept",
    featured: false,
    stack: ["Unity 2022.3 LTS", "URP", "C#"],
    role: "Game designer / solo studio",
    summary:
      "\"One stone. One flick. The whole ocean.\" A physics-driven stone-skipping game aiming for Helix Jump-level polish, with a real Unity prototype already underway — further along than a typical concept doc.",
    process: [
      "Market research and concept generation, merging two finalist ideas into SKIM",
      "Full GDD across 11 phases, art direction per weather tier, tech stack selection",
      "Working Unity project already started: 35 C# scripts across audio, camera, core physics, and economy systems",
    ],
    metrics: [{ label: "Design docs", value: "12 files, ~268KB" }, { label: "Unity scripts", value: "35" }],
    links: [{ label: "Source", href: "https://github.com/Kelvis123456/skim-game-design", icon: "github" }],
    placeholderGallery: true,
  },
  {
    slug: "neon-tether",
    title: "Neon Tether",
    tagline: "A rhythm-arcade physics runner about splitting and merging",
    kind: "game-design",
    status: "concept",
    featured: false,
    stack: ["HTML/CSS/JS prototype", "Mobile (planned)"],
    role: "Game designer / solo studio",
    summary:
      "Two glowing spheres linked by an elastic tether descend an endless vertical pipeline. Hold to split wide, release to snap together — avoid obstacles, graze them for combo, collect Volt Crystals.",
    process: [
      "Full Game Design Document — core loop, progression via Volt Crystals and daily missions, ethics-first monetization",
      "Working browser prototype validating the core split/merge tether mechanic before committing to full production",
      "Roadmap, risk log, and decision log kept throughout design",
    ],
    metrics: [{ label: "Prototype", value: "Playable in-browser" }],
    links: [{ label: "Source", href: "https://github.com/Kelvis123456/neon-tether-game-design", icon: "github" }],
    placeholderGallery: true,
  },
];

export interface OtherWork {
  title: string;
  description: string;
  stack: string[];
  href: string;
}

export const otherWork: OtherWork[] = [
  {
    title: "task-manager",
    description: "Vanilla JS task manager with a clean component architecture and 90 Jest tests.",
    stack: ["JavaScript", "Jest"],
    href: "https://github.com/Kelvis123456/task-manager",
  },
  {
    title: "netflix-dashboard",
    description: "Data visualization dashboard for Netflix titles using Python, Plotly and Streamlit.",
    stack: ["Python", "Streamlit", "Plotly"],
    href: "https://github.com/Kelvis123456/netflix-dashboard",
  },
  {
    title: "personal-landing-page",
    description: "An earlier personal portfolio site — React/Vite with bilingual EN/ES support.",
    stack: ["React", "Vite", "i18next"],
    href: "https://github.com/Kelvis123456/personal-landing-page",
  },
  {
    title: "devops-final",
    description: "Node.js app containerized with Docker, deployed via a GitHub Actions CI/CD pipeline.",
    stack: ["Docker", "GitHub Actions", "Node.js"],
    href: "https://github.com/Kelvis123456/devops-final",
  },
  {
    title: "proyecto-gitflow",
    description: "A small Node.js app built to practice the Git Flow branching model.",
    stack: ["Node.js", "Git Flow"],
    href: "https://github.com/Kelvis123456/proyecto-gitflow",
  },
  {
    title: "prueba-login-automatizado",
    description: "Automated login test suite with Selenium and Pytest, producing HTML reports.",
    stack: ["Python", "Selenium", "Pytest"],
    href: "https://github.com/Kelvis123456/prueba-login-automatizado",
  },
];
