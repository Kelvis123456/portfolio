"use client";

import { useId } from "react";
import { useLanguage } from "@/lib/language-context";

const COPY = {
  en: {
    title: "RentEdge architecture",
    desc: "The Next.js web app talks to the NestJS API. The API stores data in PostgreSQL with TimescaleDB, queues work in Redis with BullMQ, and asks the ml-forecasting service for advisory suggestions. The rate-shopper service reads OTA rates and sends competitor prices to the API. A backup job copies the database to Cloudflare R2.",
    rules: "rules · RBAC · audit log",
    series: "price + occupancy series",
    queue: "repricing events",
    advisory: "advisory",
    competitor: "competitor rates",
    backup: "nightly backup",
  },
  es: {
    title: "Arquitectura de RentEdge",
    desc: "La web en Next.js habla con la API NestJS. La API guarda datos en PostgreSQL con TimescaleDB, encola trabajo en Redis con BullMQ y le pide sugerencias al servicio ml-forecasting. El servicio rate-shopper lee tarifas de las OTAs y manda los precios de la competencia a la API. Un job de backup copia la base de datos a Cloudflare R2.",
    rules: "reglas · RBAC · auditoría",
    series: "series de precio y ocupación",
    queue: "eventos de repricing",
    advisory: "sugerencias",
    competitor: "tarifas de la competencia",
    backup: "backup nocturno",
  },
};

function Box({
  x,
  y,
  w,
  h = 56,
  title,
  sub,
  strong = false,
}: {
  x: number;
  y: number;
  w: number;
  h?: number;
  title: string;
  sub?: string;
  strong?: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={10}
        className={strong ? "fill-surface-muted stroke-foreground/40" : "fill-surface stroke-border"}
        strokeWidth={1.25}
      />
      <text x={x + 14} y={y + (sub ? 24 : h / 2 + 5)} className="fill-foreground font-sans text-[14px] font-semibold">
        {title}
      </text>
      {sub && (
        <text x={x + 14} y={y + 43} className="fill-foreground/65 font-mono text-[11px]">
          {sub}
        </text>
      )}
    </g>
  );
}

function Arrow({ d, id }: { d: string; id: string }) {
  return <path d={d} fill="none" className="stroke-foreground/45" strokeWidth={1.4} markerEnd={`url(#${id})`} />;
}

export function RentEdgeDiagram() {
  const { locale } = useLanguage();
  const c = COPY[locale];
  const uid = useId().replace(/:/g, "");
  const head = `head-${uid}`;
  const titleId = `title-${uid}`;
  const descId = `desc-${uid}`;

  return (
    <figure className="mt-8">
      {/* Below ~680px the labels would shrink under 7px, so the diagram scrolls sideways instead. */}
      <div
        tabIndex={0}
        role="region"
        aria-label={c.title}
        className="overflow-x-auto rounded-2xl border border-border bg-surface p-2"
      >
        <svg viewBox="0 0 900 370" role="img" aria-labelledby={`${titleId} ${descId}`} className="w-full min-w-[680px]">
          <title id={titleId}>{c.title}</title>
          <desc id={descId}>{c.desc}</desc>
          <defs>
            <marker id={head} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M0 0 L10 5 L0 10 z" className="fill-foreground/55" />
            </marker>
          </defs>

          <Box x={20} y={142} w={160} title="Next.js web" />
          <Box x={250} y={130} w={220} h={80} strong title="NestJS API" sub={c.rules} />
          <Box x={560} y={20} w={190} title="PostgreSQL" sub="+ TimescaleDB" />
          <Box x={560} y={110} w={190} title="Redis + BullMQ" sub={c.queue} />
          <Box x={560} y={200} w={190} title="ml-forecasting" sub={`FastAPI · ${c.advisory}`} />
          <Box x={250} y={290} w={220} title="rate-shopper" sub="Python" />
          <Box x={20} y={290} w={160} title="OTA APIs" />
          <Box x={780} y={20} w={100} title="R2" sub={c.backup} />

          <Arrow id={head} d="M180 170 H250" />
          <Arrow id={head} d="M470 150 C520 150 520 48 560 48" />
          <Arrow id={head} d="M470 170 H560 V138" />
          <Arrow id={head} d="M470 190 C520 190 520 228 560 228" />
          <Arrow id={head} d="M350 290 V210" />
          <Arrow id={head} d="M180 318 H250" />
          <Arrow id={head} d="M750 48 H780" />

          <text x={362} y={258} className="fill-foreground/65 font-mono text-[10px]">
            {c.competitor}
          </text>
          <text x={560} y={92} className="fill-foreground/65 font-mono text-[10px]">
            {c.series}
          </text>
        </svg>
      </div>
    </figure>
  );
}
