import type { SimpleIcon } from "simple-icons";

// Los logos casi negros (Next.js, Anthropic…) se pintan en claro para leerse sobre el fondo oscuro.
const isDark = (hex: string) => {
  const value = parseInt(hex, 16);
  const luminance = 0.2126 * ((value >> 16) & 255) + 0.7152 * ((value >> 8) & 255) + 0.0722 * (value & 255);
  return luminance < 60;
};

export default function BrandIcon({ icon, className = "size-6" }: { icon: SimpleIcon; className?: string }) {
  return (
    <svg role="img" aria-label={icon.title} viewBox="0 0 24 24" className={className} fill={isDark(icon.hex) ? "#F4F4F5" : `#${icon.hex}`}>
      <path d={icon.path} />
    </svg>
  );
}
