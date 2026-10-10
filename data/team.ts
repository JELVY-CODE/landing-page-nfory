import { siAnthropic, siClaude, type SimpleIcon } from "simple-icons";
import type { LocalizedText } from "@/lib/gallery";

export type TeamMember = {
  id: string;
  name: string;
  role: LocalizedText;
  /** Ruta en /public/images/. Sin foto se muestra un avatar con sus iniciales. */
  photo?: string;
  linkedin?: string;
  github?: string;
};

// Solo personas reales: añade cada integrante con su cargo y sus perfiles verificados.
export const teamMembers: TeamMember[] = [
  {
    id: "jesus-lizarraga",
    name: "Jesús Lizárraga",
    role: {
      es: "CEO & Co-Founder",
      en: "CEO & Co-Founder",
      ko: "CEO & 공동 창업자",
      ja: "CEO & 共同創業者",
      zh: "CEO & 联合创始人",
      de: "CEO & Mitgründer",
      ru: "CEO и сооснователь",
    },
    photo: "/images/avatar-jesus-lizarraga.svg",
  },
];

export type AiModel = {
  id: string;
  name: string;
  icon: SimpleIcon;
  vendor: SimpleIcon;
  copy: { role: "claudeRole" | "opusRole"; description: "claudeDescription" | "opusDescription"; capabilities: "claudeCapabilities" | "opusCapabilities" };
};

export const aiModels: AiModel[] = [
  {
    id: "claude",
    name: "Claude",
    icon: siClaude,
    vendor: siAnthropic,
    copy: { role: "claudeRole", description: "claudeDescription", capabilities: "claudeCapabilities" },
  },
  {
    id: "claude-opus",
    name: "Claude Opus 5.5",
    icon: siClaude,
    vendor: siAnthropic,
    copy: { role: "opusRole", description: "opusDescription", capabilities: "opusCapabilities" },
  },
];
