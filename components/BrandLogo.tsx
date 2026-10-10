import Image from "next/image";

type BrandLogoProps = {
  size?: "md" | "lg";
  className?: string;
};

const sizes = {
  md: { icon: "size-8", text: "text-lg" },
  lg: { icon: "size-12", text: "text-2xl" },
} as const;

export default function BrandLogo({ size = "md", className = "" }: BrandLogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Image
        src="/images/icono-nfory.svg"
        alt=""
        width={297}
        height={297}
        preload={size === "lg"}
        fetchPriority={size === "lg" ? "high" : undefined}
        className={sizes[size].icon}
      />
      <span className={`${sizes[size].text} font-semibold tracking-[-0.035em] text-white`}>NFory</span>
    </span>
  );
}
