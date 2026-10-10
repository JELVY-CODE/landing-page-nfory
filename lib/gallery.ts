import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";

/** Texto por idioma; si falta una traducción se usa el español. */
export type LocalizedText = Partial<Record<Locale, string>>;

/** Ilustración vectorial de la tarjeta cuando no hay imagen propia. */
export type GalleryVisual = "rag" | "pipeline" | "saas" | "docs" | "roadmap" | "crm" | "dashboard" | "monitor";

export type GalleryItem = {
  id: string;
  /** Servicio de consultoría o caso de uso de referencia (define la etiqueta de la tarjeta). */
  kind: "service" | "useCase";
  category: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  tags: string[];
  visual: GalleryVisual;
  /** Ruta en /public/images/ (opcional): sustituye a la ilustración. */
  image?: string;
  imageAlt?: LocalizedText;
};

export const localize = (text: LocalizedText | undefined, locale: Locale) => text?.[locale] ?? text?.[DEFAULT_LOCALE] ?? "";
