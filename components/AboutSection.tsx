import JourneyNode from "@/components/JourneyNode";
import type { Dictionary } from "@/lib/i18n/dictionaries";

function NodeGlyph() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="2.5" />
      <circle cx="4.5" cy="7" r="1.5" />
      <circle cx="19.5" cy="7" r="1.5" />
      <circle cx="12" cy="20.5" r="1.5" />
      <path d="M6 7.9 9.9 10.7M18 7.9l-3.9 2.8M12 14.5V19" />
    </svg>
  );
}

export default function AboutSection({ t }: { t: Dictionary["about"] }) {
  return (
    <section className="px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16 lg:pl-20">
        <div id="nosotros" className="journey-anchor relative">
          <JourneyNode index="01" />
          <p className="font-mono text-xs tracking-wide text-indigo-400 uppercase">{t.eyebrow}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-balance text-white sm:text-4xl">
            {t.title}
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-zinc-400">
            {t.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <ul className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {t.connections.map((item) => (
              <li key={item.title} className="border-l border-indigo-500/30 pl-4">
                <p className="text-sm font-medium text-white">{item.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{item.description}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative flex flex-col justify-center">
          <div
            aria-hidden="true"
            className="absolute top-12 bottom-12 left-[2.375rem] w-px bg-gradient-to-b from-indigo-500/0 via-indigo-500/40 to-indigo-500/0 sm:left-[2.625rem]"
          />
          <div className="space-y-4">
            {[t.mission, t.vision].map((statement) => (
              <article
                key={statement.label}
                className="relative rounded-2xl border border-white/[0.08] bg-zinc-900/40 p-6 shadow-[inset_0_1px_0_0_rgb(255_255_255/0.06)] backdrop-blur-xl sm:p-7"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-full border border-indigo-500/30 bg-zinc-950 text-indigo-300">
                    <NodeGlyph />
                  </span>
                  <h3 className="font-mono text-xs tracking-wide text-violet-400 uppercase">{statement.label}</h3>
                </div>
                <p className="mt-4 text-lg leading-relaxed text-pretty text-zinc-200">{statement.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
