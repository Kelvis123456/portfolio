import type { LocalizedText, LocalizedList } from "@/lib/language-context";

export type ProjectStatus = "live" | "in-development" | "concept";
export type ProjectKind = "software" | "game-design";
export type ProjectCategory = "software" | "game";

export interface ProjectLink {
  label: LocalizedText;
  href: string;
  icon?: "github" | "external";
}

export interface ProjectMetric {
  label: LocalizedText;
  value: string;
}

export interface Project {
  slug: string;
  title: string;
  tagline: LocalizedText;
  kind: ProjectKind;
  category: ProjectCategory;
  status: ProjectStatus;
  visibility?: "public" | "private";
  featured: boolean;
  stack: string[];
  role: string;
  summary: LocalizedText;
  problem?: LocalizedText;
  solution?: LocalizedText;
  architectureHighlights?: LocalizedList;
  process?: LocalizedList;
  metrics?: ProjectMetric[];
  links: ProjectLink[];
  placeholderGallery?: boolean;
  gallery?: string[];
}

const SOURCE_LABEL: LocalizedText = { en: "Source", es: "Código fuente" };
const PRIVATE_LABEL: LocalizedText = {
  en: "Private repository — available on request",
  es: "Repositorio privado — disponible bajo solicitud",
};

export const projects: Project[] = [
  {
    slug: "rentedge",
    title: "RentEdge",
    tagline: {
      en: "Pricing & revenue management SaaS for rent-a-car companies",
      es: "SaaS de pricing y gestión de ingresos para empresas de rent-a-car",
    },
    kind: "software",
    category: "software",
    status: "in-development",
    visibility: "private",
    featured: true,
    stack: ["NestJS", "Next.js", "PostgreSQL", "TimescaleDB", "Redis", "BullMQ", "Python", "Prisma", "Turborepo"],
    role: "Full-stack architect & developer",
    summary: {
      en: "A multi-tenant SaaS platform that automates pricing, competitive intelligence, and revenue management for rent-a-car companies — the kind of system that usually costs six figures to license from an incumbent vendor.",
      es: "Una plataforma SaaS multi-tenant que automatiza el pricing, la inteligencia competitiva y la gestión de ingresos para empresas de rent-a-car — el tipo de sistema que normalmente cuesta seis cifras licenciar de un proveedor establecido.",
    },
    problem: {
      en: "Rent-a-car companies price vehicles manually or with static spreadsheets, missing real-time competitive shifts and leaving margin on the table. Existing enterprise tools are expensive, closed, and slow to adapt.",
      es: "Las empresas de rent-a-car fijan precios manualmente o con hojas de cálculo estáticas, sin detectar cambios competitivos en tiempo real y dejando margen sobre la mesa. Las herramientas empresariales existentes son costosas, cerradas y lentas para adaptarse.",
    },
    solution: {
      en: "A modular-monolith pricing engine with a deterministic rules DSL, hard safety clamps (price floors/ceilings that can never be crossed), automatic competitor rate intelligence, and alerting — all multi-tenant from day one with real JWT/RBAC isolation.",
      es: "Un motor de pricing tipo monolito modular con un DSL de reglas determinista, topes de seguridad estrictos (mínimos/máximos de precio que nunca se cruzan), inteligencia automática de tarifas de la competencia, y alertas — todo multi-tenant desde el primer día, con aislamiento real vía JWT/RBAC.",
    },
    architectureHighlights: {
      en: [
        "NestJS + Next.js monorepo (Turborepo) with a Python microservice layer for scraping and ML forecasting, isolated by workload profile",
        "Deterministic rules engine with condition/action evaluation and conflict resolution by specificity — auditable by design, ML is a future suggestion layer, not a black box",
        "Multi-tenant JWT/RBAC with tenant isolation enforced in every use case, verified end-to-end (403 on cross-tenant access)",
        "Automated competitive rate intelligence via lightweight adapters that call OTA internal APIs directly instead of browser automation where possible",
        "PostgreSQL + TimescaleDB for pricing/occupancy time series, Redis + BullMQ for repricing events",
        "Price segmentation by length-of-stay and sales channel, no-show/overbooking risk detection, and deterministic template-based \"why this price changed\" narratives generated from stored rule facts — a $0 alternative to a paid AI pricing assistant",
        "Multi-country tax/currency support (USD/DOP/MXN) and a general activity/audit log capturing every mutating request via a single global middleware, not per-endpoint instrumentation",
        "Public OpenAPI/Swagger docs and automated nightly Postgres backups to Cloudflare R2, with the restore cycle itself verified in CI, not just the backup",
        "Money modeled as exact decimal (not float) end-to-end, with row-level locking around every price mutation so two concurrent repricing events can never silently overwrite each other's result",
        "An SSRF guard (with real DNS-rebinding resolution, not string matching) blocks outbound tenant webhooks from ever reaching a cloud metadata endpoint or private network range; JWT sessions carry live revocation so deactivating a user actually invalidates their existing token",
      ],
      es: [
        "Monorepo NestJS + Next.js (Turborepo) con una capa de microservicios en Python para scraping y forecasting con ML, aislada por perfil de carga",
        "Motor de reglas determinista con evaluación de condición/acción y resolución de conflictos por especificidad — auditable por diseño; el ML es una capa de sugerencia futura, no una caja negra",
        "Multi-tenancy con JWT/RBAC y aislamiento de tenant forzado en cada caso de uso, verificado de punta a punta (403 en accesos cruzados entre tenants)",
        "Inteligencia competitiva automatizada vía adaptadores ligeros que llaman directamente a las APIs internas de las OTAs en vez de automatización de navegador, cuando es posible",
        "PostgreSQL + TimescaleDB para series de tiempo de precios/ocupación, Redis + BullMQ para eventos de repricing",
        "Segmentación de precio por duración de estadía y canal de venta, detección de riesgo de no-show/overbooking, y narrativas deterministas basadas en plantillas (\"por qué cambió este precio\") generadas desde los mismos facts de las reglas — una alternativa a $0 frente a un asistente de IA pago",
        "Soporte multi-país de impuestos/moneda (USD/DOP/MXN) y un log de actividad/auditoría general que captura cada request mutante vía un único middleware global, no instrumentación por endpoint",
        "Documentación pública OpenAPI/Swagger y backups automáticos nocturnos de Postgres a Cloudflare R2, con el ciclo de restore verificado en CI, no solo el backup",
        "Dinero modelado como decimal exacto (no float) de punta a punta, con locking a nivel de fila en cada mutación de precio para que dos eventos de repricing concurrentes nunca se pisen en silencio",
        "Un guard anti-SSRF (con resolución real de DNS-rebinding, no comparación de strings) impide que un webhook de tenant llegue jamás a un endpoint de metadata de la nube o a un rango de red privada; las sesiones JWT tienen revocación real, así que desactivar un usuario invalida su token en el acto",
      ],
    },
    metrics: [
      { label: { en: "Backend tests", es: "Tests de backend" }, value: "1,050+ (unit + e2e)" },
      { label: { en: "Services", es: "Servicios" }, value: "API + Web + 2 Python microservices" },
    ],
    links: [{ label: PRIVATE_LABEL, href: "mailto:kelvisguerrero03@gmail.com?subject=RentEdge%20repo%20access", icon: "external" }],
    gallery: ["/images/rentedge/dashboard.png", "/images/rentedge/offices.png", "/images/rentedge/login.png"],
  },
  {
    slug: "monarch",
    title: "MONARCH",
    tagline: {
      en: "An RPG progression system built on top of a real fitness app",
      es: "Un sistema de progresión RPG construido sobre una app de fitness real",
    },
    kind: "software",
    category: "software",
    status: "live",
    visibility: "private",
    featured: true,
    stack: ["Flutter", "Riverpod", "Supabase", "PostgreSQL", "go_router"],
    role: "Solo developer",
    summary: {
      en: "A fitness app that turns real workouts into RPG progression — ranks from E to S, guilds, boss raids, a skill tree, a season pass, and daily quests — all backed by a real Postgres schema, not local mock data.",
      es: "Una app de fitness que convierte entrenamientos reales en progresión RPG — rangos de E a S, guilds, boss raids, árbol de habilidades, season pass y misiones diarias — todo respaldado por un schema real de Postgres, no datos simulados locales.",
    },
    problem: {
      en: "Most gamified fitness apps fake their progression systems with client-side state. I wanted every stat, rank, and reward tied to a real, persisted workout.",
      es: "La mayoría de apps de fitness gamificadas simulan su sistema de progresión con estado del lado del cliente. Quería que cada stat, rango y recompensa estuviera atado a un entrenamiento real y persistido.",
    },
    solution: {
      en: "Every XP gain, stat bonus, and unlock is computed server-side from logged workouts, with Supabase Row Level Security enforcing per-user data isolation.",
      es: "Cada ganancia de XP, bono de stat y desbloqueo se calcula del lado del servidor a partir de entrenamientos registrados, con Row Level Security de Supabase forzando el aislamiento de datos por usuario.",
    },
    architectureHighlights: {
      en: [
        "Guild system with real weekly XP aggregation across members and guild-level challenges",
        "Skill tree and Shadow Army systems gated by real workout/streak/rank thresholds, not flags",
        "Season Pass with tiered rewards, XP tracks, and time-limited boosts applied server-side",
        "Daily Quests generated deterministically per (date, rank) with a configurable rest-day schedule",
      ],
      es: [
        "Sistema de guild con agregación real de XP semanal entre miembros y desafíos a nivel de guild",
        "Árbol de habilidades y Shadow Army controlados por umbrales reales de entrenamiento/racha/rango, no por flags",
        "Season Pass con recompensas por niveles, tracks de XP y boosts por tiempo limitado aplicados del lado del servidor",
        "Misiones diarias generadas de forma determinista por (fecha, rango) con un horario de días de descanso configurable",
      ],
    },
    metrics: [
      { label: { en: "Lines of Dart", es: "Líneas de Dart" }, value: "~19,900" },
      { label: { en: "Screens", es: "Pantallas" }, value: "23" },
    ],
    links: [{ label: PRIVATE_LABEL, href: "mailto:kelvisguerrero03@gmail.com?subject=MONARCH%20repo%20access", icon: "external" }],
    gallery: ["/images/monarch/splash.png", "/images/monarch/onboarding1.png", "/images/monarch/onboarding2.png"],
  },
  {
    slug: "recetas-app",
    title: "recetas-app",
    tagline: {
      en: "A recipe web app with a fast, animated UI",
      es: "Una app web de recetas con una UI rápida y animada",
    },
    kind: "software",
    category: "software",
    status: "live",
    featured: false,
    stack: ["React 19", "Vite", "TypeScript", "Tailwind CSS v4", "Framer Motion"],
    role: "Solo developer",
    summary: {
      en: "A recipe browsing and search app built to explore React 19 and Tailwind v4 together, with Framer Motion powering the transitions.",
      es: "Una app para explorar y buscar recetas, construida para probar React 19 y Tailwind v4 juntos, con Framer Motion en las transiciones.",
    },
    links: [{ label: SOURCE_LABEL, href: "https://github.com/Kelvis123456/recetas-app", icon: "github" }],
    gallery: ["/images/recetas-app/home.png"],
  },
  {
    slug: "connect5",
    title: "Connect5",
    tagline: {
      en: "Connect-Four-style board game with real online multiplayer",
      es: "Juego de mesa estilo Conecta 4 con multijugador online real",
    },
    kind: "software",
    category: "game",
    status: "live",
    featured: true,
    stack: ["Unity 6", "C#", "Netcode for GameObjects", "Unity Relay"],
    role: "Solo developer",
    summary: {
      en: "A five-in-a-row board game with a local AI opponent and real online multiplayer — peer connection handled through Unity Relay so there's no port forwarding, no dedicated server to run.",
      es: "Un juego de mesa de conecta 5 en línea con un oponente de IA local y multijugador online real — la conexión entre pares se maneja vía Unity Relay, así que no hace falta abrir puertos ni correr un servidor dedicado.",
    },
    problem: {
      en: "Most solo Unity board-game projects stop at local hotseat play. I wanted to ship the harder part: a real lobby and netcode-synced match state.",
      es: "La mayoría de proyectos de juegos de mesa en Unity hechos en solitario se quedan en el modo local por turnos. Quería construir la parte más difícil: un lobby real y un estado de partida sincronizado por netcode.",
    },
    solution: {
      en: "A clean separation between board logic, AI, and network layers means the same board/win-detection code runs identically whether the match is local or online.",
      es: "Una separación limpia entre la lógica del tablero, la IA y la capa de red hace que el mismo código de tablero/detección de victoria funcione igual sin importar si la partida es local u online.",
    },
    architectureHighlights: {
      en: [
        "Board/win-detection logic fully decoupled from input and rendering",
        "Netcode for GameObjects + Unity Relay for NAT-free online play",
        "Lobby flow for hosting/joining online matches",
        "Local AI opponent for single-player matches",
      ],
      es: [
        "Lógica de tablero/detección de victoria totalmente desacoplada del input y el renderizado",
        "Netcode for GameObjects + Unity Relay para juego online sin problemas de NAT",
        "Flujo de lobby para crear/unirse a partidas online",
        "Oponente de IA local para partidas de un jugador",
      ],
    },
    metrics: [{ label: { en: "C# scripts", es: "Scripts C#" }, value: "50" }],
    links: [{ label: SOURCE_LABEL, href: "https://github.com/Kelvis123456/connect5", icon: "github" }],
    gallery: ["/images/connect5/lobby.png", "/images/connect5/gameplay.png"],
  },
  {
    slug: "detective-game",
    title: "Detective Game",
    tagline: {
      en: "A narrative detective game with a real case/evidence engine",
      es: "Un juego narrativo de detective con un motor real de casos/evidencia",
    },
    kind: "software",
    category: "game",
    status: "live",
    featured: false,
    stack: ["React 19", "TypeScript", "Vite", "Zustand", "Framer Motion", "Howler", "Vitest"],
    role: "Solo developer",
    summary: {
      en: "Investigate crime scenes, gather evidence, interrogate suspects, and make an accusation across three full cases — driven by dedicated Case, Evidence, and Interrogation engines rather than hardcoded per-scene logic.",
      es: "Investiga escenas del crimen, recolecta evidencia, interroga sospechosos y haz una acusación a lo largo de tres casos completos — impulsado por motores dedicados de Casos, Evidencia e Interrogatorio en vez de lógica fija por escena.",
    },
    architectureHighlights: {
      en: [
        "CaseEngine, EvidenceEngine, and InterrogationEngine decoupled from the 8-scene UI flow (MainMenu → CaseSelection → CaseIntro → CrimeScene → Interrogation → EvidenceBoard → Accusation → Resolution)",
        "3 full cases implemented as data, independent of the engines that run them",
        "Zustand for global game state, Framer Motion for scene transitions, Howler for audio",
      ],
      es: [
        "CaseEngine, EvidenceEngine e InterrogationEngine desacoplados del flujo de UI de 8 escenas (MainMenu → CaseSelection → CaseIntro → CrimeScene → Interrogation → EvidenceBoard → Accusation → Resolution)",
        "3 casos completos implementados como datos, independientes de los motores que los ejecutan",
        "Zustand para el estado global del juego, Framer Motion para las transiciones de escena, Howler para el audio",
      ],
    },
    metrics: [
      { label: { en: "Cases", es: "Casos" }, value: "3" },
      { label: { en: "Test files", es: "Archivos de test" }, value: "7 (Vitest)" },
    ],
    links: [{ label: SOURCE_LABEL, href: "https://github.com/Kelvis123456/detective-game", icon: "github" }],
    gallery: ["/images/detective-game/menu.png", "/images/detective-game/crimescene.png"],
  },
  {
    slug: "phase",
    title: "PHASE",
    tagline: {
      en: "A roguelite built around echoes of your own past actions",
      es: "Un roguelite construido alrededor de ecos de tus propias acciones pasadas",
    },
    kind: "game-design",
    category: "game",
    status: "concept",
    featured: false,
    stack: ["Unity 2022 LTS", "URP", "C#", "FMOD"],
    role: "Game designer / solo studio",
    summary: {
      en: "\"Your past already knows the answer.\" A mobile roguelite where every action creates an echo that replays your movements — combined with bullet-time, you coordinate your present with your own past to solve rooms.",
      es: "\"Tu pasado ya sabe la respuesta.\" Un roguelite móvil donde cada acción crea un eco que repite tus movimientos — combinado con bullet-time, coordinas tu presente con tu propio pasado para resolver las salas.",
    },
    process: {
      en: [
        "Market research across the mobile games market, identifying an underserved niche in physics-driven roguelites",
        "35 concepts generated and narrowed to 5 finalists, then 1 approved design",
        "Full Game Design Document — core loop, progression, economy, accessibility",
        "Art direction — pixel art at 480×270, echo shader system, full style guide",
        "Technical architecture — Service Locator + ScriptableObject events, per-layer time scales for bullet-time",
        "Vertical Slice plan with a real working prototype (14 C# scripts: player controller, echo system, time manager)",
      ],
      es: [
        "Investigación de mercado en el sector de juegos móviles, identificando un nicho desatendido en roguelites basados en física",
        "35 conceptos generados, reducidos a 5 finalistas, y luego 1 diseño aprobado",
        "Game Design Document completo — loop central, progresión, economía, accesibilidad",
        "Dirección de arte — pixel art a 480×270, sistema de shader de ecos, guía de estilo completa",
        "Arquitectura técnica — Service Locator + eventos ScriptableObject, escalas de tiempo por capa para el bullet-time",
        "Plan de Vertical Slice con un prototipo real funcionando (14 scripts C#: controlador del jugador, sistema de ecos, gestor de tiempo)",
      ],
    },
    metrics: [{ label: { en: "Design docs", es: "Documentos de diseño" }, value: "11 files, ~870KB" }],
    links: [{ label: SOURCE_LABEL, href: "https://github.com/Kelvis123456/phase-game-design", icon: "github" }],
    placeholderGallery: true,
  },
  {
    slug: "skim",
    title: "SKIM",
    tagline: {
      en: "Stone-skipping physics, built for mobile",
      es: "Física de rebote de piedras, hecha para móvil",
    },
    kind: "game-design",
    category: "game",
    status: "concept",
    featured: false,
    stack: ["Unity 2022.3 LTS", "URP", "C#"],
    role: "Game designer / solo studio",
    summary: {
      en: "\"One stone. One flick. The whole ocean.\" A physics-driven stone-skipping game aiming for Helix Jump-level polish, with a real Unity prototype already underway — further along than a typical concept doc.",
      es: "\"Una piedra. Un flick. El océano entero.\" Un juego de rebote de piedras basado en física, apuntando a un pulido nivel Helix Jump, con un prototipo real en Unity ya en marcha — más avanzado que un documento de concepto típico.",
    },
    process: {
      en: [
        "Market research and concept generation, merging two finalist ideas into SKIM",
        "Full GDD across 11 phases, art direction per weather tier, tech stack selection",
        "Working Unity project already started: 35 C# scripts across audio, camera, core physics, and economy systems",
      ],
      es: [
        "Investigación de mercado y generación de conceptos, fusionando dos ideas finalistas en SKIM",
        "GDD completo a lo largo de 11 fases, dirección de arte por nivel climático, selección de stack técnico",
        "Proyecto Unity real ya iniciado: 35 scripts C# entre audio, cámara, física central y sistemas de economía",
      ],
    },
    metrics: [
      { label: { en: "Design docs", es: "Documentos de diseño" }, value: "12 files, ~268KB" },
      { label: { en: "Unity scripts", es: "Scripts de Unity" }, value: "35" },
    ],
    links: [{ label: SOURCE_LABEL, href: "https://github.com/Kelvis123456/skim-game-design", icon: "github" }],
    placeholderGallery: true,
  },
  {
    slug: "neon-tether",
    title: "Neon Tether",
    tagline: {
      en: "A rhythm-arcade physics runner about splitting and merging",
      es: "Un physics runner rítmico sobre separarse y unirse",
    },
    kind: "game-design",
    category: "game",
    status: "concept",
    featured: false,
    stack: ["Godot 4 (planned)", "HTML/CSS/JS prototype", "Web Audio API"],
    role: "Game designer / solo studio",
    summary: {
      en: "Two glowing spheres linked by an elastic tether descend an endless vertical pipeline. Hold to split wide, release to snap together — avoid obstacles, graze them for combo, collect Volt Crystals.",
      es: "Dos esferas brillantes unidas por un tether elástico descienden por una tubería vertical infinita. Mantén presionado para separarlas, suelta para juntarlas — esquiva obstáculos, róznalos para hacer combo, y recolecta Volt Crystals.",
    },
    process: {
      en: [
        "Full Game Design Document — core loop, progression via Volt Crystals, ethics-first monetization",
        "Engine evaluation across 6 stacks; selected Godot 4 for production (low input latency, native 2D shaders, ~12MB builds)",
        "Working browser vertical slice validating the split/merge tether feel — synthesized audio (SFX + BGM), localStorage persistence, local leaderboard, consistent colorblind support",
        "Roadmap, risk log, and decision log kept throughout design; Godot production port and QA scoped as next phase",
      ],
      es: [
        "Game Design Document completo — loop central, progresión vía Volt Crystals, monetización ética",
        "Evaluación de 6 motores; se eligió Godot 4 para producción (baja latencia de input, shaders 2D nativos, builds de ~12MB)",
        "Vertical slice jugable en navegador validando la sensación de separar/unir el tether — audio sintetizado (SFX + música), persistencia con localStorage, leaderboard local, soporte colorblind consistente",
        "Roadmap, registro de riesgos y bitácora de decisiones mantenidos durante todo el diseño; el port a Godot y QA quedan planteados como siguiente fase",
      ],
    },
    metrics: [
      { label: { en: "Design docs", es: "Documentos de diseño" }, value: "17 files, ~105KB" },
      { label: { en: "Prototype", es: "Prototipo" }, value: "Playable in-browser, persistent" },
    ],
    links: [{ label: SOURCE_LABEL, href: "https://github.com/Kelvis123456/neon-tether-game-design", icon: "github" }],
    gallery: ["/images/neon-tether/menu.png", "/images/neon-tether/gameplay.png"],
  },
];

export interface OtherWork {
  title: string;
  description: LocalizedText;
  stack: string[];
  href: string;
}

export const otherWork: OtherWork[] = [
  {
    title: "task-manager",
    description: {
      en: "Vanilla JS task manager with a clean component architecture and 90 Jest tests.",
      es: "Gestor de tareas en JS vanilla con arquitectura de componentes limpia y 90 tests de Jest.",
    },
    stack: ["JavaScript", "Jest"],
    href: "https://github.com/Kelvis123456/task-manager",
  },
  {
    title: "netflix-dashboard",
    description: {
      en: "Data visualization dashboard for Netflix titles using Python, Plotly and Streamlit.",
      es: "Dashboard de visualización de datos de títulos de Netflix usando Python, Plotly y Streamlit.",
    },
    stack: ["Python", "Streamlit", "Plotly"],
    href: "https://github.com/Kelvis123456/netflix-dashboard",
  },
  {
    title: "personal-landing-page",
    description: {
      en: "An earlier personal portfolio site — React/Vite with bilingual EN/ES support.",
      es: "Un portafolio personal anterior — React/Vite con soporte bilingüe EN/ES.",
    },
    stack: ["React", "Vite", "i18next"],
    href: "https://github.com/Kelvis123456/personal-landing-page",
  },
  {
    title: "devops-final",
    description: {
      en: "Node.js app containerized with Docker, deployed via a GitHub Actions CI/CD pipeline.",
      es: "App Node.js containerizada con Docker, desplegada vía un pipeline de CI/CD en GitHub Actions.",
    },
    stack: ["Docker", "GitHub Actions", "Node.js"],
    href: "https://github.com/Kelvis123456/devops-final",
  },
  {
    title: "proyecto-gitflow",
    description: {
      en: "A small Node.js app built to practice the Git Flow branching model.",
      es: "Una pequeña app Node.js construida para practicar el modelo de branching Git Flow.",
    },
    stack: ["Node.js", "Git Flow"],
    href: "https://github.com/Kelvis123456/proyecto-gitflow",
  },
  {
    title: "prueba-login-automatizado",
    description: {
      en: "Automated login test suite with Selenium and Pytest, producing HTML reports.",
      es: "Suite de pruebas automatizadas de login con Selenium y Pytest, generando reportes HTML.",
    },
    stack: ["Python", "Selenium", "Pytest"],
    href: "https://github.com/Kelvis123456/prueba-login-automatizado",
  },
];
