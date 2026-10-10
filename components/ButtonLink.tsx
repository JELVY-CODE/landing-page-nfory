import type { ReactNode } from "react";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  size?: "sm" | "md";
  className?: string;
  onClick?: () => void;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap " +
  "transition-[scale,background-color,border-color,color,box-shadow] duration-150 ease-out-strong " +
  "active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500";

const variants = {
  primary:
    "bg-[#5D5FEF] text-white shadow-[0_0_0_1px_rgb(255_255_255/0.08)_inset,0_8px_24px_-8px_rgb(99_102_241/0.6)] " +
    "hover:bg-indigo-600 hover:shadow-[0_0_0_1px_rgb(255_255_255/0.12)_inset,0_10px_32px_-8px_rgb(139_92_246/0.7)]",
  secondary:
    "border border-white/10 bg-white/[0.03] text-zinc-200 backdrop-blur-md " +
    "hover:border-white/20 hover:bg-white/[0.06] hover:text-white",
} as const;

const sizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-[0.9375rem]",
} as const;

export default function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
}: ButtonLinkProps) {
  return (
    <a href={href} onClick={onClick} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </a>
  );
}
