import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";

/** Texto por idioma; si falta una traducción se usa el español. */
export type LocalizedText = Partial<Record<Locale, string>>;

export type GalleryItem = {
  id: string;
  category: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  /** Ruta en /public/images/. Vacío = marcador de imagen. */
  image: string;
  imageAlt: LocalizedText;
};

export const localize = (text: LocalizedText, locale: Locale) => text[locale] ?? text[DEFAULT_LOCALE] ?? "";
