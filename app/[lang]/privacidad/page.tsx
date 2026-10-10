import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PageBackground from "@/components/PageBackground";
import { PRIVACY_UPDATED, privacy } from "@/data/legal/privacy";
import { site } from "@/data/site";
import { LOCALES, hasLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export async function generateMetadata({ params }: PageProps<"/[lang]/privacidad">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const content = privacy[lang];

  return {
    title: `${content.title} · ${site.name}`,
    description: content.metaDescription,
    alternates: {
      canonical: `/${lang}/privacidad`,
      languages: Object.fromEntries(LOCALES.map((locale) => [locale, `/${locale}/privacidad`])),
    },
    openGraph: { title: `${content.title} · ${site.name}`, description: content.metaDescription, url: `https://${site.domain}/${lang}/privacidad` },
  };
}

const withEmail = (text: string): ReactNode[] =>
  text.split("{email}").flatMap((part, index) =>
    index === 0
      ? [part]
      : [
          <a key={index} href={`mailto:${site.contactEmail}`} className="text-indigo-300 underline underline-offset-4 hover:text-indigo-200">
            {site.contactEmail}
          </a>,
          part,
        ],
  );

export default async function PrivacyPage({ params }: PageProps<"/[lang]/privacidad">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const content = privacy[lang];
  const basePath = `/${lang}`;
  const updated = new Date(`${PRIVACY_UPDATED}T12:00:00Z`).toLocaleDateString(lang, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

  return (
    <>
      <PageBackground />
      <Navbar locale={lang} t={dict.nav} basePath={basePath} />

      <main className="px-4 pt-[4.5rem] sm:px-6">
        <article className="mx-auto max-w-3xl py-16 sm:py-24">
          <a
            href={basePath}
            className="inline-flex items-center gap-1.5 rounded-full py-1.5 pr-3 text-sm text-zinc-400 transition-colors duration-150 hover:text-white focus-visible:outline-2 focus-visible:outline-violet-500"
          >
            <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 8H3m4-4L3 8l4 4" />
            </svg>
            {content.back}
          </a>

          <h1 className="mt-8 text-3xl font-semibold tracking-[-0.03em] text-balance text-white sm:text-5xl">{content.title}</h1>
          <p className="mt-4 font-mono text-xs tracking-wide text-violet-400 uppercase">
            {content.updated}: <time dateTime={PRIVACY_UPDATED}>{updated}</time>
          </p>
          <p className="mt-8 text-base leading-relaxed text-zinc-300 sm:text-lg">{content.intro}</p>

          <div className="mt-12 space-y-10">
            {content.sections.map((section, index) => (
              <section key={section.heading} aria-labelledby={`privacy-${index}`}>
                <h2 id={`privacy-${index}`} className="flex items-baseline gap-3 text-xl font-semibold tracking-tight text-white">
                  <span className="font-mono text-xs text-indigo-400">{String(index + 1).padStart(2, "0")}</span>
                  {section.heading}
                </h2>
                <div className="mt-3 space-y-3 text-[0.9375rem] leading-relaxed text-zinc-400">
                  {section.paragraphs?.map((paragraph) => <p key={paragraph}>{withEmail(paragraph)}</p>)}
                  {section.list && (
                    <ul className="space-y-2">
                      {section.list.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <span aria-hidden="true" className="mt-[0.6rem] size-1.5 shrink-0 rounded-full bg-indigo-500" />
                          <span>{withEmail(item)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {section.after?.map((paragraph) => <p key={paragraph}>{withEmail(paragraph)}</p>)}
                </div>
              </section>
            ))}
          </div>
        </article>
      </main>

      <Footer locale={lang} t={dict} basePath={basePath} />
    </>
  );
}
