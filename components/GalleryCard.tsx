import Image from "next/image";
import { localize, type GalleryItem, type GalleryVisual } from "@/lib/gallery";
import type { Locale } from "@/lib/i18n/config";

const INDIGO = "#6366F1";
const VIOLET = "#8B5CF6";
const LILAC = "#A78BFA";

// Ilustraciones vectoriales ligeras (sin imágenes externas) que representan cada tipo de caso de uso.
const VISUALS: Record<GalleryVisual, React.ReactNode> = {
  rag: (
    <>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
        const x = 160 + Math.cos(angle) * 92;
        const y = 100 + Math.sin(angle) * 62;
        return (
          <g key={i}>
            <line x1="160" y1="100" x2={x} y2={y} stroke={LILAC} strokeOpacity="0.35" strokeDasharray="3 4" />
            <rect x={x - 13} y={y - 9} width="26" height="18" rx="3" fill="#13131c" stroke={INDIGO} strokeOpacity="0.8" />
            <line x1={x - 7} y1={y - 2} x2={x + 7} y2={y - 2} stroke={LILAC} strokeOpacity="0.7" />
            <line x1={x - 7} y1={y + 3} x2={x + 3} y2={y + 3} stroke={LILAC} strokeOpacity="0.45" />
          </g>
        );
      })}
      <circle cx="160" cy="100" r="30" fill={VIOLET} fillOpacity="0.15" />
      <circle cx="160" cy="100" r="19" fill="#13131c" stroke={VIOLET} strokeWidth="1.5" />
      <path d="M152 100h16M160 92v16" stroke="#EDE9FE" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  pipeline: (
    <>
      <path d="M40 100h240" stroke={LILAC} strokeOpacity="0.3" strokeWidth="6" strokeLinecap="round" />
      <path d="M40 100h240" stroke={VIOLET} strokeWidth="2" strokeDasharray="6 10" strokeLinecap="round" />
      {[60, 125, 195, 260].map((x, i) => (
        <g key={x}>
          <rect x={x - 22} y={i % 2 ? 58 : 118} width="44" height="26" rx="6" fill="#13131c" stroke={i === 3 ? VIOLET : INDIGO} />
          <line x1={x} y1={i % 2 ? 84 : 118} x2={x} y2="100" stroke={LILAC} strokeOpacity="0.5" />
          <circle cx={x} cy="100" r="5" fill={i === 3 ? VIOLET : INDIGO} />
          <rect x={x - 13} y={(i % 2 ? 58 : 118) + 9} width="26" height="3" rx="1.5" fill={LILAC} fillOpacity="0.6" />
          <rect x={x - 13} y={(i % 2 ? 58 : 118) + 15} width="16" height="3" rx="1.5" fill={LILAC} fillOpacity="0.35" />
        </g>
      ))}
    </>
  ),
  saas: (
    <>
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={70 + i * 16}
          y={48 + i * 14}
          width="150"
          height="96"
          rx="8"
          fill="#13131c"
          stroke={i === 2 ? VIOLET : INDIGO}
          strokeOpacity={0.35 + i * 0.3}
        />
      ))}
      <rect x="102" y="76" width="150" height="16" rx="8" fill={INDIGO} fillOpacity="0.18" />
      <circle cx="113" cy="84" r="3" fill={VIOLET} />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={114 + i * 32} y={140 - (18 + i * 9)} width="18" height={18 + i * 9} rx="3" fill={i === 3 ? VIOLET : INDIGO} fillOpacity={0.45 + i * 0.15} />
      ))}
    </>
  ),
  docs: (
    <>
      {[2, 1, 0].map((i) => (
        <rect key={i} x={112 + i * 10} y={40 + i * 8} width="96" height="124" rx="6" fill="#13131c" stroke={INDIGO} strokeOpacity={0.3 + (2 - i) * 0.3} />
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x="126" y={62 + i * 16} width={i % 2 ? 50 : 68} height="5" rx="2.5" fill={LILAC} fillOpacity={i === 2 ? 0.9 : 0.35} />
      ))}
      <rect x="104" y="92" width="112" height="2" fill={VIOLET} />
      <rect x="104" y="86" width="112" height="14" fill={VIOLET} fillOpacity="0.12" />
      <circle cx="232" cy="134" r="14" fill="#13131c" stroke={VIOLET} strokeWidth="1.5" />
      <path d="m225 134 5 5 9-10" fill="none" stroke="#EDE9FE" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
};

type GalleryCardProps = { item: GalleryItem; locale: Locale; badge: string };

export default function GalleryCard({ item, locale, badge }: GalleryCardProps) {
  const title = localize(item.title, locale);

  return (
    <article
      aria-label={title}
      className={
        "flex w-[20rem] shrink-0 flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-900/80 " +
        "shadow-[inset_0_1px_0_0_rgb(255_255_255/0.06)] transition-colors duration-200 hover:border-indigo-500/30 sm:w-[22rem]"
      }
    >
      <div className="relative aspect-[16/10] border-b border-white/[0.06] bg-[radial-gradient(ellipse_at_center,rgb(99_102_241/0.14),transparent_70%)]">
        {item.image ? (
          <Image src={item.image} alt={localize(item.imageAlt, locale)} fill sizes="22rem" className="object-cover" />
        ) : (
          <svg aria-hidden="true" viewBox="0 0 320 200" className="absolute inset-0 size-full">
            {VISUALS[item.visual]}
          </svg>
        )}
        <span className="absolute top-3 left-3 rounded-full border border-white/10 bg-zinc-950/80 px-2.5 py-0.5 font-mono text-[10px] tracking-wide text-zinc-300 uppercase">
          {badge}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="font-mono text-xs tracking-wide text-violet-400 uppercase">{localize(item.category, locale)}</p>
        <h3 className="mt-3 text-lg font-semibold tracking-tight text-white">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">{localize(item.description, locale)}</p>
        <ul className="mt-auto flex flex-wrap gap-1.5 pt-4">
          {item.tags.map((tag) => (
            <li key={tag} className="rounded-full border border-indigo-500/25 bg-indigo-500/10 px-2.5 py-0.5 font-mono text-[11px] text-indigo-200">
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
