import { siAnthropic, siClaude, type SimpleIcon } from "simple-icons";
import type { LocalizedText } from "@/lib/gallery";

export type TeamMember = {
  id: string;
  name: string;
  role: LocalizedText;
  /** Ruta en /public/images/. Vacío = avatar de marcador. */
  photo: string;
  linkedin?: string;
  github?: string;
};

const emptyMember = (id: string): TeamMember => ({ id, name: "", role: {}, photo: "" });

export const teamMembers: TeamMember[] = ["m1", "m2", "m3", "m4"].map(emptyMember);

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
