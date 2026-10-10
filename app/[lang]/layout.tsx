import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
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
    alternates: {
      canonical: `/${lang}`,
      languages: Object.fromEntries(LOCALES.map((locale) => [locale, `/${locale}`])),
    },
    icons: {
      icon: "/images/isotipo-nfory.svg",
      apple: "/images/isotipo-nfory.svg",
    },
    openGraph: {
      title: meta.ogTitle,
      description: meta.ogDescription,
      url: `https://nfory.com/${lang}`,
      siteName: "NFory",
      locale: OG_LOCALES[lang],
      type: "website",
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
    // Algunas extensiones del navegador inyectan atributos en <html> antes de hidratar.
    <html
      suppressHydrationWarning
      lang={lang}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-zinc-950 font-sans text-zinc-50">{children}</body>
    </html>
  );
}
