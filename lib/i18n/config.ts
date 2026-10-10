export const LOCALES = ["es", "en", "ko", "ja", "zh", "de", "ru"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "es";

export const LOCALE_NAMES: Record<Locale, string> = {
  es: "Español",
  en: "English",
  ko: "한국어",
  ja: "日本語",
  zh: "中文",
  de: "Deutsch",
  ru: "Русский",
};

export const OG_LOCALES: Record<Locale, string> = {
  es: "es_ES",
  en: "en_US",
  ko: "ko_KR",
  ja: "ja_JP",
  zh: "zh_CN",
  de: "de_DE",
  ru: "ru_RU",
};

export const hasLocale = (value: string): value is Locale => (LOCALES as readonly string[]).includes(value);
