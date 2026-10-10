import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import BrandIcon from "@/components/BrandIcon";
import ButtonLink from "@/components/ButtonLink";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PageBackground from "@/components/PageBackground";
import { SOCIAL_ICONS } from "@/components/SocialLinks";
import { localize } from "@/lib/gallery";
import { LOCALES, hasLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { aiModels, teamMembers } from "@/data/team";

export async function generateMetadata({ params }: PageProps<"/[lang]/developers">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { team } = getDictionary(lang);
  return {
    title: team.metaTitle,
    description: team.metaDescription,
    alternates: {
      canonical: `/${lang}/developers`,
      languages: Object.fromEntries(LOCALES.map((locale) => [locale, `/${locale}/developers`])),
    },
  };
}

const card = "rounded-2xl border border-white/[0.08] bg-zinc-900/40 shadow-[inset_0_1px_0_0_rgb(255_255_255/0.06)] backdrop-blur-xl";
const eyebrow = "font-mono text-xs tracking-wide text-indigo-400 uppercase";
const heading = "mt-3 text-3xl font-semibold tracking-[-0.03em] text-balance text-white sm:text-4xl";
const bar = "block rounded-full bg-white/[0.06]";

export default async function TeamPage({ params }: PageProps<"/[lang]/developers">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const t = dict.team;
  const home = `/${lang}`;

  return (
    <>
      <PageBackground />
      <Navbar locale={lang} t={dict.nav} basePath={home} />

      <main className="px-4 sm:px-6">
        <header className="mx-auto max-w-6xl pt-36 pb-20 sm:pt-44">
          <a href={home} className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors duration-150 hover:text-zinc-200">
            <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 8H3m4-4L3 8l4 4" />
            </svg>
            {t.back}
          </a>
          <p className={`${eyebrow} mt-8`}>{t.eyebrow}</p>
          <h1 className="mt-3 max-w-3xl text-4xl leading-[1.08] font-semibold tracking-[-0.035em] text-balance text-white sm:text-6xl">{t.title}</h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-pretty text-zinc-400 sm:text-lg">{t.subtitle}</p>
        </header>

        <section aria-labelledby="team-members" className="mx-auto max-w-6xl pb-24 sm:pb-32">
          <p className={eyebrow}>{t.membersEyebrow}</p>
          <h2 id="team-members" className={heading}>
            {t.membersTitle}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-400">{t.membersSubtitle}</p>

          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member) => {
              const role = localize(member.role, lang);
              return (
                <li key={member.id} aria-label={member.name || t.memberEmpty} className={`${card} p-6`}>
                  <div className="relative size-20 overflow-hidden rounded-full border border-white/10 bg-zinc-900">
                    {member.photo ? (
                      <Image src={member.photo} alt={member.name} fill sizes="5rem" className="object-cover" />
                    ) : (
                      <svg aria-hidden="true" viewBox="0 0 24 24" className="absolute inset-0 m-auto size-9 text-zinc-700" fill="currentColor">
                        <path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0 2c-4.4 0-8 2.2-8 5v1.5h16V19c0-2.8-3.6-5-8-5Z" />
                      </svg>
                    )}
                  </div>
                  {member.name ? (
                    <p className="mt-5 text-lg font-semibold tracking-tight text-white">{member.name}</p>
                  ) : (
                    <span aria-hidden="true" className={`${bar} mt-6 h-4 w-2/3`} />
                  )}
                  {role ? (
                    <p className="mt-1 text-sm text-zinc-400">{role}</p>
                  ) : (
                    <span aria-hidden="true" className={`${bar} mt-3 h-2.5 w-1/2`} />
                  )}
                  <div className="mt-5 flex gap-1">
                    {(["linkedin", "github"] as const).map((network) => {
                      const href = member[network];
                      const icon = (
                        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="currentColor">
                          {SOCIAL_ICONS[network]}
                        </svg>
                      );
                      return href ? (
                        <a
                          key={network}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${member.name} · ${network === "linkedin" ? "LinkedIn" : "GitHub"}`}
                          className="flex size-8 items-center justify-center rounded-full text-zinc-400 transition-colors duration-150 hover:bg-white/[0.06] hover:text-white"
                        >
                          {icon}
                        </a>
                      ) : (
                        <span key={network} className="flex size-8 items-center justify-center rounded-full text-zinc-800">
                          {icon}
                        </span>
                      );
                    })}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section aria-labelledby="team-agents" className="mx-auto max-w-6xl pb-24 sm:pb-32">
          <p className={eyebrow}>{t.agentsEyebrow}</p>
          <h2 id="team-agents" className={heading}>
            {t.agentsTitle}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-400">{t.agentsSubtitle}</p>

          <div className="mt-12 grid gap-4 lg:grid-cols-2">
            {aiModels.map((model) => (
              <article key={model.id} className={`${card} flex flex-col p-6 sm:p-8`}>
                <div className="flex items-start gap-4">
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-zinc-950">
                    <BrandIcon icon={model.icon} className="size-8" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-mono text-xs tracking-wide text-violet-400 uppercase">{t[model.copy.role]}</p>
                    <h3 className="mt-1 text-xl font-semibold tracking-tight text-white sm:text-2xl">{model.name}</h3>
                    <p className="mt-1 flex items-center gap-2 text-sm text-zinc-400">
                      <BrandIcon icon={model.vendor} className="size-3.5" />
                      {model.vendor.title}
                    </p>
                  </div>
                </div>
                <p className="mt-6 text-base leading-relaxed text-zinc-300">{t[model.copy.description]}</p>
                <ul className="mt-5 space-y-2.5">
                  {t[model.copy.capabilities].map((capability) => (
                    <li key={capability} className="flex items-start gap-3 text-sm text-zinc-300">
                      <span aria-hidden="true" className="mt-[0.45rem] size-1.5 shrink-0 rounded-full bg-indigo-500" />
                      {capability}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className={`${card} mx-auto mb-24 flex max-w-6xl flex-col items-center gap-6 px-6 py-14 text-center sm:mb-32`}>
          <h2 className="max-w-2xl text-3xl font-semibold tracking-[-0.03em] text-balance text-white sm:text-4xl">{t.ctaTitle}</h2>
          <ButtonLink href={`${home}#contacto`}>{dict.nav.cta}</ButtonLink>
        </section>
      </main>

      <Footer locale={lang} t={dict} basePath={home} />
    </>
  );
}
