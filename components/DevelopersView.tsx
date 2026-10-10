import Image from "next/image";
import BrandIcon from "@/components/BrandIcon";
import { SOCIAL_ICONS } from "@/components/SocialLinks";
import { aiModels, teamMembers } from "@/data/team";
import { localize } from "@/lib/gallery";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const card = "rounded-2xl border border-white/[0.08] bg-zinc-900/40 shadow-[inset_0_1px_0_0_rgb(255_255_255/0.06)] backdrop-blur-xl";
const eyebrow = "font-mono text-xs tracking-wide text-indigo-400 uppercase";
const subheading = "mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl";
const NETWORKS = [
  { id: "linkedin", name: "LinkedIn" },
  { id: "github", name: "GitHub" },
] as const;

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

// Contenido de la vista "Desarrolladores" (nodo 00), que <DevelopersTransition /> muestra como una página aparte.
export default function DevelopersView({ locale, t }: { locale: Locale; t: Dictionary["team"] }) {
  return (
    <section aria-labelledby="developers-title" className="pb-24 sm:pb-32">
      <div className="mx-auto max-w-6xl lg:pl-20">
        <div className="relative max-w-2xl">
          <span
            data-developers-node=""
            data-active="false"
            aria-hidden="true"
            className={
              "absolute -top-4 -left-14 hidden size-12 -translate-x-1/2 items-center justify-center rounded-full border border-white/10 bg-zinc-950 font-mono text-xs text-zinc-500 " +
              "transition-[border-color,color,box-shadow,scale] duration-500 ease-out-strong lg:flex " +
              "data-[active=true]:border-violet-500/70 data-[active=true]:text-white data-[active=true]:shadow-[0_0_0_6px_rgb(139_92_246/0.1),0_0_32px_-4px_rgb(139_92_246/0.7)]"
            }
          >
            00
          </span>
          <p className={eyebrow}>{t.eyebrow}</p>
          <h2 id="developers-title" className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-balance text-white sm:text-5xl">{t.title}</h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-400 sm:text-lg">{t.subtitle}</p>
        </div>

        <div className="mt-14">
          <p className={eyebrow}>{t.membersEyebrow}</p>
          <h3 className={subheading}>{t.membersTitle}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">{t.membersSubtitle}</p>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member) => (
                <li key={member.id} className={`${card} flex flex-col p-6`}>
                  <div className="relative size-20 overflow-hidden rounded-full p-[2px] [background:linear-gradient(135deg,#6366F1,#8B5CF6)] shadow-[0_0_28px_-6px_rgb(139_92_246/0.7)]">
                    <div className="relative flex size-full items-center justify-center overflow-hidden rounded-full bg-zinc-950">
                      {member.photo ? (
                        <Image src={member.photo} alt={member.name} fill sizes="5rem" className="object-cover" />
                      ) : (
                        <span aria-hidden="true" className="text-xl font-semibold tracking-tight text-white">
                          {initials(member.name)}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="mt-5 text-lg font-semibold tracking-tight text-white">{member.name}</p>
                  <p className="mt-1 font-mono text-xs tracking-wide text-violet-400 uppercase">{localize(member.role, locale)}</p>
                  <div className="mt-5 flex gap-1">
                    {NETWORKS.filter((network) => member[network.id]).map((network) => (
                      <a
                        key={network.id}
                        href={member[network.id]}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name} · ${network.name}`}
                        className="flex size-9 items-center justify-center rounded-full border border-white/10 text-zinc-300 transition-[color,background-color,border-color,scale] duration-150 ease-out-strong hover:border-indigo-400/50 hover:bg-indigo-500/10 hover:text-white active:scale-95"
                      >
                        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="currentColor">
                          {SOCIAL_ICONS[network.id]}
                        </svg>
                      </a>
                    ))}
                  </div>
                </li>
            ))}
          </ul>
        </div>

        <div className="mt-16">
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
        </div>
      </div>
    </section>
  );
}
