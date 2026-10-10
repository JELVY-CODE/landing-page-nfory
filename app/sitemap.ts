import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { DEFAULT_LOCALE, LOCALES } from "@/lib/i18n/config";

const origin = `https://${site.domain}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = {
    ...Object.fromEntries(LOCALES.map((locale) => [locale, `${origin}/${locale}`])),
    "x-default": `${origin}/${DEFAULT_LOCALE}`,
  };

  return LOCALES.map((locale) => ({
    url: `${origin}/${locale}`,
    changeFrequency: "monthly",
    priority: locale === DEFAULT_LOCALE ? 1 : 0.8,
    alternates: { languages },
  }));
}
