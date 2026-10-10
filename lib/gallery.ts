import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";

export type LocalizedText = Partial<Record<Locale, string>>;

export type GalleryVisual = "rag" | "pipeline" | "saas" | "docs" | "roadmap" | "crm" | "dashboard" | "monitor";

export type GalleryItem = {
  id: string;
  kind: "service" | "useCase";
  category: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  tags: string[];
  visual: GalleryVisual;
  image?: string;
  imageAlt?: LocalizedText;
};

export const localize = (text: LocalizedText | undefined, locale: Locale) => text?.[locale] ?? text?.[DEFAULT_LOCALE] ?? "";
