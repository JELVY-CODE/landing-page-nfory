'use client';

import { usePathname } from "next/navigation";
import BrandLogo from "@/components/BrandLogo";
import PageBackground from "@/components/PageBackground";
import { notFoundCopy } from "@/data/content/not-found";
import { DEFAULT_LOCALE, hasLocale } from "@/lib/i18n/config";

export default function NotFound() {
  const segment = usePathname().split("/")[1] ?? "";
  const locale = hasLocale(segment) ? segment : DEFAULT_LOCALE;
  const t = notFoundCopy[locale];

  return (
    <>
      <PageBackground />
      <main className="flex min-h-svh flex-col items-center justify-center px-4 text-center">
        <a href={`/${locale}`} aria-label="NFory" className="rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-500">
          <BrandLogo size="lg" />
        </a>
        <div className="mt-12 flex size-20 items-center justify-center rounded-full border border-violet-500/50 bg-zinc-950 font-mono text-lg text-white shadow-[0_0_0_8px_rgb(139_92_246/0.08),0_0_40px_-6px_rgb(139_92_246/0.7)]">
          404
        </div>
        <h1 className="mt-8 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">{t.title}</h1>
        <p className="mt-3 max-w-md text-base leading-relaxed text-zinc-400">{t.text}</p>
        <a
          href={`/${locale}`}
          className={
            "mt-8 inline-flex h-11 items-center justify-center rounded-full bg-[#5D5FEF] px-6 text-[0.9375rem] font-medium text-white " +
            "transition-[background-color,scale] duration-150 ease-out-strong hover:bg-indigo-600 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
          }
        >
          {t.back}
        </a>
      </main>
    </>
  );
}
