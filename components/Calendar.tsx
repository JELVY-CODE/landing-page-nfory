'use client';

import { DayPicker } from "react-day-picker";
import { de, enUS, es, ja, ko, ru, zhCN } from "react-day-picker/locale";
import type { Locale } from "@/lib/i18n/config";

const LOCALES = { es, en: enUS, ko, ja, zh: zhCN, de, ru };

const MONTHS_AHEAD = 6;

type CalendarProps = {
  locale: Locale;
  selected?: Date;
  onSelect: (date: Date | undefined) => void;
};

export default function Calendar({ locale, selected, onSelect }: CalendarProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lastMonth = new Date(today.getFullYear(), today.getMonth() + MONTHS_AHEAD, 1);

  return (
    <DayPicker
      mode="single"
      locale={LOCALES[locale]}
      selected={selected}
      onSelect={onSelect}
      defaultMonth={selected ?? today}
      startMonth={today}
      endMonth={lastMonth}
      disabled={[{ before: today }, { dayOfWeek: [0, 6] }]}
      showOutsideDays
      fixedWeeks
      autoFocus
      classNames={{
        root: "relative text-sm text-zinc-200",
        months: "relative",
        month: "space-y-2",
        month_caption: "flex h-9 items-center px-2 text-sm font-medium text-white capitalize",
        nav: "absolute top-0 right-0 z-10 flex gap-1",
        button_previous:
          "flex size-9 items-center justify-center rounded-lg text-zinc-400 transition-colors duration-150 hover:bg-white/[0.06] hover:text-white disabled:pointer-events-none disabled:opacity-25",
        button_next:
          "flex size-9 items-center justify-center rounded-lg text-zinc-400 transition-colors duration-150 hover:bg-white/[0.06] hover:text-white disabled:pointer-events-none disabled:opacity-25",
        chevron: "size-4 fill-current",
        month_grid: "border-collapse",
        weekday: "size-10 pb-1 font-mono text-[11px] font-normal text-[#8B8B94] uppercase",
        day: "p-0.5 text-center",
        day_button:
          "relative flex size-9 items-center justify-center rounded-lg tabular-nums transition-[background-color,color,scale] duration-150 ease-out-strong " +
          "hover:bg-indigo-500/15 hover:text-white active:scale-95 focus-visible:outline-2 focus-visible:outline-violet-500",
        selected:
          "[&>button]:bg-[#5D5FEF] [&>button]:text-white [&>button]:shadow-[0_0_20px_-4px_rgb(99_102_241/0.9)] [&>button]:hover:bg-[#5D5FEF]",
        today:
          "[&>button]:font-semibold [&>button]:text-violet-300 [&>button]:after:absolute [&>button]:after:bottom-1 [&>button]:after:size-1 [&>button]:after:rounded-full [&>button]:after:bg-violet-400",
        outside: "[&>button]:text-zinc-700",
        disabled: "[&>button]:pointer-events-none [&>button]:text-zinc-700",
        hidden: "invisible",
      }}
    />
  );
}
