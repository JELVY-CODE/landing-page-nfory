'use client';

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n/config";

const loadCalendar = () => import("@/components/Calendar");

const Calendar = dynamic(loadCalendar, {
  ssr: false,
  loading: () => <div className="h-[19.5rem] w-[17.75rem] animate-pulse rounded-xl bg-white/[0.03]" />,
});

const pad = (value: number) => String(value).padStart(2, "0");
const toIso = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const fromIso = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

type DateFieldProps = {
  id: string;
  name: string;
  locale: Locale;
  defaultValue?: string;
  placeholder: string;
  className: string;
  invalid?: boolean;
  describedBy?: string;
};

export default function DateField({ id, name, locale, defaultValue = "", placeholder, className, invalid, describedBy }: DateFieldProps) {
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const selected = value ? fromIso(value) : undefined;
  const label = selected
    ? new Intl.DateTimeFormat(locale, { weekday: "short", day: "numeric", month: "long", year: "numeric" }).format(selected)
    : placeholder;

  return (
    <div ref={rootRef} className="relative">
      <input type="hidden" name={name} value={value} />
      <button
        ref={triggerRef}
        id={id}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-describedby={describedBy}
        onPointerEnter={loadCalendar}
        onFocus={loadCalendar}
        onClick={() => setOpen((current) => !current)}
        className={`${className} flex h-11 items-center justify-between gap-3 text-left ${invalid ? "border-red-400/60 focus:ring-red-400/15" : ""}`}
      >
        <span className={selected ? "truncate text-white" : "truncate text-[#8B8B94]"}>{label}</span>
        <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 shrink-0 text-zinc-500" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round">
          <rect x="2.25" y="3" width="11.5" height="10.75" rx="2" />
          <path d="M2.25 6.5h11.5M5.5 1.75v2.5M10.5 1.75v2.5" />
        </svg>
      </button>

      {open && (
        <div
          role="dialog"
          aria-labelledby={id}
          className="popover-in absolute top-full left-0 z-30 mt-2 origin-top-left rounded-2xl border border-white/10 bg-zinc-900/95 p-3 shadow-[0_24px_48px_-12px_rgb(0_0_0/0.6)] backdrop-blur-xl"
        >
          <Calendar
            locale={locale}
            selected={selected}
            onSelect={(date) => {
              setValue(date ? toIso(date) : "");
              setOpen(false);
              triggerRef.current?.focus();
            }}
          />
        </div>
      )}
    </div>
  );
}
