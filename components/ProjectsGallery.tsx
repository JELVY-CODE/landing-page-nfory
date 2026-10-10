import GalleryCard from "@/components/GalleryCard";
import JourneyNode from "@/components/JourneyNode";
import MarqueeRow from "@/components/MarqueeRow";
import { galleryRows } from "@/data/gallery";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export default function ProjectsGallery({ locale, t }: { locale: Locale; t: Dictionary["projects"] }) {
  return (
    <section className="pb-24 sm:pb-32">
      <div className="px-4 sm:px-6">
        <div className="mx-auto max-w-6xl lg:pl-20">
          <div id="proyectos" className="journey-anchor relative max-w-2xl">
            <JourneyNode index="03" />
            <p className="font-mono text-xs tracking-wide text-indigo-400 uppercase">{t.eyebrow}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-balance text-white sm:text-4xl">
              {t.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-zinc-400 sm:text-lg">
              {t.subtitle}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12 space-y-4">
        {galleryRows.map((row, index) => (
          <MarqueeRow
            key={index}
            reverse={index % 2 === 1}
            labels={{ region: t.row.replace("{n}", String(index + 1)), carousel: t.carousel, previous: t.previous, next: t.next }}
          >
            {row.map((item) => (
              <GalleryCard key={item.id} item={item} locale={locale} badges={{ service: t.serviceBadge, useCase: t.badge }} />
            ))}
          </MarqueeRow>
        ))}
      </div>
    </section>
  );
}
