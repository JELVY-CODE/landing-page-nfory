import type { Locale } from "@/lib/i18n/config";
import de from "@/data/content/de";
import en from "@/data/content/en";
import es, { type Dictionary } from "@/data/content/es";
import ja from "@/data/content/ja";
import ko from "@/data/content/ko";
import ru from "@/data/content/ru";
import zh from "@/data/content/zh";

const dictionaries: Record<Locale, Dictionary> = { es, en, ko, ja, zh, de, ru };

export const getDictionary = (locale: Locale): Dictionary => dictionaries[locale];

export type { Dictionary };
