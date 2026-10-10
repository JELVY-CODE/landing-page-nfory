import Image from "next/image";
import { localize, type GalleryItem } from "@/lib/gallery";
import type { Locale } from "@/lib/i18n/config";

function ImagePlaceholder() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-zinc-900/80 text-zinc-700">
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-10" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="16" rx="2.5" />
        <circle cx="8.5" cy="9.5" r="1.5" />
        <path d="m21 15-4.5-4.5L7 20" />
      </svg>
    </div>
  );
}

function TextPlaceholder({ className }: { className: string }) {
  return <span aria-hidden="true" className={`block rounded-full bg-white/[0.06] ${className}`} />;
}

type GalleryCardProps = { item: GalleryItem; locale: Locale; emptyLabel: string };

export default function GalleryCard({ item: raw, locale, emptyLabel }: GalleryCardProps) {
  const item = {
    category: localize(raw.category, locale),
    title: localize(raw.title, locale),
    description: localize(raw.description, locale),
    image: raw.image,
    imageAlt: localize(raw.imageAlt, locale),
  };

  return (
    <article
      aria-label={item.title || emptyLabel}
      className={
        "w-[20rem] shrink-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-900/80 " +
        "shadow-[inset_0_1px_0_0_rgb(255_255_255/0.06)] transition-colors duration-200 hover:border-indigo-500/30 sm:w-[22rem]"
      }
    >
      <div className="relative aspect-[16/10] border-b border-white/[0.06]">
        {item.image ? (
          <Image src={item.image} alt={item.imageAlt} fill sizes="22rem" className="object-cover" />
        ) : (
          <ImagePlaceholder />
        )}
      </div>

      <div className="p-5">
        {item.category ? (
          <p className="font-mono text-xs tracking-wide text-violet-400 uppercase">{item.category}</p>
        ) : (
          <TextPlaceholder className="h-2.5 w-24" />
        )}

        {item.title ? (
          <h3 className="mt-3 text-lg font-semibold tracking-tight text-white">{item.title}</h3>
        ) : (
          <TextPlaceholder className="mt-4 h-4 w-3/4" />
        )}

        {item.description ? (
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">{item.description}</p>
        ) : (
          <div className="mt-4 space-y-2">
            <TextPlaceholder className="h-2.5 w-full" />
            <TextPlaceholder className="h-2.5 w-5/6" />
            <TextPlaceholder className="h-2.5 w-2/3" />
          </div>
        )}
      </div>
    </article>
  );
}
