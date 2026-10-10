'use client';

import { useEffect, useRef, useState } from "react";
import { LOCALES, LOCALE_NAMES, type Locale } from "@/lib/i18n/config";

export default function LanguageSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

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
