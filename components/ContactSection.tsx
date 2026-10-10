import ContactForm from "@/components/ContactForm";
import JourneyNode from "@/components/JourneyNode";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { site } from "@/data/site";

export default function ContactSection({ locale, t }: { locale: Locale; t: Dictionary["contact"] }) {
  return (
    <section className="px-4 pb-24 sm:px-6 sm:pb-32">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16 lg:pl-20">
        <div id="contacto" className="journey-anchor relative">
          <JourneyNode index="04" />
          <p className="font-mono text-xs tracking-wide text-indigo-400 uppercase">{t.eyebrow}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-balance text-white sm:text-4xl">{t.title}</h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-400">{t.description}</p>

          <ol className="mt-10 space-y-6">
            {t.steps.map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-indigo-500/30 bg-indigo-500/10 font-mono text-xs text-indigo-300">
                  {index + 1}
                </span>
                <div>
                  <p className="text-sm font-medium text-white">{step.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-zinc-400">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>

          <p className="mt-10 text-sm text-zinc-500">
            {t.directEmail}{" "}
            <a
              href={`mailto:${site.contactEmail}`}
              className="text-indigo-300 underline-offset-4 transition-colors duration-150 hover:text-indigo-200 hover:underline"
            >
              {site.contactEmail}
            </a>
          </p>
        </div>

        <div className="relative rounded-2xl border border-white/[0.08] bg-zinc-900/40 p-6 shadow-[inset_0_1px_0_0_rgb(255_255_255/0.06)] backdrop-blur-xl sm:p-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -top-px mx-auto h-px max-w-sm bg-gradient-to-r from-transparent via-indigo-500/70 to-transparent"
          />
          <ContactForm locale={locale} t={t.form} />
        </div>
      </div>
    </section>
  );
}
