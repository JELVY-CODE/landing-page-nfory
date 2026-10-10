import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { DEFAULT_LOCALE, LOCALES, hasLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export const alt = "NFory · AI Engineering & Process Automation";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const LATIN_LOCALES = new Set(["es", "en", "de"]);

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

const NODES = [
  [140, 120], [300, 70], [470, 160], [210, 300], [90, 470], [380, 420], [560, 540], [1060, 90], [940, 210], [1120, 330], [990, 470], [1110, 560],
] as const;
const LINKS = [
  [0, 1], [1, 2], [0, 3], [3, 5], [4, 3], [5, 6], [7, 8], [8, 9], [9, 10], [10, 11], [8, 10],
] as const;

export default async function OpengraphImage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = hasLocale(lang) && LATIN_LOCALES.has(lang) ? lang : hasLocale(lang) ? "en" : DEFAULT_LOCALE;
  const { hero } = getDictionary(locale);

  const icon = await readFile(join(process.cwd(), "public/images/icono-nfory.svg"));
  const iconSrc = `data:image/svg+xml;base64,${icon.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "radial-gradient(ellipse at 50% 45%, #1e1b4b 0%, #0d0c1a 45%, #09090B 80%)",
          color: "#FAFAFA",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        <svg width="1200" height="630" viewBox="0 0 1200 630" style={{ position: "absolute", top: 0, left: 0 }}>
          {LINKS.map(([a, b]) => (
            <line key={`${a}-${b}`} x1={NODES[a][0]} y1={NODES[a][1]} x2={NODES[b][0]} y2={NODES[b][1]} stroke="#8B5CF6" strokeOpacity="0.35" strokeWidth="1.5" />
          ))}
          {NODES.map(([x, y], index) => (
            <circle key={index} cx={x} cy={y} r="5" fill="#A78BFA" fillOpacity="0.85" />
          ))}
        </svg>

        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse no admite next/image */}
          <img src={iconSrc} width={92} height={92} alt="" />
          <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: "-0.03em" }}>NFory</div>
        </div>

        <div
          style={{
            marginTop: 34,
            display: "flex",
            padding: "8px 22px",
            borderRadius: 999,
            border: "1px solid rgba(99,102,241,0.45)",
            background: "rgba(99,102,241,0.12)",
            color: "#C7D2FE",
            fontSize: 24,
            letterSpacing: "0.02em",
          }}
        >
          {hero.badge}
        </div>

        <div style={{ marginTop: 30, display: "flex", fontSize: 54, fontWeight: 700, letterSpacing: "-0.03em" }}>
          {hero.titleLead}&nbsp;<span style={{ color: "#A1A1AA" }}>{hero.titleAccent}</span>
        </div>

        <div style={{ position: "absolute", bottom: 40, display: "flex", fontSize: 22, color: "#8B8BA3" }}>nfory.com</div>
      </div>
    ),
    size,
  );
}
