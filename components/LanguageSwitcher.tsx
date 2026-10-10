'use client';

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LOCALES, LOCALE_COOKIE, LOCALE_NAMES, type Locale } from "@/lib/i18n/config";
import { visibleAll, visibleById, visibleOne } from "@/lib/dom";

const RESTORE_KEY = "nfory:locale-restore";
const USER_INPUT = ["wheel", "touchstart", "keydown", "pointerdown"] as const;

// Con View Transitions el navegador mantiene una captura de la página mientras llega el idioma nuevo
// y hace un fundido cruzado cuando el contenido ya está recolocado; esta función cierra esa espera.
let finishTransition: (() => void) | null = null;
const endTransition = () => {
  finishTransition?.();
  finishTransition = null;
};
type Restore = { id: string | null; offset: number; panel: number };

// Guarda la sección visible (y su desplazamiento) para volver al mismo punto tras cambiar de idioma,
// ya que cada idioma es otro documento y la altura del contenido cambia entre traducciones.
function saveReading(code: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${code}; path=/; max-age=31536000; samesite=lax`;
  const marker = window.innerHeight / 3;
  let current: HTMLElement | null = null;
  for (const element of visibleAll("#inicio, main .journey-anchor[id]")) {
    if (element.getBoundingClientRect().top <= marker) current = element;
  }
  const panel = visibleOne("[role=dialog][aria-labelledby=developers-title]");
  const restore: Restore = { id: current?.id ?? null, offset: current ? current.getBoundingClientRect().top : 0, panel: panel?.scrollTop ?? 0 };
  try {
    sessionStorage.setItem(RESTORE_KEY, JSON.stringify(restore));
  } catch {}
}

function restoreReading() {
  const root = document.documentElement;
  let restore: Restore | null = null;
  try {
    restore = JSON.parse(sessionStorage.getItem(RESTORE_KEY) ?? "null");
    sessionStorage.removeItem(RESTORE_KEY);
  } catch {}
  if (!restore) {
    delete root.dataset.localeSwitching;
    endTransition();
    return;
  }
  const { id, offset, panel } = restore;
  const apply = () => {
    const target = id ? visibleById(id) : null;
    const top = target ? target.getBoundingClientRect().top + window.scrollY - offset : 0;
    window.scrollTo({ top, behavior: "instant" });
    const dialog = visibleOne("[role=dialog][aria-labelledby=developers-title]");
    if (dialog && window.location.hash === "#desarrolladores") dialog.scrollTop = panel;
  };

  // Mientras el contenido nuevo se asienta (fuentes, diagrama 3D) la página se mantiene anclada a la misma
  // sección sin scroll-snap; el fundido empieza cuando la altura se estabiliza y, si el diagrama 3D está a la
  // vista, cuando ya está dibujado, para que nada aparezca de golpe.
  let settle = 0;
  const reveal = () => {
    observer.disconnect();
    window.clearTimeout(settle);
    window.clearTimeout(limit);
    for (const type of USER_INPUT) window.removeEventListener(type, reveal);
    apply();
    endTransition();
    requestAnimationFrame(() => delete root.dataset.localeSwitching);
  };
  const sceneLoading = () =>
    visibleAll("[data-scene-pending]").some((element) => {
      const rect = element.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < window.innerHeight;
    });
  const trySettle = () => {
    if (sceneLoading()) settle = window.setTimeout(trySettle, 80);
    else requestAnimationFrame(() => requestAnimationFrame(reveal));
  };
  const onResize = () => {
    apply();
    window.clearTimeout(settle);
    settle = window.setTimeout(trySettle, 150);
  };
  const observer = new ResizeObserver(onResize);
  observer.observe(document.body);
  const limit = window.setTimeout(reveal, 2200);
  for (const type of USER_INPUT) window.addEventListener(type, reveal, { passive: true });
  onResize();
}

export default function LanguageSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  useEffect(restoreReading, [locale]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={
          "flex h-11 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 font-mono text-xs text-zinc-300 uppercase " +
          "transition-[background-color,border-color,scale] duration-150 ease-out-strong hover:border-white/20 hover:bg-white/[0.06] " +
          "active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
        }
      >
        <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.25">
          <circle cx="8" cy="8" r="6.25" />
          <path d="M1.75 8h12.5M8 1.75c1.7 1.8 2.5 3.9 2.5 6.25S9.7 12.45 8 14.25C6.3 12.45 5.5 10.35 5.5 8S6.3 3.55 8 1.75Z" />
        </svg>
        {locale}
      </button>

      {open && (
        <ul
          role="menu"
          className="popover-in absolute top-full right-0 mt-2 min-w-40 origin-top-right overflow-hidden rounded-xl border border-white/10 bg-zinc-900/95 p-1 shadow-2xl backdrop-blur-xl"
        >
          {LOCALES.map((code) => (
            <li key={code} role="none">
              <a
                role="menuitem"
                href={`/${code}`}
                onClick={(event) => {
                  event.preventDefault();
                  setOpen(false);
                  if (code === locale) return;
                  saveReading(code);
                  const hash = window.location.hash === "#desarrolladores" ? window.location.hash : "";
                  const navigate = () => router.push(`/${code}${window.location.search}${hash}`, { scroll: false });
                  const root = document.documentElement;
                  if (!document.startViewTransition || document.hidden || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                    root.dataset.localeSwitching = "fade";
                    navigate();
                    return;
                  }
                  root.dataset.localeSwitching = "";
                  const transition = document.startViewTransition(
                    () =>
                      new Promise<void>((resolve) => {
                        finishTransition = resolve;
                        window.setTimeout(endTransition, 3000);
                        navigate();
                      }),
                  );
                  // Si el navegador omite la animación (p. ej. pestaña oculta) el cambio de idioma sigue igual.
                  transition.ready.catch(() => {});
                }}
                hrefLang={code}
                lang={code}
                aria-current={code === locale ? "true" : undefined}
                className={
                  "flex items-center justify-between gap-4 rounded-lg px-3 py-2 text-sm transition-colors duration-150 " +
                  (code === locale ? "bg-indigo-500/15 text-white" : "text-zinc-300 hover:bg-white/[0.06] hover:text-white")
                }
              >
                {LOCALE_NAMES[code]}
                <span className="font-mono text-[11px] text-zinc-500 uppercase">{code}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
