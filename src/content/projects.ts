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
  /** "local": built around Dominican rules or data. Listed under its own heading with a one-line why. */
  market?: "local";
  /** First-commit month of the project's repo, "YYYY-MM". Shown as "since". */
  started: string;
  stack: string[];
  role: LocalizedText;
  summary: LocalizedText;
  problem?: LocalizedText;
  solution?: LocalizedText;
  architectureHighlights?: LocalizedList;
  /** Grouped alternative to the flat list: used when a case study has too many points to scan. */
  highlightGroups?: { title: LocalizedText; items: LocalizedList }[];
  /** Plain statement of what does not exist yet (users, demo, outcomes). Never invent results. */
  notDoneYet?: LocalizedText;
  process?: LocalizedList;
  metrics?: ProjectMetric[];
  links: ProjectLink[];
  placeholderGallery?: boolean;
  /** Screen recording without narration; the caption says what the viewer is looking at. */
  video?: { src: string; poster: string; caption: LocalizedText };
  gallery?: string[];
  /** One description per gallery image, same order. Falls back to a generic label when missing. */
  galleryAlt?: LocalizedList;
  /** "contain" for projects whose screenshots are portrait (mobile) — prevents cropping in the 16:10 cover boxes. */
  coverFit?: "cover" | "contain";
  /** Sampled from the project's own screenshots/brand — tints the case study header wash. */
  accentColor?: string;
}

const SOURCE_LABEL: LocalizedText = { en: "Source", es: "Código fuente" };
const PRIVATE_LABEL: LocalizedText = {
  en: "Private repository, available on request",
  es: "Repositorio privado, disponible bajo solicitud",
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
    started: "2026-07",
    stack: ["NestJS", "Next.js", "PostgreSQL", "TimescaleDB", "Redis", "BullMQ", "Python", "Prisma", "Turborepo"],
    role: { en: "Solo full-stack developer", es: "Desarrollador full-stack en solitario" },
    summary: {
      en: "A multi-tenant SaaS platform that automates pricing, competitive intelligence, and revenue management for rent-a-car companies, built as a modular monolith around a deterministic, auditable rules engine.",
      es: "Una plataforma SaaS multi-tenant que automatiza el pricing, la inteligencia competitiva y la gestión de ingresos para empresas de rent-a-car, construida como un monolito modular alrededor de un motor de reglas determinista y auditable.",
    },
    problem: {
      en: "Rent-a-car companies price vehicles manually or with static spreadsheets, missing real-time competitive shifts and leaving margin on the table. Existing enterprise tools are expensive, closed, and slow to adapt.",
      es: "Las empresas de rent-a-car fijan precios manualmente o con hojas de cálculo estáticas, sin detectar cambios competitivos en tiempo real y dejando margen sobre la mesa. Las herramientas empresariales existentes son costosas, cerradas y lentas para adaptarse.",
    },
    solution: {
      en: "A modular-monolith pricing engine with a deterministic rules DSL, hard safety clamps (price floors/ceilings that can never be crossed), automatic competitor rate intelligence, and alerting, all multi-tenant from day one with real JWT/RBAC isolation.",
      es: "Un motor de pricing tipo monolito modular con un DSL de reglas determinista, topes de seguridad estrictos (mínimos/máximos de precio que nunca se cruzan), inteligencia automática de tarifas de la competencia, y alertas, todo multi-tenant desde el primer día, con aislamiento real vía JWT/RBAC.",
    },
    highlightGroups: [
      {
        title: { en: "Architecture", es: "Arquitectura" },
        items: {
          en: [
            "Turborepo monorepo: NestJS API, Next.js web, two Python services (rate-shopper and ml-forecasting) and a backup job, each isolated by workload profile",
            'Deterministic rules engine: condition/action evaluation, conflict resolution by specificity, hard price floors and ceilings that can never be crossed. It also segments price by length of stay and channel and writes the "why this price changed" text from stored rule facts, with no LLM involved',
            "Rate intelligence through light adapters that call OTA internal APIs directly (and respect robots.txt) instead of driving a browser. ml-forecasting is a stateless FastAPI service (OLS occupancy forecast, log-log price elasticity, MAD anomaly detection); its output is advisory and the rules engine still decides every price",
            "PostgreSQL + TimescaleDB for price and occupancy series; Redis + BullMQ for repricing events, with bounded job history and retries with backoff so the audit-log queue cannot drop an entry on a transient DB error",
            "Money as exact decimal end to end, with row-level locks around every price mutation so two concurrent repricing events cannot overwrite each other",
          ],
          es: [
            "Monorepo Turborepo: API NestJS, web Next.js, dos servicios Python (rate-shopper y ml-forecasting) y un job de backup, cada uno aislado por perfil de carga",
            'Motor de reglas determinista: evaluación condición/acción, resolución de conflictos por especificidad, pisos y techos de precio que nunca se cruzan. También segmenta el precio por duración de estadía y canal, y escribe el texto de "por qué cambió este precio" desde los facts guardados de las reglas, sin LLM',
            "Inteligencia de tarifas con adaptadores ligeros que llaman directo a las APIs internas de las OTAs (y respetan robots.txt) en vez de manejar un navegador. ml-forecasting es un servicio FastAPI sin estado (forecast de ocupación OLS, elasticidad precio log-log, detección de anomalías con MAD); su salida es solo una sugerencia y el motor de reglas decide cada precio",
            "PostgreSQL + TimescaleDB para series de precio y ocupación; Redis + BullMQ para eventos de repricing, con historial de jobs acotado y reintentos con backoff para que la cola del log de auditoría no pierda una entrada por un error transitorio de la DB",
            "Dinero como decimal exacto de punta a punta, con locks de fila en cada mutación de precio para que dos eventos de repricing concurrentes no se pisen",
          ],
        },
      },
      {
        title: { en: "Correctness and security", es: "Correctitud y seguridad" },
        items: {
          en: [
            "Multi-tenant JWT/RBAC with tenant isolation enforced in every use case and verified end to end (403 on cross-tenant access); sessions carry live revocation, so deactivating a user kills their existing token",
            "SSRF guard with real DNS resolution (not string matching) that re-validates and pins each outbound tenant webhook to its checked IP at delivery time, closing the gap where a hostname is re-pointed at a cloud metadata endpoint after passing validation",
            "One global middleware writes the activity/audit log for every mutating request, instead of per-endpoint instrumentation",
          ],
          es: [
            "JWT/RBAC multi-tenant con aislamiento de tenant forzado en cada caso de uso y verificado de punta a punta (403 en accesos cruzados); las sesiones tienen revocación real, así que desactivar un usuario invalida su token",
            "Guard anti-SSRF con resolución real de DNS (no comparación de strings) que re-valida y fija cada webhook saliente de tenant a su IP verificada al momento del envío, cerrando el hueco donde un hostname se re-apunta a un endpoint de metadata de la nube después de pasar la validación",
            "Un único middleware global escribe el log de actividad/auditoría de cada request mutante, en vez de instrumentar endpoint por endpoint",
          ],
        },
      },
      {
        title: { en: "How I checked it", es: "Cómo lo verifiqué" },
        items: {
          en: [
            "gitleaks, Semgrep, OSV-Scanner and Trivy found an AES-GCM auth-tag-length gap in 2FA secret decryption (Node accepted 4-byte tags) and an exception-filter ordering bug that turned every domain validation error into a 500 in production",
            "A backtest of the ML occupancy forecast against the deterministic pickup model, on synthetic history because there are no real clients yet. The deterministic model is about twice as accurate on clean data and OLS wins on noisy data, so the ML stays a suggestion and does not set prices",
            "Nightly Postgres backups to Cloudflare R2, with the restore itself exercised in CI, not just the backup",
            "Two audit rounds closed the last rules-engine gaps (seasonal demand index and competitor price deltas became first-class rule facts) and fixed all 17 findings of a UX/accessibility audit, including WCAG contrast on every status badge, ARIA tabs with roving tabindex and visible keyboard focus",
          ],
          es: [
            "gitleaks, Semgrep, OSV-Scanner y Trivy encontraron un hueco en el largo del tag AES-GCM al descifrar secretos 2FA (Node aceptaba tags de 4 bytes) y un bug de orden de filtros de excepción que convertía cada error de validación de dominio en un 500 en producción",
            "Un backtest del forecast de ocupación con ML contra el pickup model determinista, sobre historia sintética porque todavía no hay clientes reales. El modelo determinista acierta casi el doble con datos limpios y el OLS gana con datos ruidosos, así que el ML sigue siendo una sugerencia y no fija precios",
            "Backups nocturnos de Postgres a Cloudflare R2, con el restore ejercitado en CI, no solo el backup",
            "Dos rondas de auditoría cerraron los últimos huecos del motor de reglas (el índice de demanda estacional y los deltas de precio de la competencia pasaron a ser facts de primera clase) y corrigieron los 17 hallazgos de una auditoría de UX/accesibilidad, incluyendo contraste WCAG en cada badge de estado, pestañas ARIA con roving tabindex y foco de teclado visible",
          ],
        },
      },
    ],
    notDoneYet: {
      en: "No production users yet and no public demo: the platform is built toward a pilot with a rent-a-car company that has not started. The ML service only gives advisory suggestions.",
      es: "Todavía no hay usuarios en producción ni demo pública: la plataforma está construida hacia un piloto con una empresa de rent-a-car que aún no empieza. El servicio de ML solo da sugerencias.",
    },
    metrics: [
      { label: { en: "Backend tests", es: "Tests de backend" }, value: "1,260 (unit + e2e)" },
      { label: { en: "Frontend tests", es: "Tests de frontend" }, value: "344 unit + 99 Playwright (3 devices)" },
      { label: { en: "Services", es: "Servicios" }, value: "API + Web + 2 Python microservices" },
    ],
    links: [
      {
        label: PRIVATE_LABEL,
        href: "mailto:kelvisguerrero03@gmail.com?subject=RentEdge%20repo%20access",
        icon: "external",
      },
    ],
    gallery: [
      "/images/rentedge/dashboard.png",
      "/images/rentedge/dashboard-dark.png",
      "/images/rentedge/pricing-rules.png",
      "/images/rentedge/offices.png",
      "/images/rentedge/login.png",
    ],
    galleryAlt: {
      en: [
        "RentEdge dashboard with revenue KPIs, overbooking risk banner and operational counters",
        "The same RentEdge dashboard in dark mode",
        "Pricing rules screen with the IF/THEN rule builder and the table of existing rules",
        "Offices and categories screen with the change threshold, Slack alert channels and the new office form",
        "RentEdge login screen",
      ],
      es: [
        "Dashboard de RentEdge con KPIs de ingresos, alerta de overbooking y contadores operativos",
        "El mismo dashboard de RentEdge en modo oscuro",
        "Pantalla de reglas de pricing con el constructor SI/ENTONCES y la tabla de reglas existentes",
        "Pantalla de oficinas y categorías con el umbral de cambio, los canales de alertas de Slack y el formulario de nueva oficina",
        "Pantalla de inicio de sesión de RentEdge",
      ],
    },
    video: {
      src: "/videos/rentedge-walkthrough.webm",
      poster: "/images/rentedge/walkthrough-poster.jpg",
      caption: {
        en: "50-second walkthrough on a demo tenant with sample data: dashboard, pricing rules, an office with its price simulator. No audio.",
        es: "Recorrido de 50 segundos en un tenant de demostración con datos de ejemplo: dashboard, reglas de pricing y una oficina con su simulador de precio. Sin audio.",
      },
    },
    accentColor: "#1e4a8c",
  },
  {
    slug: "agendabot",
    title: "AgendaBot",
    tagline: {
      en: "ASP.NET Core backend where an AI agent books barbershop appointments over WhatsApp",
      es: "Backend en ASP.NET Core donde un agente con IA agenda citas de una barbería por WhatsApp",
    },
    kind: "software",
    category: "software",
    status: "in-development",
    featured: true,
    started: "2026-10",
    stack: [
      ".NET 10",
      "ASP.NET Core",
      "EF Core",
      "SQL Server",
      "Microsoft.Extensions.AI",
      "Gemini",
      "WhatsApp Cloud API",
      "xUnit",
      "Testcontainers",
      "Docker",
    ],
    role: { en: "Backend developer", es: "Desarrollador backend" },
    summary: {
      en: "A .NET backend for the way many small businesses in the Dominican Republic actually take bookings: by hand, over WhatsApp. An LLM agent reads the customer's message, checks real availability, proposes a slot and books it only after the customer says yes. A background job sends a reminder the day before.",
      es: "Un backend en .NET para la forma en que muchos negocios pequeños en República Dominicana agendan de verdad: a mano, por WhatsApp. Un agente con LLM lee el mensaje del cliente, consulta la disponibilidad real, propone un horario y agenda solo cuando el cliente dice que sí. Un proceso en segundo plano manda un recordatorio el día antes.",
    },
    problem: {
      en: "Letting a language model write to a calendar is risky: it can double-book, invent a free slot, or confirm something the customer never agreed to. And a WhatsApp webhook has to answer Meta fast, survive retries and keep the LLM bill under control.",
      es: "Dejar que un modelo de lenguaje escriba en una agenda es riesgoso: puede reservar dos veces el mismo horario, inventarse uno libre o confirmar algo que el cliente nunca aceptó. Y un webhook de WhatsApp tiene que responderle rápido a Meta, aguantar reintentos y no disparar la factura del LLM.",
    },
    solution: {
      en: "The agent's write tools only leave a pending proposal; the server executes it only if the customer wrote something after it, so the model can't propose and confirm on its own. Bookings run in a serializable SQL Server transaction. The webhook verifies Meta's signature, deduplicates by message id and hands the slow work to a background queue.",
      es: "Las herramientas de escritura del agente solo dejan una propuesta pendiente; el servidor la ejecuta únicamente si el cliente escribió algo después, así que el modelo no puede proponer y confirmar solo. Las reservas corren en una transacción serializable de SQL Server. El webhook verifica la firma de Meta, deduplica por id de mensaje y pasa el trabajo lento a una cola en segundo plano.",
    },
    architectureHighlights: {
      en: [
        "Double-booking test fires 8 identical bookings in parallel against a real SQL Server: with Serializable exactly 1 wins; with ReadCommitted all 8 got in",
        "The two-turn confirmation rule lives in C#, not in the prompt, and has a test that fails if the check is removed",
        "Agent built on Microsoft.Extensions.AI IChatClient: Gemini (free tier) or Claude by configuration, a scripted fake model in tests",
        "The evals caught a real bug: on the customer's \"yes\" the model re-proposed and confirmed in the same turn, the server rejected it, and the model still told the customer it was booked. Fixed by putting the pending proposal in each turn's prompt",
        "WhatsApp webhook validates X-Hub-Signature-256, deduplicates retries with a unique index and processes through a Channel<T> + BackgroundService",
        "LLM cost caps: per-number and per-IP rate limits, a daily cap for the public demo, max 6 tool calls per message",
        "Public demo page prints a receipt of every tool call the agent made, including the ones the server rejected",
        "Tests run against real SQL Server via Testcontainers in GitHub Actions, plus 13 scripted evals against the real model graded by database state",
      ],
      es: [
        "El test de doble reserva lanza 8 reservas iguales en paralelo contra un SQL Server real: con Serializable entra exactamente 1; con ReadCommitted entraban las 8",
        "La regla de confirmación en dos turnos vive en C#, no en el prompt, y tiene un test que falla si se quita el chequeo",
        "Agente construido sobre IChatClient de Microsoft.Extensions.AI: Gemini (plan gratis) o Claude según la configuración, un modelo falso con guion en los tests",
        'Las evals encontraron un bug real: ante el "sí" del cliente, el modelo volvía a proponer y confirmaba en el mismo turno; el servidor lo rechazaba y el modelo igual decía que estaba agendado. Se arregló poniendo la propuesta pendiente en el prompt de cada turno',
        "El webhook de WhatsApp valida X-Hub-Signature-256, deduplica reintentos con un índice único y procesa con Channel<T> + BackgroundService",
        "Topes de costo del LLM: rate limit por número y por IP, tope diario para la demo pública y máximo 6 llamadas a herramientas por mensaje",
        "La demo pública imprime un ticket con cada herramienta que usó el agente, incluidas las que el servidor rechazó",
        "Los tests corren contra SQL Server real con Testcontainers en GitHub Actions, más 13 evals guionadas contra el modelo real calificadas por el estado de la base",
      ],
    },
    metrics: [
      { label: { en: "Automated tests", es: "Tests automatizados" }, value: "31 + 13 evals" },
      { label: { en: "Parallel double-booking attempts", es: "Reservas simultáneas en el test" }, value: "8 → 1" },
    ],
    links: [{ label: SOURCE_LABEL, href: "https://github.com/Kelvis123456/agendabot", icon: "github" }],
    gallery: ["/images/agendabot/conversation.png", "/images/agendabot/demo.png"],
    galleryAlt: {
      en: [
        "AgendaBot chat where the agent books an appointment through WhatsApp-style messages",
        "AgendaBot public demo page with the chat on the left and the backend ticket panel, still empty, on the right",
      ],
      es: [
        "Chat de AgendaBot donde el agente agenda una cita con mensajes estilo WhatsApp",
        "Página de demo pública de AgendaBot con el chat a la izquierda y el panel de ticket del backend, aún vacío, a la derecha",
      ],
    },
    accentColor: "#1F55B5",
  },
  {
    slug: "mcp-probe",
    title: "mcp-probe",
    tagline: {
      en: "Scripted checks for MCP servers: describe the calls in YAML, get pass/fail in CI",
      es: "Pruebas guionadas para servidores MCP: describes las llamadas en YAML y obtienes pasa/falla en CI",
    },
    kind: "software",
    category: "software",
    status: "in-development",
    visibility: "private",
    featured: false,
    started: "2026-11",
    stack: ["TypeScript", "MCP SDK", "Vitest", "GitHub Actions"],
    role: { en: "Solo developer", es: "Desarrollador en solitario" },
    summary: {
      en: "A command-line tool that starts an MCP server over stdio, talks to it like a client and reports which checks passed. It exits non-zero when something breaks, so it can gate a pull request.",
      es: "Una herramienta de línea de comandos que arranca un servidor MCP por stdio, habla con él como un cliente e informa qué comprobaciones pasaron. Sale con código distinto de cero si algo falla, así que puede bloquear un pull request.",
    },
    problem: {
      en: "I kept shipping MCP tools and had no cheap way to notice that a refactor changed a tool's output or stopped rejecting bad input. A hung tool is the worst case: a client that only waits for a failure cannot tell it from a clean error.",
      es: "Yo seguía publicando herramientas MCP y no tenía una forma barata de notar que un refactor cambió la salida de una herramienta o dejó de rechazar entradas malas. Una herramienta colgada es el peor caso: un cliente que solo espera un fallo no la distingue de un error limpio.",
    },
    solution: {
      en: "A YAML file names the server command and the calls to make, each with an expectation: it must succeed or fail, and optionally its text must contain a string, match a pattern or equal a golden value. Built-in checks cover the handshake, tool schemas, unknown tools and whether the server still answers at the end. A timeout is its own failure, so an expected error cannot be satisfied by a hang.",
      es: "Un archivo YAML nombra el comando del servidor y las llamadas a hacer, cada una con una expectativa: debe funcionar o fallar y, opcionalmente, su texto debe contener una cadena, cumplir un patrón o ser igual a un valor de referencia. Las comprobaciones incluidas cubren el handshake, los esquemas de las herramientas, las herramientas desconocidas y si el servidor sigue respondiendo al final. Un timeout es un fallo propio, así que un error esperado no se cumple con un cuelgue.",
    },
    architectureHighlights: {
      en: [
        "A failed call can be a thrown protocol error or an isError result depending on the server, and the probe accepts both, so it does not fail servers that are correct",
        "A call that never answers is reported as a timeout and never counts as an expected failure. There is a test with a server that hangs on purpose",
        "The tests start a small real MCP server and a second one that exits during the handshake, instead of mocking the client",
        "The example runs against the official reference server pinned to one version with install scripts disabled: 11 checks, all passing. That says the reference server behaves as the probe expects, not that the probe found bugs in it",
      ],
      es: [
        "Una llamada fallida puede ser un error de protocolo lanzado o un resultado con isError según el servidor, y la herramienta acepta ambos, así que no falla servidores que están bien",
        "Una llamada que nunca responde se informa como timeout y nunca cuenta como fallo esperado. Hay una prueba con un servidor que se cuelga a propósito",
        "Las pruebas arrancan un pequeño servidor MCP real y otro que sale durante el handshake, en vez de simular el cliente",
        "El ejemplo corre contra el servidor de referencia oficial fijado a una versión y con los scripts de instalación desactivados: 11 comprobaciones, todas pasan. Eso dice que el servidor de referencia se comporta como la herramienta espera, no que encontró errores en él",
      ],
    },
    notDoneYet: {
      en: "stdio only and tools only: no HTTP transport, resources or prompts. It compares the first text block, not structured output. It does not validate every message against the protocol schema and it is not published to npm.",
      es: "Solo stdio y solo herramientas: sin transporte HTTP, recursos ni prompts. Compara el primer bloque de texto, no la salida estructurada. No valida cada mensaje contra el esquema del protocolo y no está publicada en npm.",
    },
    metrics: [
      { label: { en: "Tests, against a real MCP server", es: "Tests, contra un servidor MCP real" }, value: "8" },
      { label: { en: "Checks in the reference-server example", es: "Comprobaciones en el ejemplo" }, value: "11" },
    ],
    links: [
      {
        label: PRIVATE_LABEL,
        href: "https://github.com/Kelvis123456/mcp-probe",
        icon: "github",
      },
    ],
  },
  {
    slug: "outbox-kit",
    title: "outbox-kit",
    tagline: {
      en: "Change the database and tell another system, without one happening and the other not",
      es: "Cambia la base de datos y avisa a otro sistema, sin que ocurra una cosa y la otra no",
    },
    kind: "software",
    category: "software",
    status: "in-development",
    visibility: "private",
    featured: false,
    started: "2026-11",
    stack: [".NET 10", "EF Core", "PostgreSQL", "xUnit", "Testcontainers"],
    role: { en: "Solo developer", es: "Desarrollador en solitario" },
    summary: {
      en: "A small .NET library for the transactional outbox on EF Core and PostgreSQL, plus an idempotent consumer. About 150 lines, with tests that prove its guarantees against a real database, including one that kills the process mid-dispatch.",
      es: "Una biblioteca pequeña de .NET para el outbox transaccional sobre EF Core y PostgreSQL, más un consumidor idempotente. Unas 150 líneas, con pruebas que demuestran sus garantías contra una base real, una de ellas matando el proceso a mitad del envío.",
    },
    problem: {
      en: "Saving a change and then publishing a message are two steps. If the process dies between them, the change exists and nobody was told. Swap them and a message goes out for a change that never committed.",
      es: "Guardar un cambio y luego publicar un mensaje son dos pasos. Si el proceso muere entre ambos, el cambio existe y nadie se enteró. Si los inviertes, sale un mensaje de un cambio que nunca se confirmó.",
    },
    solution: {
      en: "The message is a row written in the same SaveChanges as the change, so both commit or neither does. A dispatcher locks a batch with FOR UPDATE SKIP LOCKED, publishes and marks rows in one transaction. The consumer records the message id and runs its handler in one transaction, so a redelivery is skipped.",
      es: "El mensaje es una fila escrita en el mismo SaveChanges que el cambio, así que se confirman los dos o ninguno. Un despachador bloquea un lote con FOR UPDATE SKIP LOCKED, publica y marca las filas en una transacción. El consumidor registra el id del mensaje y ejecuta su manejador en una transacción, así que un reenvío se omite.",
    },
    architectureHighlights: {
      en: [
        "The chaos test runs a second process and ends it with Environment.FailFast between publish and commit. Nothing is marked processed, a second worker finishes: all 20 messages are processed and the broker saw 23 publishes, three of them duplicates",
        "A consumer that replays every one of those publishes twice applies each effect exactly once. At-least-once from the outbox plus the inbox gives one effect per message",
        "Three dispatchers at once publish each of 40 messages exactly once, and a poison message is retried then parked without blocking the rest",
        "I publish inside the locking transaction on purpose: a crash always rolls back to a clean state, at the cost of a long transaction when the broker is slow",
      ],
      es: [
        "La prueba de caos corre un segundo proceso y lo termina con Environment.FailFast entre publicar y confirmar. Nada queda marcado como procesado, un segundo worker termina: los 20 mensajes se procesan y el broker vio 23 publicaciones, tres duplicadas",
        "Un consumidor que repite cada una de esas publicaciones dos veces aplica cada efecto exactamente una vez. At-least-once del outbox más el inbox da un efecto por mensaje",
        "Tres despachadores a la vez publican cada uno de 40 mensajes exactamente una vez, y un mensaje venenoso se reintenta y se aparta sin bloquear al resto",
        "Publico dentro de la transacción que bloquea a propósito: un fallo siempre vuelve a un estado limpio, a costa de una transacción larga si el broker es lento",
      ],
    },
    notDoneYet: {
      en: "PostgreSQL only. No ordering guarantee once a message fails, no cleanup of processed rows and no metrics. I did not benchmark it, so I make no throughput claim. It is not published to NuGet.",
      es: "Solo PostgreSQL. Sin garantía de orden cuando un mensaje falla, sin limpieza de filas procesadas y sin métricas. No la medí, así que no afirmo ningún rendimiento. No está publicada en NuGet.",
    },
    metrics: [
      { label: { en: "Tests, against real PostgreSQL", es: "Tests, contra PostgreSQL real" }, value: "9" },
      { label: { en: "Crash test: messages lost", es: "Prueba de caos: mensajes perdidos" }, value: "0" },
    ],
    links: [
      {
        label: PRIVATE_LABEL,
        href: "https://github.com/Kelvis123456/outbox-kit",
        icon: "github",
      },
    ],
  },
  {
    slug: "evalgate",
    title: "evalgate",
    tagline: {
      en: "A CI gate for RAG and LLM apps: a number that moves when answer quality breaks",
      es: "Una puerta de CI para apps RAG y LLM: un número que se mueve cuando se rompe la calidad de las respuestas",
    },
    kind: "software",
    category: "software",
    status: "in-development",
    visibility: "private",
    featured: false,
    started: "2026-11",
    stack: ["Python", "pytest", "GitHub Actions"],
    role: { en: "Solo developer", es: "Desarrollador en solitario" },
    summary: {
      en: "A versioned eval set, a committed baseline and a command that exits non-zero when quality drops past a tolerance. It runs with no API keys and gives the same result every time, so it can run on every pull request.",
      es: "Un conjunto de evaluación versionado, una línea base guardada y un comando que sale con código distinto de cero cuando la calidad cae más de una tolerancia. Corre sin claves de API y da el mismo resultado siempre, así que puede correr en cada pull request.",
    },
    problem: {
      en: 'Prompt and retriever changes tend to merge with "looks fine on the three examples I tried". I wanted the same check for answer quality that a test suite gives for code.',
      es: 'Los cambios de prompt y de recuperador suelen mezclarse con "se ve bien en los tres ejemplos que probé". Quería para la calidad de las respuestas lo mismo que una suite de pruebas da al código.',
    },
    solution: {
      en: "The repo ships a small reference RAG app (an original 25-passage corpus, a stdlib BM25 retriever and an extractive answerer) with 41 eval questions, 7 of which have no answer in the corpus. Metrics are deterministic and offline: hit@k, MRR, citation correctness, whether the answer contains the fact, and abstention accuracy. The gate prints a table with baseline, current, delta and tolerance per metric.",
      es: "El repo incluye una pequeña app RAG de referencia (un corpus original de 25 pasajes, un recuperador BM25 en la biblioteca estándar y un respondedor extractivo) con 41 preguntas de evaluación, 7 sin respuesta en el corpus. Las métricas son deterministas y sin conexión: hit@k, MRR, corrección de citas, si la respuesta contiene el dato y precisión al abstenerse. La puerta imprime una tabla con línea base, actual, diferencia y tolerancia por métrica.",
    },
    architectureHighlights: {
      en: [
        "Degrading the reference app on purpose fails the gate with a readable diff: the whitespace tokenizer drops citation correctness from 0.94 to 0.50, and top_k=1 drops hit@k from 1.00 to 0.97. Real output is in the repo",
        "A metric that goes up is not a failure: abstention accuracy rose under the whitespace tokenizer, and the report shows it instead of hiding it",
        "87 tests assert exact numbers and cover empty corpus, unicode, ties in ranking, tolerance boundaries, a missing baseline and malformed lines reported with their line number",
        "The LLM-judge metric is only an interface and an example stub, off by default and not used in CI. I did not wire a real vendor",
      ],
      es: [
        "Degradar la app de referencia a propósito hace fallar la puerta con una diferencia legible: el tokenizador por espacios baja la corrección de citas de 0,94 a 0,50 y top_k=1 baja hit@k de 1,00 a 0,97. La salida real está en el repo",
        "Una métrica que sube no es un fallo: la precisión al abstenerse subió con el tokenizador por espacios, y el informe la muestra en vez de ocultarla",
        "87 pruebas verifican números exactos y cubren corpus vacío, unicode, empates en el ranking, límites de tolerancia, línea base ausente y líneas mal formadas con su número de línea",
        "La métrica con un LLM como juez es solo una interfaz y un ejemplo, desactivada por defecto y sin usarse en CI. No conecté ningún proveedor real",
      ],
    },
    notDoneYet: {
      en: "The corpus and questions are mine and small, so the scores say the gate works, not that any real app is good. The baseline abstention accuracy is 0.71, which is low and left as it is. It is not published to PyPI.",
      es: "El corpus y las preguntas son míos y pequeños, así que los números dicen que la puerta funciona, no que una app real sea buena. La precisión de abstención de la línea base es 0,71, que es baja y la dejé así. No está publicada en PyPI.",
    },
    metrics: [
      { label: { en: "Tests", es: "Tests" }, value: "87" },
      { label: { en: "Eval questions", es: "Preguntas de evaluación" }, value: "41" },
    ],
    links: [
      {
        label: PRIVATE_LABEL,
        href: "https://github.com/Kelvis123456/evalgate",
        icon: "github",
      },
    ],
  },
  {
    slug: "webhook-inbox",
    title: "webhook-inbox",
    tagline: {
      en: "A Stripe webhook receiver that survives duplicate, out-of-order and failing events",
      es: "Un receptor de webhooks de Stripe que aguanta eventos repetidos, desordenados y que fallan",
    },
    kind: "software",
    category: "software",
    status: "in-development",
    featured: false,
    started: "2026-11",
    stack: ["TypeScript", "NestJS", "PostgreSQL", "Vitest", "Testcontainers", "Docker"],
    role: { en: "Solo developer", es: "Desarrollador en solitario" },
    summary: {
      en: "A NestJS service that verifies a Stripe signature, stores each event before processing it, applies it in order, retries failures with backoff and keeps the ones that cannot be processed in a queue you can inspect and replay.",
      es: "Un servicio en NestJS que verifica la firma de Stripe, guarda cada evento antes de procesarlo, lo aplica en orden, reintenta los fallos con espera creciente y deja los que no se pueden procesar en una cola que se puede revisar y reenviar.",
    },
    problem: {
      en: "A webhook endpoint that works in a tutorial fails quietly in production: Stripe retries, so the same event arrives twice; it does not guarantee order, so a refund can arrive before the payment it refunds; and a slow endpoint makes Stripe send it all again.",
      es: "Un endpoint de webhooks que funciona en un tutorial falla en silencio en producción: Stripe reintenta, así que el mismo evento llega dos veces; no garantiza el orden, así que un reembolso puede llegar antes del pago que reembolsa; y un endpoint lento hace que Stripe lo mande todo otra vez.",
    },
    solution: {
      en: "The endpoint only checks the signature over the raw body, inserts the event keyed by its Stripe id and answers 200. A worker claims ready events with UPDATE ... FOR UPDATE SKIP LOCKED and applies each one in the same transaction that marks it done. Each order remembers the date of the last event it applied, so an older one is discarded.",
      es: "El endpoint solo comprueba la firma sobre el cuerpo crudo, inserta el evento con su id de Stripe como clave y responde 200. Un worker toma los eventos listos con UPDATE ... FOR UPDATE SKIP LOCKED y aplica cada uno en la misma transacción que lo marca como hecho. Cada pedido recuerda la fecha del último evento que aplicó, así que uno más viejo se descarta.",
    },
    architectureHighlights: {
      en: [
        "20 simultaneous deliveries of the same event leave one row and exactly one response reporting it as new. Removing ON CONFLICT breaks both duplicate tests",
        "A refund processed before its payment still ends as refunded, and events in the same second are resolved by state so the result does not depend on arrival order. Removing the ordering guard breaks three tests",
        "Retries wait 5 s times 2 to the attempt, capped at one hour with full jitter, and after 6 attempts the event goes to a dead queue behind a token-protected endpoint that can replay it",
        "I removed SKIP LOCKED to check my tests and the three-worker test still passed: uniqueness comes from the UPDATE re-evaluating its WHERE, and SKIP LOCKED only avoids waiting. I fixed my own code comment and added a test with a row held by another transaction, which does fail without it",
        "31 tests run against a real PostgreSQL container, because ON CONFLICT, SKIP LOCKED and transactions are database behavior a mock cannot show",
      ],
      es: [
        "20 entregas simultáneas del mismo evento dejan una fila y una sola respuesta que lo marca como nuevo. Quitar ON CONFLICT rompe las dos pruebas de duplicados",
        "Un reembolso procesado antes que su pago termina igual como reembolsado, y los eventos del mismo segundo se resuelven por estado para que el resultado no dependa del orden de llegada. Quitar la guarda de orden rompe tres pruebas",
        "Los reintentos esperan 5 s por 2 elevado al intento, con tope de una hora y jitter completo, y a los 6 intentos el evento pasa a una cola de muertos detrás de un endpoint con token que puede reenviarlo",
        "Quité SKIP LOCKED para comprobar mis pruebas y la de tres workers siguió pasando: la unicidad la da el UPDATE al reevaluar su WHERE, y SKIP LOCKED solo evita esperar. Corregí mi propio comentario y agregué una prueba con una fila retenida por otra transacción, que sí falla sin él",
        "31 pruebas corren contra un contenedor real de PostgreSQL, porque ON CONFLICT, SKIP LOCKED y las transacciones son comportamiento de la base que un mock no muestra",
      ],
    },
    notDoneYet: {
      en: "It was never connected to a real Stripe account: signatures in the tests and the simulator come from the SDK's helper with a test secret. It handles three event types, the orders table is a stand-in, I did not measure throughput and there are no metrics or traces.",
      es: "Nunca se conectó a una cuenta real de Stripe: las firmas de las pruebas y del simulador salen del helper del SDK con un secreto de prueba. Maneja tres tipos de evento, la tabla de pedidos es un pretexto, no medí el rendimiento y no hay métricas ni trazas.",
    },
    metrics: [
      { label: { en: "Tests, against real PostgreSQL", es: "Tests, contra PostgreSQL real" }, value: "31" },
      { label: { en: "Event types handled", es: "Tipos de evento" }, value: "3" },
    ],
    links: [
      {
        label: SOURCE_LABEL,
        href: "https://github.com/Kelvis123456/webhook-inbox",
        icon: "github",
      },
    ],
  },
  {
    slug: "transfer-ledger",
    title: "transfer-ledger",
    tagline: {
      en: "A double-entry ledger where moving money cannot be done twice or by mistake",
      es: "Un libro mayor de partida doble donde mover dinero no se puede hacer dos veces ni por error",
    },
    kind: "software",
    category: "software",
    status: "in-development",
    featured: false,
    started: "2026-11",
    stack: [".NET 10", "ASP.NET Core", "PostgreSQL", "Npgsql", "xUnit", "Testcontainers"],
    role: { en: "Solo developer", es: "Desarrollador en solitario" },
    summary: {
      en: "A .NET API over PostgreSQL with accounts addressed by alias (a phone number or an email), double-entry bookkeeping, idempotency keys and a reconciliation endpoint that checks the numbers add up. It is inspired by the idea of instant payments by alias and does not follow any real payment system's specification.",
      es: "Una API en .NET sobre PostgreSQL con cuentas identificadas por alias (un teléfono o un correo), contabilidad de partida doble, claves de idempotencia y un endpoint de conciliación que comprueba que los números cuadran. Está inspirada en la idea de los pagos instantáneos por alias y no sigue la especificación de ningún sistema de pagos real.",
    },
    problem: {
      en: "Code that moves money has to survive a client that retries, a thousand requests at once and a bug in its own checks. A balance column that is updated and nothing else gives you nothing to compare against when the numbers stop adding up.",
      es: "El código que mueve dinero tiene que aguantar a un cliente que reintenta, mil peticiones a la vez y un bug en sus propias comprobaciones. Una columna de saldo que solo se actualiza no deja nada con qué comparar cuando los números dejan de cuadrar.",
    },
    solution: {
      en: "Every transfer writes two entries that sum to zero, and a deposit is a transfer from a bank account that may go negative. The idempotency key is inserted in the same transaction as the transfer, so a repeated request waits on the unique index and gets the stored answer. The database also refuses what does not add up: a check on negative balances, a deferred trigger on entries that do not sum to zero, and append-only tables.",
      es: "Cada transferencia escribe dos asientos que suman cero, y un depósito es una transferencia desde una cuenta del banco que puede quedar en negativo. La clave de idempotencia se inserta en la misma transacción que la transferencia, así que una petición repetida espera en el índice único y recibe la respuesta guardada. La base también rechaza lo que no cuadra: un chequeo contra saldos negativos, un trigger diferido sobre asientos que no suman cero y tablas de solo inserción.",
    },
    architectureHighlights: {
      en: [
        "60 concurrent transfers against a balance that covers 30: exactly 30 succeed, the balance never goes negative and the reconciliation stays clean. Without the row lock the test fails",
        "40 simultaneous requests with the same idempotency key leave one transfer. Without the ON CONFLICT on the key, five idempotency tests fail",
        "Reconciliation reads only the data: all entries must sum to zero and each balance must equal the sum of its entries. A test edits a balance by hand and the check flags exactly that account",
        "The database is the last defense: a deferred trigger rejects entries that do not sum to zero at commit, and UPDATE or DELETE on entries and transfers fail",
        "Removing the ORDER BY id on the account lock changed nothing in my cross-transfer test, because Postgres scans rows in a stable order. I kept it as an explicit defense and wrote that in the code instead of claiming a test proves it",
        "Running the tests the first time exposed two of my own bugs: my validation rejected the bank account's own alias, so no deposit worked, and SUM of bigint returns numeric in Postgres",
      ],
      es: [
        "60 transferencias concurrentes contra un saldo que cubre 30: pasan exactamente 30, el saldo nunca es negativo y la conciliación sigue limpia. Sin el bloqueo de fila la prueba falla",
        "40 peticiones simultáneas con la misma clave de idempotencia dejan una sola transferencia. Sin el ON CONFLICT de la clave fallan cinco pruebas de idempotencia",
        "La conciliación lee solo los datos: todos los asientos deben sumar cero y cada saldo debe ser igual a la suma de los suyos. Una prueba altera un saldo a mano y el chequeo señala justo esa cuenta",
        "La base es la última defensa: un trigger diferido rechaza al confirmar asientos que no suman cero, y UPDATE o DELETE sobre asientos y transferencias fallan",
        "Quitar el ORDER BY id del bloqueo de cuentas no cambió nada en mi prueba de transferencias cruzadas, porque Postgres recorre las filas en un orden estable. Lo dejé como defensa explícita y lo escribí en el código en vez de afirmar que una prueba lo demuestra",
        "Correr las pruebas por primera vez dejó al descubierto dos errores míos: mi validación rechazaba el alias de la propia cuenta del banco, así que ningún depósito funcionaba, y SUM de bigint devuelve numeric en Postgres",
      ],
    },
    notDoneYet: {
      en: "It follows no real payment specification, has one currency, no fees, limits, fraud checks or verified identity behind an alias, and one shared API key instead of users. Idempotency keys never expire, I did not measure throughput and it is not deployed.",
      es: "No sigue ninguna especificación de pagos real, tiene una sola moneda, no hay comisiones, límites, detección de fraude ni identidad verificada detrás de un alias, y usa una clave de API compartida en vez de usuarios. Las claves de idempotencia no caducan, no medí el rendimiento y no está desplegado.",
    },
    metrics: [
      { label: { en: "Tests, against real PostgreSQL", es: "Tests, contra PostgreSQL real" }, value: "38" },
      {
        label: { en: "Concurrent transfers in one test", es: "Transferencias concurrentes en una prueba" },
        value: "60",
      },
    ],
    links: [
      {
        label: SOURCE_LABEL,
        href: "https://github.com/Kelvis123456/transfer-ledger",
        icon: "github",
      },
    ],
  },
  {
    slug: "hornilla",
    title: "Hornilla",
    tagline: {
      en: "A concept website for a fictional coffee roaster in Santo Domingo, drawn without photos",
      es: "Un sitio conceptual para una tostadora de café ficticia en Santo Domingo, dibujado sin fotos",
    },
    kind: "software",
    category: "software",
    status: "concept",
    visibility: "private",
    featured: false,
    started: "2026-11",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "SVG"],
    role: { en: "Solo developer and designer", es: "Desarrollador y diseñador en solitario" },
    summary: {
      en: "Six static pages in Spanish: home, coffee with prices in pesos, a reservation form, opening hours with a drawn street map, about, and a custom 404. The sack, the roast curve, the beans and the map are hand-built SVG.",
      es: "Seis páginas estáticas en español: inicio, café con precios en pesos, un formulario de reserva, horarios con un mapa de calles dibujado, nosotros y un 404 propio. La bolsa, la curva de tueste, los granos y el mapa son SVG hechos a mano.",
    },
    problem: {
      en: "I wanted a finished small-business site as proof of design work, without borrowed photos or invented customers. A concept has to say it is a concept, so it carries that label in the footer and the README.",
      es: "Quería un sitio terminado de negocio pequeño como prueba de diseño, sin fotos prestadas ni clientes inventados. Un concepto tiene que decir que lo es, así que lleva esa etiqueta en el pie y en el README.",
    },
    solution: {
      en: "A coffee-sack stencil identity: condensed capitals, cherry red on grey-green paper and square corners. The reservation form validates every field, shows an error summary that takes focus and ends in a confirmation, and says plainly that it sends nothing.",
      es: "Una identidad de estarcido de saco de café: mayúsculas condensadas, rojo cereza sobre papel gris verdoso y esquinas rectas. El formulario de reserva valida cada campo, muestra un resumen de errores que recibe el foco y termina en una confirmación, y dice con claridad que no envía nada.",
    },
    architectureHighlights: {
      en: [
        "Every text and background pair passes WCAG AA, checked with real contrast math: ink on paper 14.25, cherry on paper 6.37, form border on paper 4.61",
        "Unique title, description and canonical per page, JSON-LD for a coffee shop, a generated OG image, sitemap, robots and one h1 per page",
        "I took screenshots of all six pages at 400 and 1280 px, looked at them and fixed a menu button that did not hide on desktop, text overflowing the sack and curve labels colliding",
        "No horizontal overflow on any page at either width, and the form works with the keyboard alone",
      ],
      es: [
        "Cada par de texto y fondo pasa WCAG AA, comprobado con cálculo real de contraste: tinta sobre papel 14,25, cereza sobre papel 6,37, borde del formulario sobre papel 4,61",
        "Título, descripción y canonical únicos por página, JSON-LD de cafetería, imagen OG generada, sitemap, robots y un solo h1 por página",
        "Tomé capturas de las seis páginas a 400 y 1280 px, las miré y corregí un botón de menú que no se ocultaba en escritorio, texto que desbordaba la bolsa y etiquetas de la curva que chocaban",
        "Sin desborde horizontal en ninguna página a ningún ancho, y el formulario funciona solo con teclado",
      ],
    },
    notDoneYet: {
      en: "The business, its prices and its hours are invented, and the name may collide with a real one I did not find. The form sends nothing. I did not run Lighthouse and only tested in Chrome.",
      es: "El negocio, sus precios y sus horarios son inventados, y el nombre puede coincidir con uno real que no encontré. El formulario no envía nada. No corrí Lighthouse y solo probé en Chrome.",
    },
    metrics: [
      { label: { en: "Pages", es: "Páginas" }, value: "6" },
      { label: { en: "Photos used", es: "Fotos usadas" }, value: "0" },
    ],
    links: [
      {
        label: PRIVATE_LABEL,
        href: "https://github.com/Kelvis123456/cafe-concept",
        icon: "github",
      },
    ],
  },
  {
    slug: "automatizaciones",
    title: "Automatizaciones",
    tagline: {
      en: "n8n workflows I built to practice process automation: a daily exchange rate and an AI message classifier",
      es: "Flujos de n8n que armé para practicar automatización de procesos: una tasa de cambio diaria y un clasificador de mensajes con IA",
    },
    kind: "software",
    category: "software",
    status: "in-development",
    featured: false,
    started: "2026-10",
    stack: ["n8n", "PostgreSQL", "Docker", "JavaScript", "Gemini API", "GitHub Actions"],
    role: { en: "Author", es: "Autor" },
    summary: {
      en: "Two n8n workflows with their own repo. One pulls the USD to DOP rate every weekday, stores it in Postgres and compares it with the previous day. The other is a webhook that sends a customer message to Gemini and returns its category, urgency and a one-line summary.",
      es: "Dos flujos de n8n con su propio repo. Uno pide la tasa USD a DOP cada día hábil, la guarda en Postgres y la compara con el día anterior. El otro es un webhook que manda el mensaje de un cliente a Gemini y devuelve su categoría, urgencia y un resumen de una línea.",
    },
    problem: {
      en: "A language model can answer with the wrong format or with whatever the customer's message tells it to, and a workflow that trusts that output breaks quietly.",
      es: "Un modelo de lenguaje puede responder con otro formato o con lo que el mensaje del cliente le pida, y un flujo que confía en esa salida falla en silencio.",
    },
    solution: {
      en: "The customer's text goes between tags and is treated as data, the answer is checked against the allowed values, and the webhook returns 400 for bad input and 502 when Gemini fails after three tries.",
      es: "El texto del cliente va entre etiquetas y se trata como dato, la respuesta se valida contra los valores permitidos y el webhook devuelve 400 con entrada inválida y 502 si Gemini falla tras tres intentos.",
    },
    architectureHighlights: {
      en: [
        "6 tests against the real webhook, including a message that tries to give orders to the model and a forced 502",
        "The exchange rate lives in a Postgres table with one row per day, so manual runs and scheduled runs see the same history",
        "A GitHub Actions job checks that every exported flow imports cleanly and carries no keys",
        "Postgres in Docker instead of my SQL Server Express, which only accepts Windows authentication: the reasoning is in the repo's decisions log",
      ],
      es: [
        "6 pruebas contra el webhook real, incluido un mensaje que intenta darle órdenes al modelo y un 502 forzado",
        "La tasa vive en una tabla de Postgres con una fila por día, así que las corridas manuales y las programadas ven el mismo historial",
        "Un job de GitHub Actions revisa que cada flujo exportado se importe bien y no lleve llaves",
        "Postgres en Docker en vez de mi SQL Server Express, que solo acepta autenticación de Windows: el razonamiento está en el registro de decisiones del repo",
      ],
    },
    metrics: [{ label: { en: "Tests against the webhook", es: "Pruebas contra el webhook" }, value: "6" }],
    links: [{ label: SOURCE_LABEL, href: "https://github.com/Kelvis123456/automatizaciones", icon: "github" }],
    gallery: ["/images/automatizaciones/clasificador.png", "/images/automatizaciones/tasa-diaria.png"],
    galleryAlt: {
      en: [
        "n8n workflow that receives a message, validates it, asks Gemini to classify it and answers with a 200, 400 or 502 response",
        "n8n workflow that fetches the daily USD to DOP rate, validates it, stores it in PostgreSQL and builds a 30-day summary",
      ],
      es: [
        "Flujo de n8n que recibe un mensaje, lo valida, le pide a Gemini que lo clasifique y responde con un 200, 400 o 502",
        "Flujo de n8n que obtiene la tasa diaria de USD a DOP, la valida, la guarda en PostgreSQL y arma un resumen de 30 días",
      ],
    },
    accentColor: "#EA4B71",
  },
  {
    slug: "willforge",
    title: "WillForge",
    tagline: {
      en: "An RPG progression system built on top of a real fitness app",
      es: "Un sistema de progresión RPG construido sobre una app de fitness real",
    },
    kind: "software",
    category: "software",
    status: "in-development",
    visibility: "private",
    notDoneYet: {
      en: "There is no public download: the app is not published on any store. The backend is a real Supabase project and the source is private, so the walkthrough is the screenshots here and a demo on request.",
      es: "No hay descarga pública: la app no está publicada en ninguna tienda. El backend es un proyecto real de Supabase y el código es privado, así que el recorrido son las capturas de aquí y una demo bajo solicitud.",
    },
    featured: false,
    started: "2026-07",
    stack: ["Flutter", "Riverpod", "Supabase", "PostgreSQL", "go_router"],
    role: { en: "Solo developer", es: "Desarrollador en solitario" },
    summary: {
      en: "A fitness app that turns real workouts into RPG progression: ranks from E to S, guilds, boss raids, a skill tree, a season pass, and daily quests, all backed by a real Postgres schema, not local mock data.",
      es: "Una app de fitness que convierte entrenamientos reales en progresión RPG: rangos de E a S, guilds, boss raids, árbol de habilidades, season pass y misiones diarias, todo respaldado por un schema real de Postgres, no datos simulados locales.",
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
        "18-illustration avatar gallery, freely pickable, decoupled from any other profile data",
        "Lifetime stat trend (sparkline + delta) computed from a real per-level-up snapshot table, not estimated",
        "Persistent training routines built from the real exercise catalog, picked from a gallery and kept active across sessions",
        "Sessions with a set table, plate calculator, background-safe rest timer, suggested weights and a plateau note, plus supersets that alternate two exercises and save together",
        "Progress screen with sets per muscle and estimated 1RM and volume trends; server-side cooldown, per-set duration and daily XP limits against farming, replayed as SQL attacks in CI",
      ],
      es: [
        "Sistema de guild con agregación real de XP semanal entre miembros y desafíos a nivel de guild",
        "Árbol de habilidades y Shadow Army controlados por umbrales reales de entrenamiento/racha/rango, no por flags",
        "Season Pass con recompensas por niveles, tracks de XP y boosts por tiempo limitado aplicados del lado del servidor",
        "Misiones diarias generadas de forma determinista por (fecha, rango) con un horario de días de descanso configurable",
        "Galería de 18 avatares ilustrados, de elección libre, independiente del resto de los datos del perfil",
        "Tendencia de stats de por vida (sparkline + delta) calculada desde una tabla real de snapshots por level-up, no estimada",
        "Rutinas de entrenamiento persistentes armadas con el catálogo real de ejercicios, elegidas de una galería y activas entre sesiones",
        "Sesiones con tabla de series, calculadora de discos, temporizador de descanso que sobrevive al segundo plano, pesos sugeridos y aviso de estancamiento, más supersets que alternan dos ejercicios y se guardan juntos",
        "Pantalla de progreso con series por músculo y tendencias de 1RM y volumen estimados; cooldown, duración por serie y tope diario de XP del lado del servidor contra el farming, repetidos como ataques SQL en CI",
      ],
    },
    metrics: [
      { label: { en: "Lines of Dart", es: "Líneas de Dart" }, value: "~25,800" },
      { label: { en: "Screens", es: "Pantallas" }, value: "26" },
    ],
    links: [
      {
        label: PRIVATE_LABEL,
        href: "mailto:kelvisguerrero03@gmail.com?subject=WillForge%20repo%20access",
        icon: "external",
      },
    ],
    coverFit: "contain",
    gallery: [
      "/images/willforge/dashboard.png",
      "/images/willforge/splash.png",
      "/images/willforge/avatar-gallery.png",
      "/images/willforge/routine.png",
      "/images/willforge/superset.png",
      "/images/willforge/superset-rest.png",
      "/images/willforge/progress.png",
      "/images/willforge/history.png",
      "/images/willforge/profile.png",
      "/images/willforge/achievements.png",
      "/images/willforge/boss-raid.png",
    ],
    galleryAlt: {
      en: [
        "WillForge home dashboard with the hunter's level, stats, daily quests and an active boss raid",
        "WillForge splash screen with the flaming fist logo and the tagline Rise and Conquer",
        "Avatar gallery where the player picks a character",
        "Workout library with the current Total Strength routine and today's Muscle Builder challenge",
        "Active session in superset mode: Chin-Up is the second exercise, with the set counter, last-time reps and a suggested target",
        "Superset rest timer after a full round, with the set table showing Push-Up reps logged against the previous session",
        "Progress screen with sets per muscle group for the last seven days and an estimated one-rep max for Bench Press",
        "Training history with the two exercises of a superset tagged and the XP earned for each",
        "Player profile with stats and rank",
        "Achievements list with locked badges ranked from E to S and progress bars",
        "Boss raid screen where players attack a shared boss",
      ],
      es: [
        "Dashboard de WillForge con el nivel del cazador, estadísticas, misiones diarias y una raid activa",
        "Pantalla de inicio de WillForge con el logo del puño en llamas y el lema Rise and Conquer",
        "Galería de avatares donde el jugador elige un personaje",
        "Biblioteca de entrenamientos con la rutina actual Total Strength y el reto de hoy Muscle Builder",
        "Sesión activa en modo superset: Chin-Up es el segundo ejercicio, con el contador de series, las repeticiones de la última vez y un objetivo sugerido",
        "Temporizador de descanso del superset tras una ronda completa, con la tabla de series que compara las repeticiones de Push-Up con la sesión anterior",
        "Pantalla de progreso con series por grupo muscular de los últimos siete días y el 1RM estimado de Bench Press",
        "Historial de entrenamientos con los dos ejercicios de un superset marcados y la XP ganada por cada uno",
        "Perfil del jugador con estadísticas y rango",
        "Lista de logros bloqueados con rangos de E a S y barras de progreso",
        "Pantalla de raid contra un jefe compartido",
      ],
    },
    accentColor: "#6E3BFF",
  },
  {
    slug: "aura-novel",
    title: "Aura Novel",
    tagline: {
      en: "A mobile novel-writing app where you bring your own AI",
      es: "Una app móvil para escribir novelas donde traes tu propia IA",
    },
    kind: "software",
    category: "software",
    status: "in-development",
    featured: false,
    started: "2026-10",
    stack: ["Flutter", "Dart", "SQLite", "OpenAI-compatible API"],
    role: { en: "Solo developer", es: "Desarrollador en solitario" },
    summary: {
      en: "An Android editor that continues your scene with any OpenAI-compatible model. Projects, chapters, branching story history and a character/lore studio live in local SQLite. It keeps per-chapter summaries as context for long books, autosaves drafts, retries flaky API calls, and backs everything up to a single JSON. Chapters export to TXT, PDF or EPUB.",
      es: "Un editor Android que continúa tu escena con cualquier modelo compatible con OpenAI. Proyectos, capítulos, historial de historia en ramas y un estudio de personajes y lore viven en SQLite local. Guarda un resumen por capítulo como contexto para libros largos, autoguarda borradores, reintenta las llamadas que fallan y respalda todo en un solo JSON. Los capítulos se exportan a TXT, PDF o EPUB.",
    },
    links: [{ label: SOURCE_LABEL, href: "https://github.com/Kelvis123456/aura-novel", icon: "github" }],
    gallery: ["/images/aura-novel/editor.png", "/images/aura-novel/menu.png", "/images/aura-novel/api.png"],
    galleryAlt: {
      en: [
        "Aura Novel editor for writing a story with AI assistance",
        "Aura Novel side menu with Characters and Lore Studio, My Projects and API Settings",
        "API connection screen with endpoint, key and model fields and sliders for generation parameters",
      ],
      es: [
        "Editor de Aura Novel para escribir una historia con ayuda de IA",
        "Menú lateral de Aura Novel con Studio de Personajes y Lore, Mis Proyectos y Ajustes de API",
        "Pantalla para conectar una API compatible con OpenAI",
      ],
    },
    accentColor: "#dc143c",
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
    started: "2026-06",
    stack: ["React 19", "Vite", "TypeScript", "Tailwind CSS v4", "Framer Motion"],
    role: { en: "Solo developer", es: "Desarrollador en solitario" },
    summary: {
      en: "A recipe browsing and search app built to explore React 19 and Tailwind v4 together, with Framer Motion powering the transitions.",
      es: "Una app para explorar y buscar recetas, construida para probar React 19 y Tailwind v4 juntos, con Framer Motion en las transiciones.",
    },
    links: [
      { label: SOURCE_LABEL, href: "https://github.com/Kelvis123456/recetas-app", icon: "github" },
      {
        label: { en: "Open the live app", es: "Abrir la app en vivo" },
        href: "https://recetas-app.vercel.app",
        icon: "external",
      },
    ],
    gallery: ["/images/recetas-app/home.png"],
    galleryAlt: {
      en: ["Recipes app home screen with recipe cards"],
      es: ["Pantalla de inicio de la app de recetas con tarjetas de recetas"],
    },
    accentColor: "#b5793f",
  },
  {
    slug: "reservaya",
    title: "ReservaYa",
    tagline: {
      en: "Sports venue booking platform with a hybrid SQL/NoSQL backend",
      es: "Plataforma de reservas de canchas deportivas con backend híbrido SQL/NoSQL",
    },
    kind: "software",
    category: "software",
    status: "live",
    featured: true,
    started: "2026-08",
    stack: [
      "Node.js",
      "Express",
      "PostgreSQL",
      "Sequelize",
      "MongoDB",
      "Mongoose",
      "React",
      "Vite",
      "Tailwind CSS",
      "Docker",
    ],
    role: { en: "Full-stack developer", es: "Desarrollador full-stack" },
    summary: {
      en: "A court-booking platform (soccer, basketball, tennis) built to demonstrate a deliberate hybrid database architecture: PostgreSQL for data that needs strict integrity, MongoDB for flexible, high-write data, with real overlap-safe booking and a tested REST API, not just a CRUD demo.",
      es: "Una plataforma de reservas de canchas (fútbol, baloncesto, tenis) construida para demostrar una arquitectura híbrida de bases de datos deliberada: PostgreSQL para los datos que necesitan integridad estricta, MongoDB para datos flexibles y de alta escritura, con reservas realmente a prueba de solapamiento y una API REST probada, no solo un CRUD de ejemplo.",
    },
    problem: {
      en: "Booking systems need strict integrity for schedules and reservations (two people can never book the same court at the same hour), but they also generate flexible, high-volume data like reviews and per-event notifications that don't fit a rigid relational schema.",
      es: "Los sistemas de reservas necesitan integridad estricta en horarios y reservas (dos personas nunca deben poder reservar la misma cancha a la misma hora), pero también generan datos flexibles y de alto volumen, como reseñas y notificaciones por evento, que no calzan en un schema relacional rígido.",
    },
    solution: {
      en: "PostgreSQL (via Sequelize) models users, venues, weekly schedules, and reservations, with row-level locking inside a transaction so two overlapping bookings can never both succeed. MongoDB (via Mongoose) stores reviews and per-event notifications, whose shape genuinely varies by event type.",
      es: "PostgreSQL (vía Sequelize) modela usuarios, canchas, horarios semanales y reservas, con bloqueo a nivel de fila dentro de una transacción para que dos reservas que se solapen nunca puedan completarse ambas. MongoDB (vía Mongoose) almacena reseñas y notificaciones por evento, cuya forma realmente varía según el tipo de evento.",
    },
    architectureHighlights: {
      en: [
        "Booking creation runs inside a Postgres transaction with row-level locks that re-check for time-range overlap right before committing, closing the read/write race window instead of relying on a unique constraint alone",
        "Availability endpoint derives free/booked hour slots per day directly from the venue's weekly Schedule rows minus its active reservations, with no separate cache to keep in sync",
        "A MongoDB aggregation pipeline computes each venue's average rating and review count on read, merged in-app with the Postgres venue record",
        "Domain events (reservation created/confirmed/cancelled, review received) write structured notifications into MongoDB, each with a free-form metadata field that differs by event type",
        "76 backend tests (Vitest + Supertest) against a real Postgres/MongoDB test database, weighted toward negative paths: 401/403/404/409/400 on every route, not just the happy path",
        "24 frontend tests (Vitest + React Testing Library) covering auth-context edge cases (invalid token, failed login) and role-gated route redirects",
      ],
      es: [
        "La creación de una reserva corre dentro de una transacción de Postgres con bloqueo a nivel de fila que re-verifica el solapamiento de horario justo antes de confirmar, cerrando la ventana de carrera entre leer y escribir en vez de depender solo de una restricción única",
        "El endpoint de disponibilidad calcula los bloques libres/ocupados de cada día directamente desde el horario semanal de la cancha menos sus reservas activas, sin caché aparte que mantener sincronizado",
        "Un pipeline de agregación de MongoDB calcula la calificación promedio y el conteo de reseñas de cada cancha al leer, combinado en la app con el registro de la cancha en Postgres",
        "Los eventos de dominio (reserva creada/confirmada/cancelada, reseña recibida) escriben notificaciones estructuradas en MongoDB, cada una con un campo de metadata libre que cambia según el tipo de evento",
        "76 tests de backend (Vitest + Supertest) contra una base de datos de prueba real en Postgres/MongoDB, con peso hacia los caminos negativos: 401/403/404/409/400 en cada ruta, no solo el camino feliz",
        "24 tests de frontend (Vitest + React Testing Library) que cubren casos de borde del contexto de autenticación (token inválido, login fallido) y redirecciones de rutas protegidas por rol",
      ],
    },
    metrics: [
      { label: { en: "Backend tests", es: "Tests de backend" }, value: "76 (unit + integration)" },
      { label: { en: "Frontend tests", es: "Tests de frontend" }, value: "24" },
    ],
    links: [
      { label: SOURCE_LABEL, href: "https://github.com/Kelvis123456/reservaya", icon: "github" },
      {
        label: { en: "Open the live app", es: "Abrir la app en vivo" },
        href: "https://reservaya-frontend.onrender.com",
        icon: "external",
      },
    ],
    gallery: ["/images/reservaya/home.png", "/images/reservaya/venues.png", "/images/reservaya/detail.png"],
    galleryAlt: {
      en: [
        "ReservaYa landing page with a search box to find a sports court",
        "List of sports venues available to book",
        "Detail page of a tennis club with the hourly availability picker and the booking card",
      ],
      es: [
        "Página de inicio de ReservaYa con buscador para encontrar una cancha",
        "Lista de sedes deportivas disponibles para reservar",
        "Detalle de un club de tenis con el selector de horarios por hora y la tarjeta de reserva",
      ],
    },
    accentColor: "#0f9d70",
  },
  {
    slug: "pc-marketplace",
    title: "PC Marketplace",
    tagline: {
      en: "The same marketplace domain, built twice",
      es: "El mismo dominio de marketplace, construido dos veces",
    },
    kind: "software",
    category: "software",
    status: "live",
    featured: false,
    started: "2026-08",
    stack: ["Python", "React 19", "TypeScript", "Vite"],
    role: { en: "Solo developer", es: "Desarrollador en solitario" },
    summary: {
      en: "A PC component marketplace (GPU/CPU/RAM stock and orders) implemented twice, independently: a Spanish-language Python console app with an in-memory domain model, and a separate React/TypeScript SPA that reimplements the same domain logic from scratch and persists it to localStorage. The two don't talk to each other. There is no shared backend.",
      es: "Un marketplace de componentes de PC (stock y pedidos de GPU/CPU/RAM) implementado dos veces, de forma independiente: una app de consola en Python con un modelo de dominio en memoria, y una SPA separada en React/TypeScript que reimplementa la misma lógica de dominio desde cero y la persiste en localStorage. Ninguna de las dos se comunica con la otra. No comparten backend.",
    },
    problem: {
      en: 'Wanted to compare the same domain (components with stock, and orders that must reserve stock "all or nothing") across a quick Python console script and a proper TypeScript SPA, without letting one lean on the other.',
      es: 'Quería comparar el mismo dominio (componentes con stock, y pedidos que deben reservar stock "todo o nada") entre un script rápido de consola en Python y una SPA propiamente hecha en TypeScript, sin dejar que una dependiera de la otra.',
    },
    solution: {
      en: "Each side owns its own domain model and validation. The Python `Marketplace` class checks accumulated stock across every item before committing an order; the TypeScript port re-derives that same rule independently, with a full UI on top (catalog, order placement, order history with cancellation that returns stock, a stock gauge).",
      es: "Cada lado tiene su propio modelo de dominio y su propia validación. La clase `Marketplace` en Python verifica el stock acumulado de cada item antes de confirmar un pedido; el port en TypeScript re-implementa esa misma regla de forma independiente, con una UI completa encima (catálogo, registro de pedidos, historial con cancelación que devuelve el stock, y un indicador de stock).",
    },
    links: [
      { label: SOURCE_LABEL, href: "https://github.com/Kelvis123456/pc-marketplace", icon: "github" },
      {
        label: { en: "Open the live app", es: "Abrir la app en vivo" },
        href: "https://pc-marketplace.vercel.app",
        icon: "external",
      },
    ],
    gallery: ["/images/pc-marketplace/catalog.png"],
    galleryAlt: {
      en: [
        "PC components catalog with a search box and cards showing price and stock for a GPU, CPU, RAM, SSD and PSU",
      ],
      es: [
        "Catálogo de componentes de PC con buscador y tarjetas con precio y existencias de GPU, CPU, RAM, SSD y fuente",
      ],
    },
    accentColor: "#3b82c4",
  },
  {
    slug: "connect5",
    title: "Connect5",
    tagline: {
      en: "A five-in-a-row board game with real online multiplayer",
      es: "Un juego de mesa de conecta 5 con multijugador online real",
    },
    kind: "software",
    category: "game",
    status: "live",
    featured: false,
    started: "2026-07",
    stack: ["Unity 6", "C#", "Netcode for GameObjects", "Unity Relay"],
    role: { en: "Solo developer", es: "Desarrollador en solitario" },
    summary: {
      en: "A five-in-a-row board game with a local AI opponent and real online multiplayer. Peer connection is handled through Unity Relay so there's no port forwarding, no dedicated server to run.",
      es: "Un juego de mesa de conecta 5 en línea con un oponente de IA local y multijugador online real. La conexión entre pares se maneja vía Unity Relay, así que no hace falta abrir puertos ni correr un servidor dedicado.",
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
    links: [
      { label: SOURCE_LABEL, href: "https://github.com/Kelvis123456/connect5", icon: "github" },
      { label: { en: "Play it", es: "Jugar" }, href: "https://connect5.vercel.app", icon: "external" },
    ],
    gallery: ["/images/connect5/lobby.png", "/images/connect5/gameplay.png"],
    galleryAlt: {
      en: [
        "Connect5 main menu with Local, vs AI and Online modes",
        "Connect5 ten-by-ten board with the first piece dropped and Player 2 to move",
      ],
      es: [
        "Menú principal de Connect5 con los modos Local, vs IA y Online",
        "Tablero de Connect5 de diez por diez con la primera ficha caída y turno del Jugador 2",
      ],
    },
    accentColor: "#3568c9",
  },
  {
    slug: "brick-breaker",
    title: "Brick Breaker",
    tagline: {
      en: "A browser brick breaker with a boss fight, built on a plain canvas",
      es: "Un brick breaker de navegador con jefe final, hecho sobre un canvas simple",
    },
    kind: "software",
    category: "game",
    status: "live",
    featured: false,
    started: "2026-09",
    stack: ["TypeScript", "Canvas 2D", "Web Audio API", "Vite", "Vitest", "Playwright"],
    role: { en: "Solo developer", es: "Desarrollador en solitario" },
    summary: {
      en: "Started as a 30-minute technical assessment, then finished properly: six levels ending in a boss that patrols behind metal bricks, six power-ups (lasers and a fireball among them), combo scoring and a top-5 scoreboard. No game engine and no audio files: sound effects are synthesized in the browser.",
      es: "Empezó como una prueba técnica de 30 minutos y después lo terminé bien: seis niveles que acaban en un jefe que patrulla detrás de ladrillos de metal, seis power-ups (entre ellos láser y bola de fuego), puntaje por combos y una tabla de los 5 mejores. Sin motor de juego y sin archivos de audio: los efectos de sonido se sintetizan en el navegador.",
    },
    problem: {
      en: "The first version moved the ball a fixed distance per frame, so it ran more than twice as fast on a 144Hz monitor as on a 60Hz one. And collision code in a canvas game is easy to get subtly wrong: balls stuck inside bricks, or bounced back into a brick they were already leaving.",
      es: "La primera versión movía la bola una distancia fija por frame, así que en un monitor de 144Hz iba a más del doble de velocidad que en uno de 60Hz. Y el código de colisiones de un juego en canvas es fácil de hacer mal sin notarlo: bolas atrapadas dentro de un ladrillo, o rebotadas de vuelta hacia uno del que ya estaban saliendo.",
    },
    solution: {
      en: "Physics runs on a fixed 120Hz step regardless of frame rate, and all collision, bounce and scoring logic lives in a DOM-free module with unit tests. One test sweeps a grid of positions around a brick to check that the corrected position never still overlaps it.",
      es: "La física corre a un paso fijo de 120Hz sin importar los FPS, y toda la lógica de colisiones, rebotes y puntaje vive en un módulo sin DOM con tests unitarios. Uno de ellos recorre una grilla de posiciones alrededor de un ladrillo para comprobar que la posición corregida nunca lo sigue tocando.",
    },
    architectureHighlights: {
      en: [
        "Fixed-timestep physics: same speed on 60Hz and 144Hz screens, and no tunneling at top speed",
        "Levels defined as plain strings ('.' empty, '1'-'3' hits, '#' metal), each one checked by a test to be clearable",
        "Saved scores treated as untrusted input: validated on load and rendered as text, never HTML",
        "Playwright tests on desktop and mobile covering the boss fight, power-ups and the scoreboard",
        "Built for phones too: touch drags the paddle relatively so the thumb never hides the ball, and reduced motion turns off screen shake",
      ],
      es: [
        "Física con paso fijo: misma velocidad en pantallas de 60Hz y 144Hz, y sin atravesar ladrillos a máxima velocidad",
        "Niveles definidos como texto plano ('.' vacío, '1'-'3' golpes, '#' metal), y un test comprueba que cada uno se puede completar",
        "Los puntajes guardados se tratan como datos no confiables: se validan al cargar y se muestran como texto, nunca como HTML",
        "Tests de Playwright en escritorio y móvil que cubren el jefe, los power-ups y la tabla de puntajes",
        "Pensado también para móvil: el dedo arrastra la paleta de forma relativa para no tapar la bola, y con movimiento reducido se apaga el temblor de pantalla",
      ],
    },
    metrics: [
      { label: { en: "Tests", es: "Tests" }, value: "54 unit + 25 e2e" },
      { label: { en: "Levels", es: "Niveles" }, value: "6 + boss loop" },
      { label: { en: "Bundle", es: "Bundle" }, value: "~8KB gzipped" },
    ],
    links: [
      { label: { en: "Play it", es: "Jugar" }, href: "https://brick-breaker-kelvis.vercel.app", icon: "external" },
      { label: SOURCE_LABEL, href: "https://github.com/Kelvis123456/brick-breaker", icon: "github" },
    ],
    gallery: [
      "/images/brick-breaker/boss.png",
      "/images/brick-breaker/fireball.png",
      "/images/brick-breaker/gameplay.png",
    ],
    galleryAlt: {
      en: [
        "Brick Breaker boss fight",
        "Brick Breaker level 3 with flaming balls clearing bricks and a x7 combo",
        "Brick Breaker level 1 with a FIREBALL! pickup, falling power-up capsules and a x5 combo",
      ],
      es: [
        "Pelea contra el jefe en Brick Breaker",
        "Brick Breaker nivel 3 con bolas de fuego rompiendo ladrillos y un combo x7",
        "Brick Breaker nivel 1 con un FIREBALL! recién recogido, cápsulas de power-up cayendo y un combo x5",
      ],
    },
    accentColor: "#7c5cff",
  },
  {
    slug: "detective-game",
    title: "Detective Game",
    tagline: {
      en: "A narrative detective game built to out-design a viral mobile hit",
      es: "Un juego narrativo de detective construido para superar en diseño a un hit móvil viral",
    },
    kind: "software",
    category: "game",
    status: "live",
    featured: false,
    started: "2026-07",
    stack: ["React 19", "TypeScript", "Vite", "Zustand", "Framer Motion", "Web Audio API", "Vitest"],
    role: { en: "Solo developer", es: "Desarrollador en solitario" },
    summary: {
      en: "Investigate crime scenes, recover evidence off a suspect's actual phone, interrogate suspects, connect evidence to a suspect on a corkboard, and build a real means/motive/opportunity case across four full cases, each with its own set-dressed crime scene, procedurally-generated suspect portraits, and a fully synthesized audio engine (zero recorded samples).",
      es: "Investiga escenas del crimen, recupera evidencia del teléfono real de un sospechoso, interroga sospechosos, conecta evidencia a un sospechoso en un corcho, y arma un caso real de medios/móvil/oportunidad a lo largo de cuatro casos completos, cada uno con su propia escena decorada, retratos de sospechosos generados proceduralmente, y un motor de audio 100% sintetizado (cero samples grabados).",
    },
    problem: {
      en: "A wave of mobile games built entirely around reading a stranger's simulated phone had gone viral. I already had a detective game with three layers that genre skips (a physical crime scene, an interrogation system, an evidence board). The gap was that the phone/PIN/messaging mechanic those games built their whole identity on didn't exist here yet, and closing it had to be done with an entirely original app ecosystem, icons, and UI.",
      es: "Una ola de juegos móviles construidos enteramente alrededor de leer el teléfono simulado de un desconocido se había vuelto viral. Yo ya tenía un juego de detective con tres capas que ese género se salta (una escena física, un sistema de interrogatorio, un tablero de evidencia). El hueco era que la mecánica de teléfono/PIN/mensajería sobre la que esos juegos construyeron toda su identidad no existía todavía aquí, y había que cerrarlo con un ecosistema de apps, íconos y UI completamente originales.",
    },
    solution: {
      en: "Built a real digital-forensics layer from scratch, with its own invented app ecosystem (ChatVía, Anotta, Vozal, NubePlus) inside an actual phone frame with alternating chat bubbles, plus a means/motive/opportunity accusation system with four distinct endings, a narrative tension mechanic that can permanently lock evidence if the player stalls, and a connectable evidence board. None of it was bolted onto the old architecture; the same CaseEngine/EvidenceEngine/InterrogationEngine from the original build still drive it, extended, not replaced.",
      es: "Construí una capa real de forensia digital desde cero, con su propio ecosistema de apps inventadas (ChatVía, Anotta, Vozal, NubePlus) dentro de un marco de teléfono real con burbujas de chat alternadas, además de un sistema de acusación por medios/móvil/oportunidad con cuatro finales distintos, una mecánica de tensión narrativa que puede bloquear evidencia para siempre si el jugador se demora, y un tablero de evidencia conectable. Nada de esto se le pegó con cinta a la arquitectura vieja; el mismo CaseEngine/EvidenceEngine/InterrogationEngine del build original sigue impulsándolo, extendido, no reemplazado.",
    },
    architectureHighlights: {
      en: [
        "CaseEngine, EvidenceEngine, InterrogationEngine, DigitalForensicsEngine, and RankEngine decoupled from the 9-scene UI flow (MainMenu → CaseSelection → CaseIntro → CrimeScene → Interrogation → EvidenceBoard → DigitalForensics → Accusation → Resolution)",
        "4 full cases implemented as data, independent of the engines that run them: one built entirely around digital evidence recovered from a victim's phone",
        "Means/motive/opportunity accusation system with 4 distinct endings, backed by a data-integrity test that every piece of evidence is actually obtainable and no tension-lock can cut off the only path to something the case requires",
        "A tension mechanic that can permanently lock a digital thread/note if the player stalls too long, always with a redundant dialogue path, enforced by an automated test, not just careful authoring",
        "A connectable evidence board (tap evidence, tap a suspect, a real SVG string connects them from live DOM positions) scored against the case's actual solution at Resolution",
        "16 procedurally-generated SVG suspect portraits, every trait (skin tone, hair, clothing, accessories) derived from a hash of the suspect's id, so the same suspect always renders the same face with nothing copied from anywhere",
        "A synthesized audio engine (oscillators/filters/noise buffers, zero recorded samples) with per-scene ambient beds and a distinct chord for each of the 4 resolution endings",
        "Zustand for global game state, Framer Motion for scene transitions, 444 Vitest tests including store-level audio side effects verified with spies",
      ],
      es: [
        "CaseEngine, EvidenceEngine, InterrogationEngine, DigitalForensicsEngine y RankEngine desacoplados del flujo de UI de 9 escenas (MainMenu → CaseSelection → CaseIntro → CrimeScene → Interrogation → EvidenceBoard → DigitalForensics → Accusation → Resolution)",
        "4 casos completos implementados como datos, independientes de los motores que los ejecutan: uno construido enteramente alrededor de evidencia digital recuperada del teléfono de una víctima",
        "Sistema de acusación por medios/móvil/oportunidad con 4 finales distintos, respaldado por un test de integridad de datos que verifica que toda evidencia sea realmente obtenible y que ningún bloqueo de tensión corte la única ruta a algo que el caso exige",
        "Una mecánica de tensión que puede bloquear para siempre un hilo/nota digital si el jugador se demora demasiado, siempre con una ruta de diálogo redundante, forzada por un test automático, no solo por cuidado al escribir el contenido",
        "Un tablero de evidencia conectable (toca evidencia, toca un sospechoso, un hilo SVG real los conecta desde posiciones reales del DOM) evaluado contra la solución real del caso en la Resolución",
        "16 retratos de sospechosos en SVG generados proceduralmente, cada rasgo (tono de piel, pelo, ropa, accesorios) derivado de un hash del id del sospechoso, así el mismo sospechoso siempre da la misma cara sin copiar nada de ningún lado",
        "Un motor de audio sintetizado (osciladores/filtros/buffers de ruido, cero samples grabados) con ambientes por escena y un acorde distinto para cada uno de los 4 finales de resolución",
        "Zustand para el estado global del juego, Framer Motion para las transiciones de escena, 444 tests de Vitest incluyendo efectos secundarios de audio verificados con spies a nivel de store",
      ],
    },
    metrics: [
      { label: { en: "Cases", es: "Casos" }, value: "4" },
      { label: { en: "Tests", es: "Tests" }, value: "444 (Vitest)" },
    ],
    links: [
      {
        label: { en: "Live demo", es: "Demo en vivo" },
        href: "https://detective-game-kelvis-g.vercel.app",
        icon: "external",
      },
      { label: SOURCE_LABEL, href: "https://github.com/Kelvis123456/detective-game", icon: "github" },
    ],
    gallery: [
      "/images/detective-game/digital-forensics.png",
      "/images/detective-game/connections.png",
      "/images/detective-game/interrogation.png",
      "/images/detective-game/crimescene.png",
      "/images/detective-game/menu.png",
    ],
    galleryAlt: {
      en: [
        "Digital forensics puzzle in the detective game",
        "Evidence connections board linking clues",
        "Interrogation scene with dialogue choices",
        "Crime scene with clickable evidence",
        "Detective game main menu",
      ],
      es: [
        "Puzzle de forense digital en el juego de detectives",
        "Tablero de conexiones que une pistas de evidencia",
        "Escena de interrogatorio con opciones de diálogo",
        "Escena del crimen con evidencia seleccionable",
        "Menú principal del juego de detectives",
      ],
    },
    accentColor: "#8a6a3a",
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
    status: "in-development",
    featured: false,
    started: "2026-07",
    stack: ["Unity 6", "URP", "C#"],
    role: { en: "Game designer / solo studio", es: "Diseñador de juegos / estudio en solitario" },
    summary: {
      en: '"Your past already knows the answer." A mobile roguelite where every action creates an echo that replays your movements. Combined with bullet-time, you coordinate your present with your own past to solve rooms. Past the design phase now: a real, playable Unity project with 3 full zones, 3 bosses, ethical monetization, and accessibility settings, plus a first real Android build.',
      es: '"Tu pasado ya sabe la respuesta." Un roguelite móvil donde cada acción crea un eco que repite tus movimientos. Combinado con bullet-time, coordinas tu presente con tu propio pasado para resolver las salas. Ya pasó la fase de diseño: un proyecto Unity real y jugable con 3 zonas completas, 3 bosses, monetización ética y ajustes de accesibilidad, más un primer build de Android real.',
    },
    process: {
      en: [
        "Market research across the mobile games market, identifying an underserved niche in physics-driven roguelites",
        "35 concepts generated and narrowed to 5 finalists, then 1 approved design",
        "Full Game Design Document: core loop, progression, economy, accessibility",
        "Art direction: pixel art at 480×270, echo shader system, full style guide",
        "Technical architecture: Service Locator + ScriptableObject events, per-layer time scales for bullet-time",
        "Vertical Slice: a real playable Unity 6 project, not just a plan: echo record/playback, bullet-time, and hand-made pixel art",
        "Full production build-out: all 3 zones (50 rooms), all 3 bosses with their complete 3-phase structure, a 29-node meta-progression tree, and all 12 run upgrades wired to real gameplay effects",
        "Ethical monetization shipped for real: ad removal, 4 premium cosmetic skins, and a Season Pass, all layered on top of a purchase-provider abstraction ready for the real store SDKs",
        "Accessibility settings connected to actual gameplay: a colorblind mode that remaps echo colors, and adjustable bullet-time echo speed/charge time, all from a real in-game Options screen",
        "GDPR data rights (export/delete) and a first real (unsigned) Android APK build from the same project",
        "8 run modifiers the player picks before each run, all changing real gameplay: mirrored rooms, faster echoes, fog, double-strength or disabled bullet-time for bonus crystals, echoes only visible in bullet-time, and a short 2-room run",
      ],
      es: [
        "Investigación de mercado en el sector de juegos móviles, identificando un nicho desatendido en roguelites basados en física",
        "35 conceptos generados, reducidos a 5 finalistas, y luego 1 diseño aprobado",
        "Game Design Document completo: loop central, progresión, economía, accesibilidad",
        "Dirección de arte: pixel art a 480×270, sistema de shader de ecos, guía de estilo completa",
        "Arquitectura técnica: Service Locator + eventos ScriptableObject, escalas de tiempo por capa para el bullet-time",
        "Vertical Slice: un proyecto Unity 6 real y jugable, no solo un plan: grabación/reproducción de ecos, bullet-time y pixel art hecho a mano",
        "Producción completa: las 3 zonas (50 salas), los 3 bosses con su estructura completa de 3 fases, un árbol de meta-progresión de 29 nodos, y los 12 upgrades de run conectados a efectos reales de gameplay",
        "Monetización ética implementada de verdad: modo sin anuncios, 4 skins cosméticas Premium, y un Season Pass, todo sobre una abstracción de proveedor de compra lista para los SDKs reales de tienda",
        "Accesibilidad conectada a gameplay real: un modo daltónico que remapea los colores de los ecos, y velocidad/tiempo de carga de bullet-time ajustables, todo desde una pantalla de Opciones real dentro del juego",
        "Derechos GDPR (exportar/eliminar datos) y un primer build de Android real (APK sin firmar) desde el mismo proyecto",
        "8 modificadores de run que el jugador elige antes de cada partida, todos con efecto real en el gameplay: salas en espejo, ecos más rápidos, niebla, bullet-time doble o desactivado a cambio de más cristales, ecos visibles solo en bullet-time, y una run corta de 2 salas",
      ],
    },
    metrics: [
      { label: { en: "Design docs", es: "Documentos de diseño" }, value: "14 files, ~864KB" },
      { label: { en: "Unity scripts", es: "Scripts de Unity" }, value: "54" },
    ],
    links: [{ label: SOURCE_LABEL, href: "https://github.com/Kelvis123456/phase-game-design", icon: "github" }],
    gallery: [
      "/images/phase/echoes-bullet-time.png",
      "/images/phase/boss-espejo.png",
      "/images/phase/zone3-abismo.png",
      "/images/phase/menu.png",
      "/images/phase/shop.png",
      "/images/phase/options.png",
    ],
    galleryAlt: {
      en: [
        "PHASE level where the player jumps next to two colored echoes of past runs, with red barriers on the platform",
        "Prototype of the first boss room, El Espejo Fragmentado: mirror panels each with a lever in front of it, three colored echoes and the white player figure on a long platform",
        "Prototype of Zone 3, the Abyss, on a black and purple background: the player and two echoes next to a red barrier",
        "PHASE main menu with the Play, Achievements, My Echoes and Quit options",
        "PHASE My Echoes screen with skin slots for five echoes and a direct-purchase list",
        "PHASE options screen with colorblind mode, echo bullet-time speed and charge time",
      ],
      es: [
        "Nivel de PHASE donde el jugador salta junto a dos ecos de colores de intentos anteriores, con barreras rojas en la plataforma",
        "Prototipo de la sala del primer jefe, El Espejo Fragmentado: paneles de espejo con una palanca delante de cada uno, tres ecos de colores y la figura blanca del jugador en una plataforma larga",
        "Prototipo de la Zona 3, el Abismo, sobre fondo negro y morado: el jugador y dos ecos junto a una barrera roja",
        "Menú principal de PHASE con las opciones Jugar, Logros, Mis Ecos y Salir",
        "Pantalla Mis Ecos de PHASE con ranuras de skin para cinco ecos y una lista de compra directa",
        "Pantalla de opciones de PHASE con modo daltónico, velocidad de ecos en bullet-time y tiempo de carga",
      ],
    },
    accentColor: "#5b6b8c",
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
    status: "in-development",
    featured: false,
    started: "2026-07",
    stack: ["Unity 6", "URP", "C#"],
    role: { en: "Game designer / solo studio", es: "Diseñador de juegos / estudio en solitario" },
    summary: {
      en: '"One stone. One flick. The whole ocean." A physics-driven stone-skipping game aiming for best-in-class mobile arcade polish: a full, playable Unity prototype with a real menu flow, day/night ocean art, procedural audio, and live Spanish/English localization.',
      es: '"Una piedra. Un flick. El océano entero." Un juego de rebote de piedras basado en física, apuntando al pulido de las mejores arcade móviles: un prototipo completo y jugable en Unity con flujo de menús real, arte de océano nocturno, audio procedural y localización español/inglés en vivo.',
    },
    process: {
      en: [
        "Market research and concept generation, merging two finalist ideas into SKIM",
        "Full GDD across 11 phases, art direction per weather tier, tech stack selection",
        "Working Unity prototype: 48 C# scripts across audio, camera, physics, economy, and UI systems",
        "Wired the documented night-ocean art direction into real shaders and per-stone geometry, and built the full menu flow (collection, climate, daily challenge, settings) from the UX spec",
        "Full visual/UX polish pass: redesigned the HUD and results panel, added real typography and cross-fade panel transitions, gave every stone/climate a color-coded thumbnail, wrote a fully procedural audio system (no imported sound files), and shipped live Spanish/English localization across every screen",
      ],
      es: [
        "Investigación de mercado y generación de conceptos, fusionando dos ideas finalistas en SKIM",
        "GDD completo a lo largo de 11 fases, dirección de arte por nivel climático, selección de stack técnico",
        "Prototipo real en Unity: 48 scripts C# entre audio, cámara, física, economía y sistemas de UI",
        "Se conectó la dirección de arte del océano nocturno a shaders reales y geometría propia por piedra, y se construyó el flujo completo de menús (colección, clima, desafío diario, configuración) a partir de la especificación UX",
        "Pasada completa de pulido visual/UX: rediseño del HUD y panel de resultados, tipografía real y transiciones con fundido entre paneles, miniaturas de color por piedra/clima, un sistema de audio totalmente procedural (sin archivos de sonido importados), y localización español/inglés en vivo en toda la interfaz",
      ],
    },
    metrics: [
      { label: { en: "Design docs", es: "Documentos de diseño" }, value: "13 files, ~250KB" },
      { label: { en: "Unity scripts", es: "Scripts de Unity" }, value: "48" },
      { label: { en: "Languages", es: "Idiomas" }, value: "ES / EN" },
    ],
    links: [{ label: SOURCE_LABEL, href: "https://github.com/Kelvis123456/skim-game-design", icon: "github" }],
    coverFit: "contain",
    gallery: ["/images/skim/gameplay.png", "/images/skim/menu.png", "/images/skim/collection.png"],
    galleryAlt: {
      en: [
        "SKIM at launch with the aiming ring on the water, the moon above and the score at 0",
        "SKIM main menu",
        "SKIM stone collection screen",
      ],
      es: [
        "SKIM al lanzar, con el aro de puntería sobre el agua, la luna arriba y el marcador en 0",
        "Menú principal de SKIM",
        "Pantalla de colección de piedras de SKIM",
      ],
    },
    accentColor: "#00c4cc",
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
    status: "in-development",
    featured: false,
    started: "2026-07",
    stack: ["Godot 4 (GDScript)", "HTML/CSS/JS prototype", "Web Audio API"],
    role: { en: "Game designer / solo studio", es: "Diseñador de juegos / estudio en solitario" },
    summary: {
      en: "Two glowing spheres linked by an elastic tether descend an endless vertical pipeline. Hold to split wide, release to snap together. Avoid obstacles, graze them for combo, collect Volt Crystals.",
      es: "Dos esferas brillantes unidas por un tether elástico descienden por una tubería vertical infinita. Mantén presionado para separarlas, suelta para juntarlas. Esquiva obstáculos, róznalos para hacer combo, y recolecta Volt Crystals.",
    },
    process: {
      en: [
        "Full Game Design Document: core loop, progression via Volt Crystals, ethics-first monetization",
        "Engine evaluation across 6 stacks; selected Godot 4 for production (low input latency, native 2D shaders, ~12MB builds)",
        "Working browser vertical slice validated the split/merge tether feel before committing to the full engine port, with synthesized audio, localStorage persistence, local leaderboard, consistent colorblind support",
        "Ported the full game to Godot 4: the core mechanic, an AES-256 encrypted save system, a real shop economy, achievements with live progress tracking, daily missions, and a guided tutorial",
        "Implemented the VFX the design doc always called for but neither build ever had: tapering tether trails, a snap-flash shockwave on merge, a particle shatter burst on crash",
        "Built a signed Android debug APK and played it end-to-end on an emulator with real GPU acceleration, including tracking down and fixing a renderer-specific rendering bug along the way",
      ],
      es: [
        "Game Design Document completo: loop central, progresión vía Volt Crystals, monetización ética",
        "Evaluación de 6 motores; se eligió Godot 4 para producción (baja latencia de input, shaders 2D nativos, builds de ~12MB)",
        "Vertical slice jugable en navegador validó la sensación de separar/unir el tether antes de comprometerse al port completo, con audio sintetizado, persistencia con localStorage, leaderboard local, soporte colorblind consistente",
        "Port completo del juego a Godot 4: la mecánica central, guardado cifrado AES-256, una tienda real, logros con progreso en vivo, misiones diarias, y un tutorial guiado",
        "Implementados los efectos visuales que el documento de diseño siempre pidió pero que ninguna versión anterior tuvo: estelas del tether, un destello de fusión, y una ráfaga de partículas al chocar",
        "Build de Android firmado, instalado y jugado de principio a fin en un emulador con aceleración GPU real, incluyendo encontrar y arreglar un bug de renderizado en el camino",
      ],
    },
    metrics: [
      { label: { en: "Design docs", es: "Documentos de diseño" }, value: "17 files, ~105KB" },
      {
        label: { en: "Godot build", es: "Build en Godot" },
        value: "Full core loop + shop + achievements, Android APK verified",
      },
    ],
    links: [{ label: SOURCE_LABEL, href: "https://github.com/Kelvis123456/neon-tether-game-design", icon: "github" }],
    coverFit: "contain",
    gallery: ["/images/neon-tether/gameplay.png", "/images/neon-tether/menu.png", "/images/neon-tether/shop.png"],
    galleryAlt: {
      en: ["Neon Tether gameplay", "Neon Tether main menu", "Neon Tether shop"],
      es: ["Partida de Neon Tether", "Menú principal de Neon Tether", "Tienda de Neon Tether"],
    },
    accentColor: "#d6266e",
  },
  {
    slug: "nocturni",
    title: "Nocturni",
    tagline: {
      en: "A premium streaming platform, built source-agnostic by design",
      es: "Una plataforma de streaming premium, diseñada para ser agnóstica de fuente",
    },
    kind: "software",
    category: "software",
    status: "in-development",
    visibility: "private",
    featured: false,
    started: "2026-09",
    stack: ["Next.js 15", "TypeScript", "Tailwind CSS", "Zustand", "Supabase", "PostgreSQL", "hls.js", "Framer Motion"],
    role: { en: "Solo developer", es: "Desarrollador en solitario" },
    summary: {
      en: "A Netflix-style streaming UI with TMDB metadata, a pluggable multi-source player (HLS + sandboxed embeds), live TV, and real Supabase-backed accounts, built with the content-sourcing layer intentionally decoupled from any specific provider.",
      es: "Un UI de streaming estilo Netflix con metadata de TMDB, un reproductor multi-fuente conectable (HLS + embeds sandboxeados), TV en vivo, y cuentas reales respaldadas por Supabase, construido con la capa de fuentes de contenido intencionalmente desacoplada de cualquier proveedor específico.",
    },
    problem: {
      en: 'A "watch everything" streaming clone is a common learning project, but most either hardcode unlicensed embed domains straight into the code, or skip authentication and persistence entirely and leave everything as local mock state.',
      es: 'Un clon de streaming "para ver de todo" es un proyecto de aprendizaje común, pero la mayoría hardcodea dominios de embeds no licenciados directamente en el código, o se salta la autenticación y persistencia por completo, dejando todo como estado simulado local.',
    },
    solution: {
      en: "The player and live-TV layers read from pluggable provider configs (JSON, populated with your own licensed sources) instead of hardcoded embed domains, and real accounts run on Supabase: Netflix-style sub-profiles, RLS-protected favorites and watch progress synced across devices, with the whole app degrading gracefully to a local-only guest mode whenever no backend is configured.",
      es: "Las capas de reproductor y TV en vivo leen de configuraciones de proveedores conectables (JSON, poblado con tus propias fuentes licenciadas) en vez de dominios de embeds hardcodeados, y las cuentas reales corren sobre Supabase: sub-perfiles estilo Netflix, favoritos y progreso de reproducción protegidos por RLS y sincronizados entre dispositivos, con toda la app degradando con gracia a un modo invitado local cuando no hay backend configurado.",
    },
    architectureHighlights: {
      en: [
        "Server Components fetch TMDB metadata directly server-side (the API token never reaches the client), with each home-page row streamed independently via Suspense so one failing category never takes down the rest of the page",
        "Custom hls.js player (quality levels, resume-from-progress, skip-intro, next-episode) alongside a sandboxed iframe path for embed sources, sharing one pluggable provider config across movies/series and live IPTV channels",
        "Supabase auth + Postgres persistence: viewer_profiles/favorites/watch_progress tables with row-level security scoped to auth.uid(), WITH CHECK on every mutating policy (not just USING), and a SECURITY DEFINER signup trigger with its direct RPC execute access explicitly revoked",
        "The Zustand store syncs against Postgres for signed-in users and transparently falls back to localStorage-only guest mode when Supabase isn't configured. No code path assumes a backend is always present",
        'A PIN-gated "+18" zone scoped to TMDB\'s own mature-content rating flag, not an actual adult-content catalog',
      ],
      es: [
        "Los Server Components obtienen la metadata de TMDB directamente del lado del servidor (el token de la API nunca llega al cliente), con cada fila de la home transmitida de forma independiente vía Suspense para que una categoría que falle nunca tumbe el resto de la página",
        "Reproductor hls.js a medida (niveles de calidad, resume de progreso, skip-intro, siguiente episodio) junto a una ruta de iframe sandboxeado para fuentes de embed, compartiendo una misma configuración de proveedores conectable entre películas/series y canales de TV en vivo",
        "Autenticación con Supabase + persistencia en Postgres: tablas viewer_profiles/favorites/watch_progress con row-level security ligada a auth.uid(), WITH CHECK en cada política mutante (no solo USING), y un trigger de registro SECURITY DEFINER con su acceso directo de ejecución por RPC explícitamente revocado",
        "El store de Zustand sincroniza contra Postgres para usuarios autenticados y cae de forma transparente a modo invitado solo-local cuando Supabase no está configurado. Ningún camino de código asume que siempre hay un backend disponible",
        'Una zona "+18" protegida por PIN, acotada a la bandera de clasificación madura propia de TMDB, no un catálogo real de contenido adulto',
      ],
    },
    links: [
      {
        label: PRIVATE_LABEL,
        href: "mailto:kelvisguerrero03@gmail.com?subject=Nocturni%20repo%20access",
        icon: "external",
      },
    ],
    gallery: ["/images/nocturni/home.png", "/images/nocturni/details-modal.png", "/images/nocturni/movies.png"],
    galleryAlt: {
      en: [
        "Nocturni home with a featured-title hero banner and a Popular Movies row",
        "Title details modal in Nocturni",
        "Movies browsing page in Nocturni",
      ],
      es: [
        "Inicio de Nocturni con un banner de título destacado y una fila de películas populares",
        "Modal de detalle de un título en Nocturni",
        "Página de exploración de películas en Nocturni",
      ],
    },
    accentColor: "#8B5CF6",
  },
  {
    slug: "dgii-helper",
    title: "dgii-helper",
    tagline: {
      en: "API that validates Dominican tax identifiers and issues invoice numbers without duplicates",
      es: "API que valida identificadores fiscales dominicanos y entrega números de comprobante sin duplicados",
    },
    kind: "software",
    category: "software",
    status: "in-development",
    featured: false,
    market: "local",
    started: "2026-11",
    stack: [".NET 10", "ASP.NET Core", "EF Core", "SQL Server", "Angular 21", "xUnit", "Testcontainers", "Docker"],
    role: { en: "Solo developer", es: "Desarrollador en solitario" },
    summary: {
      en: "An ASP.NET Core API for the two things any Dominican invoicing system needs: checking that an RNC, cédula, NCF or e-CF is well formed, and handing out NCF numbers so that none is ever repeated, even when many invoices arrive at once. It includes an Angular front end to validate identifiers and to register ranges and issue their numbers.",
      es: "Una API en ASP.NET Core para las dos cosas que necesita cualquier sistema de facturación dominicano: comprobar que un RNC, una cédula, un NCF o un e-CF tienen forma válida, y entregar números de NCF sin que ninguno se repita aunque lleguen muchas facturas a la vez. Incluye un front en Angular para validar identificadores y para registrar rangos y entregar sus números.",
    },
    problem: {
      en: "Issuing the next invoice number by reading a counter and writing it back gives the same number to two requests that arrive together. A repeated NCF is a problem with the tax authority (DGII), not only a bug.",
      es: "Entregar el siguiente número de factura leyendo un contador y escribiéndolo de nuevo da el mismo número a dos peticiones que llegan juntas. Un NCF repetido es un problema con la DGII, no solo un bug.",
    },
    solution: {
      en: "Each authorized range hands out its next number with a single UPDATE ... OUTPUT: SQL Server locks the row, adds one and returns the previous value in the same statement. Registering a range runs in a serializable transaction that rejects overlaps and retries when SQL Server aborts one as a deadlock victim.",
      es: "Cada rango autorizado entrega su siguiente número con un solo UPDATE ... OUTPUT: SQL Server bloquea la fila, suma uno y devuelve el valor anterior en la misma sentencia. Registrar un rango corre en una transacción serializable que rechaza solapes y reintenta cuando SQL Server aborta una por deadlock.",
    },
    architectureHighlights: {
      en: [
        "40 simultaneous requests on a 40-number range receive 40 distinct, consecutive numbers. On a smaller range the extra requests get a 409 and nobody receives a repeated number",
        "RNC check digit is a weighted sum modulo 11, tested with hand-computed vectors. The cédula uses Luhn and is compared against an independent Luhn implementation over 20,000 numbers",
        "Tests run against a real SQL Server with Testcontainers. I broke the implementation on purpose (read-then-write issuing, a lower isolation level, wrong weights) and the suite caught each one",
        "Write endpoints need an API key compared in constant time, and the app refuses to start in production without one. There is a per-IP rate limit",
        "The Angular front end uses signals and standalone components, with 52 tests. I ran it in a browser against the real API: registered a 3-number range, issued all 3, saw the button switch to exhausted, and saw a wrong key produce the 401 message",
        "A bug I found on the way: EF wraps the deadlock error two levels deep, so my first retry never ran. It now walks the whole exception chain",
      ],
      es: [
        "40 peticiones simultáneas sobre un rango de 40 números reciben 40 números distintos y seguidos. En un rango más chico las que sobran reciben 409 y nadie recibe un número repetido",
        "El dígito verificador del RNC es una suma ponderada módulo 11, probada con vectores calculados a mano. La cédula usa Luhn y se compara contra una implementación independiente de Luhn en 20 000 números",
        "Los tests corren contra un SQL Server real con Testcontainers. Rompí la implementación a propósito (emitir leyendo y luego escribiendo, un aislamiento más bajo, pesos equivocados) y la suite detectó cada una",
        "Los endpoints que escriben piden una clave de API comparada en tiempo constante, y la app no arranca en producción sin ella. Hay un límite de peticiones por IP",
        "El front en Angular usa señales y componentes standalone, con 52 tests. Lo corrí en un navegador contra la API real: registré un rango de 3 números, entregué los 3, vi el botón pasar a agotado y vi que una clave incorrecta muestra el aviso de 401",
        "Un bug que encontré en el camino: EF envuelve el error de deadlock dos niveles adentro, así que mi primer reintento nunca corría. Ahora recorre toda la cadena de excepciones",
      ],
    },
    notDoneYet: {
      en: "Not deployed anywhere. It does not query the DGII registry, validate e-CF XML or sign and send documents; it only checks that identifiers have a valid form.",
      es: "No está desplegado en ningún lado. No consulta el padrón de la DGII, no valida el XML de un e-CF ni firma y envía documentos; solo comprueba que los identificadores tengan forma válida.",
    },
    metrics: [
      { label: { en: "API tests", es: "Tests de la API" }, value: "113, against a real SQL Server" },
      { label: { en: "Front-end tests", es: "Tests del front" }, value: "52" },
    ],
    gallery: ["/images/dgii-helper/validar.png", "/images/dgii-helper/rangos.png"],
    galleryAlt: {
      en: [
        "dgii-helper validation screen rejecting an RNC because the check digit does not match the other eight",
        "dgii-helper ranges screen after issuing all three numbers of a range: the button reads exhausted and the issued NCFs are listed",
      ],
      es: [
        "Pantalla de validación de dgii-helper rechazando un RNC porque el dígito verificador no coincide con los otros ocho",
        "Pantalla de rangos de dgii-helper tras entregar los tres números de un rango: el botón dice agotado y se listan los NCF entregados",
      ],
    },
    links: [
      {
        label: SOURCE_LABEL,
        href: "https://github.com/Kelvis123456/dgii-helper",
        icon: "github",
      },
    ],
  },
  {
    slug: "codigo-trabajo-rag",
    title: "codigo-trabajo-rag",
    tagline: {
      en: "Ask the Dominican Labor Code a question and get an answer that cites its articles",
      es: "Pregunta sobre el Código de Trabajo dominicano y recibe una respuesta que cita sus artículos",
    },
    kind: "software",
    category: "software",
    status: "in-development",
    featured: false,
    market: "local",
    started: "2026-11",
    stack: [".NET 10", "ASP.NET Core", "Microsoft.Extensions.AI", "Gemini", "xUnit"],
    role: { en: "Solo developer", es: "Desarrollador en solitario" },
    summary: {
      en: "A retrieval-augmented question answering page over the 738 articles of the Dominican Labor Code (Law 16-92). Each answer cites the articles it came from, and a citation to an article the model was never given is flagged as unverified.",
      es: "Una página de preguntas y respuestas con recuperación sobre los 738 artículos del Código de Trabajo dominicano (Ley 16-92). Cada respuesta cita los artículos de los que salió, y una cita a un artículo que el modelo nunca recibió se marca como sin verificar.",
    },
    problem: {
      en: "A language model asked about a law answers from memory, mixes in other countries' rules and invents article numbers. For a legal text a confident wrong answer is worse than none.",
      es: "Un modelo de lenguaje al que se le pregunta por una ley responde de memoria, mezcla reglas de otros países e inventa números de artículo. En un texto legal, una respuesta segura y equivocada es peor que ninguna.",
    },
    solution: {
      en: "The official PDF is parsed into articles, each one is embedded with Gemini, and a question retrieves its five closest articles. The model only sees those five and must cite them as [Art. N]. The service then checks every cited number against the five it was given.",
      es: "El PDF oficial se parte en artículos, cada uno se convierte en un vector con Gemini y una pregunta recupera sus cinco artículos más cercanos. El modelo solo ve esos cinco y debe citarlos como [Art. N]. El servicio comprueba después cada número citado contra los cinco que recibió.",
    },
    architectureHighlights: {
      en: [
        'The PDF mixes page headers, footnotes and a footnote number glued to the article number ("Art. 7288" is article 728 plus note 8). Each article number is validated against the expected sequence, and a test checks that all 738 come out in order',
        "I wrote 21 questions and read the answering article for each in the text. Retrieval top-5: BM25 14 of 21, Gemini vectors 21 of 21, and fusing both (RRF) 20 of 21 with the right article first less often, so I kept vectors with BM25 only as a fallback",
        "The model client is an IChatClient, so the answer service is tested with a scripted fake and the CI needs no API key. Without a key the page still runs and falls back to word search",
        "POST /api/ask is rate limited per IP, rejects questions over 300 characters and never returns the provider's error message",
      ],
      es: [
        'El PDF mezcla encabezados de página, notas al pie y un número de nota pegado al del artículo ("Art. 7288" es el artículo 728 más la nota 8). Cada número de artículo se valida contra la secuencia esperada, y un test comprueba que salen los 738 en orden',
        "Escribí 21 preguntas y leí en el texto el artículo que responde a cada una. Recuperación en el top 5: BM25 14 de 21, vectores de Gemini 21 de 21, y fusionar ambos (RRF) 20 de 21 con el artículo correcto primero menos veces, así que dejé vectores con BM25 solo de respaldo",
        "El cliente del modelo es un IChatClient, así que el servicio de respuesta se prueba con un modelo falso guionado y el CI no necesita clave. Sin clave la página sigue funcionando con búsqueda por palabras",
        "POST /api/ask tiene límite por IP, rechaza preguntas de más de 300 caracteres y nunca devuelve el mensaje de error del proveedor",
      ],
    },
    notDoneYet: {
      en: "Only a static demo is online: it searches by words in the browser, with no model and no server. The answering API is not deployed. The eval measures retrieval, not whether the final answer is right, and it has only 21 questions. The citation check confirms an article was provided to the model, not that the sentence matches it. It is not legal advice, and the text may not include later reforms.",
      es: "Solo hay una demo estática en línea: busca por palabras en el navegador, sin modelo ni servidor. La API que redacta las respuestas no está desplegada. La evaluación mide la recuperación, no si la respuesta final es correcta, y tiene solo 21 preguntas. La comprobación de citas confirma que el artículo se le entregó al modelo, no que la frase coincida con él. No es asesoría legal y el texto puede no incluir reformas posteriores.",
    },
    metrics: [
      { label: { en: "Articles parsed", es: "Artículos parseados" }, value: "738" },
      { label: { en: "Retrieval top-5 (vectors)", es: "Recuperación top 5 (vectores)" }, value: "21 of 21 questions" },
      { label: { en: "Tests", es: "Tests" }, value: "41" },
    ],
    gallery: ["/images/codigo-trabajo-rag/respuesta.png"],
    galleryAlt: {
      en: [
        "Answer to whether a pregnant woman can be dismissed, citing article 233, followed by the full text of that article",
      ],
      es: [
        "Respuesta a si se puede despedir a una mujer embarazada, citando el artículo 233, seguida del texto completo de ese artículo",
      ],
    },
    links: [
      {
        label: SOURCE_LABEL,
        href: "https://github.com/Kelvis123456/codigo-trabajo-rag",
        icon: "github",
      },
      {
        label: { en: "Try the search demo", es: "Probar la demo de búsqueda" },
        href: "https://kelvis123456.github.io/codigo-trabajo-rag/",
        icon: "external",
      },
    ],
  },
  {
    slug: "dop-usd-backtest",
    title: "dop-usd-backtest",
    tagline: {
      en: "An honest backtest of USD to DOP forecasts: five models against repeating the last value",
      es: "Un backtest honesto de pronósticos USD a DOP: cinco modelos contra repetir el último valor",
    },
    kind: "software",
    category: "software",
    status: "in-development",
    featured: false,
    market: "local",
    started: "2026-11",
    stack: ["Python", "pandas", "statsmodels", "pytest", "uv"],
    role: { en: "Solo developer", es: "Desarrollador en solitario" },
    summary: {
      en: "A rolling-origin backtest of five forecasters (naive, drift, ETS, ARIMA, 5-day median) on two years of daily USD to DOP rates. The result is that nothing beats repeating the last value, and the project shows how that was measured.",
      es: "Un backtest con origen móvil de cinco pronosticadores (naive, drift, ETS, ARIMA, mediana de 5 días) sobre dos años de tasas diarias USD a DOP. El resultado es que nada le gana a repetir el último valor, y el proyecto muestra cómo se midió.",
    },
    problem: {
      en: "It is easy to fit an ARIMA and plot a convincing curve. The hard part of forecasting is checking that the model beats doing nothing, without leaking the future into the history it sees.",
      es: "Es fácil ajustar un ARIMA y dibujar una curva convincente. Lo difícil de pronosticar es comprobar que el modelo le gana a no hacer nada, sin filtrar el futuro en el historial que ve.",
    },
    solution: {
      en: "At each of 83 weekly origins the model receives only the data up to that day and is scored against the value 1, 7 and 30 days later. Every model is reported as its error difference against the naive forecast, with a block bootstrap confidence interval.",
      es: "En cada uno de 83 orígenes semanales el modelo recibe solo los datos hasta ese día y se mide contra el valor 1, 7 y 30 días después. Cada modelo se reporta como su diferencia de error contra el naive, con un intervalo de confianza por bootstrap de bloques.",
    },
    architectureHighlights: {
      en: [
        "ARIMA and ETS have about 10% more error than the naive at a 1-day horizon, and the interval excludes zero. At 7 and 30 days most intervals include zero, so with 83 origins they cannot be told apart from the naive",
        "The harness is tested for look-ahead: a spy model records what it receives and it must equal the series prefix. I injected a one-day leak on purpose and five tests failed; an earlier review found that one of my look-ahead tests was not catching it, and a real leak from interpolating the one missing day, both now fixed",
        "Origins one week apart share most of a 30-day path, so a plain bootstrap would give intervals that are too narrow. I resample circular blocks of ceil(h/7) origins",
        "I did not clean the series. A centered median filter would look two days past each origin, and a backward-looking one cannot flag the most recent day",
      ],
      es: [
        "ARIMA y ETS tienen cerca de 10 % más error que el naive a 1 día, y el intervalo excluye el cero. A 7 y 30 días casi todos los intervalos incluyen el cero, así que con 83 orígenes no se distinguen del naive",
        "El arnés tiene tests contra mirar el futuro: un modelo espía guarda lo que recibe y debe ser igual al prefijo de la serie. Metí una fuga de un día a propósito y fallaron cinco tests; una revisión encontró que uno de mis tests contra mirar el futuro no la detectaba y una fuga real al interpolar el único día que falta, ya corregidas las dos",
        "Orígenes con una semana de distancia comparten casi todo un recorrido de 30 días, así que un bootstrap común daría intervalos demasiado estrechos. Remuestreo bloques circulares de ceil(h/7) orígenes",
        "No limpié la serie. Un filtro de mediana centrado miraría dos días más allá de cada origen, y uno hacia atrás no puede marcar el último día",
      ],
    },
    notDoneYet: {
      en: "One series, two years, 83 origins. The data comes from a free aggregator, not the Central Bank rate, and has isolated glitches such as 57.72 on 2026-09-29 between days near 59.5. There are no models with external variables, and it is not financial advice.",
      es: "Una serie, dos años, 83 orígenes. Los datos vienen de un agregador gratuito, no de la tasa del Banco Central, y tienen errores sueltos como 57.72 el 2026-09-29 entre días cercanos a 59.5. No hay modelos con variables externas y no es una recomendación financiera.",
    },
    metrics: [
      { label: { en: "Days of data", es: "Días de datos" }, value: "972" },
      { label: { en: "Rolling origins", es: "Orígenes móviles" }, value: "83" },
      { label: { en: "Tests", es: "Tests" }, value: "13" },
    ],
    gallery: ["/images/dop-usd-backtest/error-vs-naive.png"],
    galleryAlt: {
      en: [
        "Three bar charts, one per forecast horizon, showing each model's error versus the naive forecast with confidence intervals; ARIMA, ETS and the 5-day median are worse at one day",
      ],
      es: [
        "Tres gráficos de barras, uno por horizonte, con el error de cada modelo contra el naive y sus intervalos de confianza; ARIMA, ETS y la mediana de 5 días son peores a un día",
      ],
    },
    links: [
      {
        label: SOURCE_LABEL,
        href: "https://github.com/Kelvis123456/dop-usd-backtest",
        icon: "github",
      },
    ],
  },
  {
    slug: "dominican-tools-mcp",
    title: "dominican-tools-mcp",
    tagline: {
      en: "An MCP server with Dominican tax and labor-law tools, and evals that check a model uses them well",
      es: "Un servidor MCP con herramientas fiscales y laborales dominicanas, y evaluaciones que comprueban que un modelo las usa bien",
    },
    kind: "software",
    category: "software",
    status: "in-development",
    featured: false,
    market: "local",
    started: "2026-11",
    stack: [".NET 10", "MCP C# SDK", "xUnit", "Microsoft.Extensions.AI", "Gemini"],
    role: { en: "Solo developer", es: "Desarrollador en solitario" },
    summary: {
      en: "A Model Context Protocol server with five read-only tools: validate a Dominican RNC, cédula or NCF, search the Labor Code and read an article. It reuses the code from my dgii-helper and Labor Code projects, plus a set of evaluations that measure whether the tools return the right thing and whether a model uses them correctly.",
      es: "Un servidor del Model Context Protocol con cinco herramientas de solo lectura: validar un RNC, una cédula o un NCF dominicanos, buscar en el Código de Trabajo y leer un artículo. Reutiliza el código de mis proyectos dgii-helper y del Código de Trabajo, más un conjunto de evaluaciones que miden si las herramientas devuelven lo correcto y si un modelo las usa bien.",
    },
    problem: {
      en: "Wiring a tool to a model is the easy part. The hard part is checking that the tool answers correctly, that its description is enough for the model to pick it, and that the model does not invent what the tool never said.",
      es: "Conectar una herramienta a un modelo es lo fácil. Lo difícil es comprobar que la herramienta responde bien, que su descripción basta para que el modelo la elija y que el modelo no inventa lo que la herramienta no dijo.",
    },
    solution: {
      en: "Each tool is read-only, has bounded inputs and a description that states what it does not do. Two kinds of evaluation sit on top: a deterministic one against known answers that runs in CI, and one that gives prompts to Gemini with the real tools and checks tool choice and answer content. The server and a real MCP client are tested connected in memory, so the protocol is exercised and not just the methods.",
      es: "Cada herramienta es de solo lectura, tiene entradas acotadas y una descripción que dice lo que no hace. Encima hay dos tipos de evaluación: una determinista contra respuestas conocidas que corre en el CI, y otra que le da prompts a Gemini con las herramientas reales y comprueba qué herramienta elige y qué contiene la respuesta. El servidor y un cliente MCP real se prueban conectados en memoria, así que se ejercita el protocolo y no solo los métodos.",
    },
    architectureHighlights: {
      en: [
        "42 tests run the real server against a real MCP client over in-memory pipes. Removing the input length limit or changing the RNC check-digit weights breaks three tests each",
        "An invalid identifier is a normal answer (valid: false and why); a misuse such as a 65-character value or top = 0 is a tool error. The validators never echo the input back, so a hostile string does not return to the model as if it were an instruction",
        "The tool descriptions say what the tools do not do (for instance that RNC validation does not query the tax authority), and a test requires it, because the description is what the model reads when choosing",
        "The deterministic eval has 50 cases: 43 pass and 7 are marked as known misses of the keyword search, such as the notice-period article. If a change fixes one, the report flags the improvement and exits non-zero until the mark is removed",
        "The Gemini eval ran 20 prompts: the right tool in 19 of 19 valid runs, the expected content in 19 of 19, and one false alarm from my own number-grounding check (the article writes the figure in words and the model wrote 100%). I kept the check as it was instead of tuning it to zero",
        "The first run was cut after 8 prompts by the free-tier quota. I added pacing and retries and kept both result files",
      ],
      es: [
        "42 pruebas ejecutan el servidor real contra un cliente MCP real por tuberías en memoria. Quitar el tope de longitud de entrada o cambiar los pesos del dígito verificador del RNC rompe tres pruebas cada vez",
        "Un identificador inválido es una respuesta normal (valid: false y por qué); un uso incorrecto como un valor de 65 caracteres o top = 0 es un error de la herramienta. Los validadores nunca repiten la entrada, así que una cadena hostil no vuelve al modelo como si fuera una instrucción",
        "Las descripciones dicen lo que las herramientas no hacen (por ejemplo que validar un RNC no consulta a la DGII), y una prueba lo exige, porque la descripción es lo que el modelo lee al elegir",
        "La evaluación determinista tiene 50 casos: 43 pasan y 7 están marcados como fallos conocidos de la búsqueda por palabras, como el artículo del preaviso. Si un cambio arregla uno, el reporte avisa de la mejora y sale con código distinto de cero hasta quitar la marca",
        "La evaluación con Gemini corrió 20 prompts: la herramienta correcta en 19 de 19 corridas válidas, el contenido esperado en 19 de 19, y una falsa alarma de mi propia comprobación de números (el artículo escribe la cifra en palabras y el modelo puso 100 %). Dejé la comprobación como estaba en vez de ajustarla hasta que diera cero",
        "La primera corrida se cortó a los 8 prompts por la cuota del plan gratis. Añadí espera y reintentos y conservé los dos archivos de resultados",
      ],
    },
    notDoneYet: {
      en: "The Gemini eval is 20 prompts I wrote, one small model, one run and text checks instead of a judge, so it shows that the descriptions did not confuse that model and says nothing about others. The search is keyword-based and misses 7 of 21 test questions. The code is copied from two other repos, not shared. It queries no external service, runs only over stdio and I did not try it with a desktop MCP client.",
      es: "La evaluación con Gemini son 20 prompts que escribí yo, un modelo pequeño, una corrida y comprobaciones de texto en vez de un juez: muestra que las descripciones no confundieron a ese modelo y no dice nada de otros. La búsqueda es por palabras y falla 7 de las 21 preguntas de prueba. El código está copiado de otros dos repos, no compartido. No consulta ningún servicio externo, corre solo por stdio y no lo probé con ningún cliente MCP de escritorio.",
    },
    metrics: [
      { label: { en: "Tests, real server and client", es: "Tests, servidor y cliente reales" }, value: "42" },
      { label: { en: "Eval cases with known answers", es: "Casos de evaluación con respuesta conocida" }, value: "50" },
      { label: { en: "Agent eval prompts", es: "Prompts de la evaluación del agente" }, value: "20" },
    ],
    links: [
      {
        label: SOURCE_LABEL,
        href: "https://github.com/Kelvis123456/dominican-tools-mcp",
        icon: "github",
      },
    ],
  },
];
