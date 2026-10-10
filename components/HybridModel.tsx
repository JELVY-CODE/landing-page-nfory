import type { Dictionary } from "@/lib/i18n/dictionaries";

export default function HybridModel({ t }: { t: Dictionary["model"] }) {
  return (
    <section className="px-4 pb-24 sm:px-6 sm:pb-32">
      <div className="mx-auto max-w-6xl lg:pl-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16">
          <div id="modelo" className="relative scroll-mt-28">
            <p className="font-mono text-xs tracking-wide text-indigo-400 uppercase">{t.eyebrow}</p>
            <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-balance text-white sm:text-3xl">
              {t.title}
            </h3>
            <p className="mt-4 text-base leading-relaxed text-zinc-400">
              {t.description}
            </p>
          </div>

          <dl className="grid gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.06] sm:grid-cols-2">
            {t.items.map((model) => (
              <div key={model.label} className="bg-zinc-950/80 p-6 backdrop-blur-xl sm:p-8">
                <dt>
                  <span className="font-mono text-xs tracking-wide text-violet-400 uppercase">{model.label}</span>
                  <span className="mt-3 block text-lg font-semibold tracking-tight text-white">{model.title}</span>
                </dt>
                <dd className="mt-3 text-[0.9375rem] leading-relaxed text-zinc-400">{model.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
