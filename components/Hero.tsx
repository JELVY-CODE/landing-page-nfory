import type { CSSProperties } from "react";
import ButtonLink from "@/components/ButtonLink";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { site } from "@/data/site";

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

export default function Hero({ t, cta }: { t: Dictionary["hero"]; cta: string }) {
  return (
    <section
      id="inicio"
      className="relative flex min-h-[100svh] items-center px-4 pt-28 pb-20 sm:px-6"
    >
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <p
          className="rise-in inline-flex items-center gap-2 rounded-full border border-indigo-500/25 bg-indigo-500/[0.08] px-4 py-1.5 font-mono text-xs tracking-wide text-indigo-300 backdrop-blur-md sm:text-[0.8125rem]"
          style={delay(0)}
        >
          <span className="text-violet-400" aria-hidden="true">[</span>
          {t.badge}
          <span className="text-violet-400" aria-hidden="true">]</span>
        </p>

        <h1
          className="rise-in mt-8 text-[2.5rem] leading-[1.05] font-semibold tracking-[-0.035em] text-balance text-white sm:text-6xl lg:text-7xl"
          style={delay(70)}
        >
          {t.titleLead} <span className="text-zinc-500">{t.titleAccent}</span>
        </h1>

        <p
          className="rise-in mt-6 max-w-2xl text-base leading-relaxed text-pretty text-zinc-400 sm:text-lg"
          style={delay(140)}
        >
          {t.subtitle}
        </p>

        <div
          className="rise-in mt-10 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row"
          style={delay(210)}
        >
          <ButtonLink href={site.contactHref} className="w-full sm:w-auto">
            {cta}
            <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4" fill="none">
              <path d="M3 8h10m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </ButtonLink>
          <ButtonLink href="#servicios" variant="secondary" className="w-full sm:w-auto">
            {t.secondaryCta}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
