import type { Metadata } from "next";
import { siteConfig } from "@/content/siteConfig";
import type { Locale } from "@/lib/language-context";

const CONTENT = {
  en: {
    title: "Privacy",
    updated: "Last updated: October 2026",
    sections: [
      {
        heading: "What this site collects",
        body: "No accounts, no forms, no cookies. I use Vercel Web Analytics and Speed Insights to see page views and load times. Both are cookieless and only report aggregated data, so they can't tell who you are.",
      },
      {
        heading: "Error reports",
        body: "If a page crashes, Sentry receives the error, the page it happened on, and basic browser info so I can fix it. It isn't set up to collect personal data, and only a sample of page loads is traced.",
      },
      {
        heading: "Links to other sites",
        body: "Project links go to GitHub, LinkedIn and live demos hosted elsewhere. Those sites have their own privacy policies.",
      },
      {
        heading: "Contact",
        body: "Questions about this, or want something removed? Write to me at",
      },
    ],
  },
  es: {
    title: "Privacidad",
    updated: "Última actualización: octubre de 2026",
    sections: [
      {
        heading: "Qué recopila este sitio",
        body: "No hay cuentas, formularios ni cookies. Uso Vercel Web Analytics y Speed Insights para ver visitas y tiempos de carga. Ninguno usa cookies y solo dan datos agregados, así que no pueden saber quién eres.",
      },
      {
        heading: "Reportes de errores",
        body: "Si una página falla, Sentry recibe el error, la página donde pasó y datos básicos del navegador para poder arreglarlo. No está configurado para recopilar datos personales, y solo se traza una muestra de las visitas.",
      },
      {
        heading: "Enlaces a otros sitios",
        body: "Los enlaces de los proyectos llevan a GitHub, LinkedIn y demos alojadas en otros servicios. Esos sitios tienen sus propias políticas de privacidad.",
      },
      {
        heading: "Contacto",
        body: "¿Dudas sobre esto, o quieres que borre algo? Escríbeme a",
      },
    ],
  },
} satisfies Record<Locale, unknown>;

function toLocale(raw: string): Locale {
  return raw === "es" ? "es" : "en";
}

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "es" }];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = toLocale((await params).locale);
  return {
    title: `${CONTENT[locale].title} | Kelvis Guerrero`,
    description:
      locale === "es" ? "Qué datos recopila este portafolio y para qué." : "What data this portfolio collects and why.",
    alternates: {
      canonical: `${siteConfig.url}/${locale}/privacy`,
      languages: {
        en: `${siteConfig.url}/en/privacy`,
        es: `${siteConfig.url}/es/privacy`,
        "x-default": `${siteConfig.url}/en/privacy`,
      },
    },
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const content = CONTENT[toLocale((await params).locale)];
  const last = content.sections.length - 1;

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-32">
      <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{content.title}</h1>
      <p className="mt-2 text-sm text-foreground/60">{content.updated}</p>
      {content.sections.map((section, i) => (
        <section key={section.heading} className="mt-10">
          <h2 className="text-lg font-semibold">{section.heading}</h2>
          <p className="mt-2 leading-relaxed text-foreground/75">
            {section.body}
            {i === last && (
              <>
                {" "}
                <a href={`mailto:${siteConfig.email}`} className="underline underline-offset-4 hover:text-foreground">
                  {siteConfig.email}
                </a>
                .
              </>
            )}
          </p>
        </section>
      ))}
    </main>
  );
}
