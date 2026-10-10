'use client';

import { useEffect, useState } from "react";
import BrandLogo from "@/components/BrandLogo";
import ButtonLink from "@/components/ButtonLink";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { site } from "@/data/site";
import { navHref } from "@/lib/navigation";

type NavbarProps = { locale: Locale; t: Dictionary["nav"]; basePath?: string };

export default function Navbar({ locale, t, basePath = "" }: NavbarProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const desktop = window.matchMedia("(min-width: 64rem)");
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onChange);
    return () => {
      window.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onChange);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-zinc-950/70 backdrop-blur-xl">
      <nav
        aria-label={t.primary}
        className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between gap-6 px-4 sm:px-6"
      >
        <a
          href={`${basePath}#inicio`}
          aria-label={t.home}
          onClick={close}
          className="shrink-0 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-500"
        >
          <BrandLogo size="lg" />
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {site.nav.map((item) => (
            <li key={item.href}>
              <a
                href={navHref(item, locale, basePath)}
                className="rounded-full px-3.5 py-2 text-sm text-zinc-400 transition-colors duration-150 hover:text-white focus-visible:outline-2 focus-visible:outline-violet-500"
              >
                {t[item.key]}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <LanguageSwitcher locale={locale} label={t.language} />
          <span className="hidden sm:block">
            <ButtonLink href={`${basePath}${site.contactHref}`} size="sm">
              {t.cta}
            </ButtonLink>
          </span>

          <button
            type="button"
            aria-label={open ? t.closeMenu : t.openMenu}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((value) => !value)}
            className={
              "relative flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-zinc-200 " +
              "transition-[background-color,border-color,scale] duration-150 ease-out-strong hover:border-white/20 hover:bg-white/[0.06] " +
              "active:scale-[0.95] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 lg:hidden"
            }
          >
            <span
              aria-hidden="true"
              className={`absolute h-[1.5px] w-[18px] rounded-full bg-current transition-[translate,rotate] duration-200 ease-out-strong ${open ? "rotate-45" : "-translate-y-[4px]"}`}
            />
            <span
              aria-hidden="true"
              className={`absolute h-[1.5px] w-[18px] rounded-full bg-current transition-[translate,rotate] duration-200 ease-out-strong ${open ? "-rotate-45" : "translate-y-[4px]"}`}
            />
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        hidden={!open}
        className="border-t border-white/[0.06] bg-zinc-950/95 backdrop-blur-xl lg:hidden"
      >
        <div className="mobile-menu-panel mx-auto max-w-6xl px-4 pt-2 pb-6 sm:px-6">
          <ul className="flex flex-col">
            {site.nav.map((item) => (
              <li key={item.href} className="border-b border-white/[0.06] last:border-b-0">
                <a
                  href={navHref(item, locale, basePath)}
                  onClick={close}
                  className="flex items-center justify-between py-4 text-base text-zinc-200 transition-colors duration-150 hover:text-white focus-visible:outline-2 focus-visible:outline-violet-500"
                >
                  {t[item.key]}
                  <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 text-zinc-600" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m6 3.5 4.5 4.5-4.5 4.5" />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
          <ButtonLink href={`${basePath}${site.contactHref}`} onClick={close} className="mt-4 w-full">
            {t.cta}
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
