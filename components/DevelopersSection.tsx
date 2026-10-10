import Image from "next/image";
import BrandIcon from "@/components/BrandIcon";
import JourneyNode from "@/components/JourneyNode";
import SlideIn from "@/components/SlideIn";
import { SOCIAL_ICONS } from "@/components/SocialLinks";
import { aiModels, teamMembers } from "@/data/team";
import { localize } from "@/lib/gallery";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const card = "rounded-2xl border border-white/[0.08] bg-zinc-900/40 shadow-[inset_0_1px_0_0_rgb(255_255_255/0.06)] backdrop-blur-xl";
const eyebrow = "font-mono text-xs tracking-wide text-indigo-400 uppercase";
const subheading = "mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl";
const bar = "block rounded-full bg-white/[0.06]";

export default function DevelopersSection({ locale, t }: { locale: Locale; t: Dictionary["team"] }) {
  return (
    <section className="overflow-x-clip px-4 pb-24 sm:px-6 sm:pb-32">
      <div className="mx-auto max-w-6xl lg:pl-20">
        <div id="desarrolladores" className="journey-anchor relative max-w-2xl">
          <JourneyNode index="04" />
          <p className={eyebrow}>{t.eyebrow}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-balance text-white sm:text-4xl">{t.title}</h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-400 sm:text-lg">{t.subtitle}</p>
        </div>

        <SlideIn className="mt-14">
          <p className={eyebrow}>{t.membersEyebrow}</p>
          <h3 className={subheading}>{t.membersTitle}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">{t.membersSubtitle}</p>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member) => {
              const role = localize(member.role, locale);
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
                  {role ? <p className="mt-1 text-sm text-zinc-400">{role}</p> : <span aria-hidden="true" className={`${bar} mt-3 h-2.5 w-1/2`} />}
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
        </SlideIn>

        <SlideIn delay={0.18} className="mt-16">
          <p className={eyebrow}>{t.agentsEyebrow}</p>
          <h3 className={subheading}>{t.agentsTitle}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">{t.agentsSubtitle}</p>

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {aiModels.map((model) => (
              <article key={model.id} className={`${card} flex flex-col p-6 sm:p-8`}>
                <div className="flex items-start gap-4">
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-zinc-950">
                    <BrandIcon icon={model.icon} className="size-8" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-mono text-xs tracking-wide text-violet-400 uppercase">{t[model.copy.role]}</p>
                    <h4 className="mt-1 text-xl font-semibold tracking-tight text-white sm:text-2xl">{model.name}</h4>
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
        </SlideIn>
      </div>
    </section>
  );
}
