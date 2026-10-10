import type { ReactNode } from "react";
import JourneyNode from "@/components/JourneyNode";
import Orchestration3D from "@/components/Orchestration3D";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type ServiceCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon: ReactNode;
  points: string[];
  className?: string;
  floating?: boolean;
  children?: ReactNode;
};

function ServiceCard({
  eyebrow,
  title,
  description,
  icon,
  points,
  className = "",
  floating = false,
  children,
}: ServiceCardProps) {
  return (
    <article
      className={
        "group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] p-6 " +
        (floating ? "bg-zinc-950/20 " : "bg-zinc-900/40 backdrop-blur-xl ") +
        "shadow-[inset_0_1px_0_0_rgb(255_255_255/0.06)] transition-colors duration-200 hover:border-indigo-500/30 sm:p-8 " +
        className
      }
    >
      <div className="flex size-10 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-300">
        {icon}
      </div>
      <p className="mt-6 font-mono text-xs tracking-wide text-violet-400 uppercase">{eyebrow}</p>
      <h3 className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">{title}</h3>
      <p className="mt-3 max-w-prose text-[0.9375rem] leading-relaxed text-zinc-400">{description}</p>
      <ul className="mt-6 space-y-2.5">
        {points.map((point) => (
          <li key={point} className="flex items-start gap-3 text-sm text-zinc-300">
            <span aria-hidden="true" className="mt-[0.45rem] size-1.5 shrink-0 rounded-full bg-indigo-500" />
            {point}
          </li>
        ))}
      </ul>
      {children}
    </article>
  );
}

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  className: "size-5",
  "aria-hidden": true,
} as const;

type ServicesBentoProps = {
  t: Dictionary["services"];
  orchestration: Dictionary["orchestration"];
};

export default function ServicesBento({ t, orchestration }: ServicesBentoProps) {
  return (
    <section className="px-4 pb-16 sm:px-6 sm:pb-20">
      <div className="mx-auto max-w-6xl lg:pl-20">
        <div id="servicios" className="journey-anchor relative max-w-2xl">
          <JourneyNode index="02" />
          <p className="font-mono text-xs tracking-wide text-indigo-400 uppercase">{t.eyebrow}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-balance text-white sm:text-4xl">
            {t.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-400 sm:text-lg">
            {t.subtitle}
          </p>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-5 lg:grid-rows-2">
          <ServiceCard
            className="lg:col-span-2"
            {...t.agents}
            icon={
              <svg {...iconProps}>
                <circle cx="12" cy="12" r="3" />
                <circle cx="5" cy="5" r="1.5" />
                <circle cx="19" cy="5" r="1.5" />
                <circle cx="5" cy="19" r="1.5" />
                <circle cx="19" cy="19" r="1.5" />
                <path d="m6.1 6.1 3.8 3.8m4.2 0 3.8-3.8M6.1 17.9l3.8-3.8m4.2 0 3.8 3.8" />
              </svg>
            }
          />

          <ServiceCard
            className="lg:col-span-3 lg:col-start-3 lg:row-span-2 lg:row-start-1"
            {...t.orchestration}
            floating
            icon={
              <svg {...iconProps}>
                <rect x="3" y="4" width="6" height="5" rx="1.5" />
                <rect x="15" y="4" width="6" height="5" rx="1.5" />
                <rect x="9" y="15" width="6" height="5" rx="1.5" />
                <path d="M6 9v2.5a1.5 1.5 0 0 0 1.5 1.5h9a1.5 1.5 0 0 0 1.5-1.5V9M12 13v2" />
              </svg>
            }
          >
            <div className="relative -mx-6 mt-8 overflow-hidden sm:mx-0">
              <Orchestration3D t={orchestration} />
            </div>
          </ServiceCard>

          <ServiceCard
            className="lg:col-span-2"
            {...t.systems}
            icon={
              <svg {...iconProps}>
                <path d="m8 8-4 4 4 4m8-8 4 4-4 4M13.5 5l-3 14" />
              </svg>
            }
          />
        </div>
      </div>
    </section>
  );
}
