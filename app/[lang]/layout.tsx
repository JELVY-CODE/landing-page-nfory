import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import Analytics, { analyticsEnabled } from "@/components/Analytics";
import CookieConsent from "@/components/CookieConsent";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { LOCALES, OG_LOCALES, hasLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { meta } = getDictionary(lang);

  return {
    metadataBase: new URL("https://nfory.com"),
    title: meta.title,
    description: meta.description,
    applicationName: "NFory",
    authors: [{ name: "NFory", url: "https://nfory.com" }],
    keywords: ["NFory", "inteligencia artificial", "AI engineering", "automatización de procesos", "process automation", "RAG", "agentes de IA", "AI agents", "consultoría"],
    alternates: {
      canonical: `/${lang}`,
      languages: Object.fromEntries(LOCALES.map((locale) => [locale, `/${locale}`])),
    },
    icons: {
      icon: { url: "/images/favicon-nfory.svg?v=6", type: "image/svg+xml" },
      apple: "/images/isotipo-nfory.svg",
    },
    openGraph: {
      title: meta.title,
      description: meta.ogDescription,
      url: `https://nfory.com/${lang}`,
      siteName: "NFory",
      locale: OG_LOCALES[lang],
      alternateLocale: LOCALES.filter((locale) => locale !== lang).map((locale) => OG_LOCALES[locale]),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.ogDescription,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#09090B",
};

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <html
      suppressHydrationWarning
      lang={lang}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-zinc-950 font-sans text-zinc-50">
        {children}
        {analyticsEnabled && <CookieConsent t={getDictionary(lang).consent} privacyHref={`/${lang}/privacidad`} />}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
