// Sentry pesa ~110 KB y su init bloqueaba el hilo principal en móvil (TBT
// 1.2 s en Lighthouse), así que se carga con la primera interacción o a los
// 8 s. Los errores que ocurran antes se guardan y se reenvían al iniciar.
type SentryModule = typeof import("@sentry/nextjs");

let sentry: SentryModule | undefined;
const early: unknown[] = [];
const buffer = (e: ErrorEvent | PromiseRejectionEvent) => early.push("reason" in e ? e.reason : e.error);

window.addEventListener("error", buffer);
window.addEventListener("unhandledrejection", buffer);

function start() {
  void import("@sentry/nextjs").then((mod) => {
    mod.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

      // 100% in dev, 10% in production
      tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,
    });
    window.removeEventListener("error", buffer);
    window.removeEventListener("unhandledrejection", buffer);
    sentry = mod;
    early.forEach((err) => mod.captureException(err));
  });
}

// Primera interacción o 8 s, lo que llegue antes. Cargarlo apenas hay un rato
// libre seguía contando como tiempo bloqueado en la medición de Lighthouse.
const events = ["pointerdown", "keydown", "scroll", "touchstart"] as const;
function go() {
  events.forEach((ev) => window.removeEventListener(ev, go));
  clearTimeout(timer);
  start();
}
const timer = setTimeout(go, 8000);
events.forEach((ev) => window.addEventListener(ev, go, { once: true, passive: true }));

// Navigations before Sentry loads simply aren't traced.
export const onRouterTransitionStart: SentryModule["captureRouterTransitionStart"] = (...args) =>
  sentry?.captureRouterTransitionStart(...args);
