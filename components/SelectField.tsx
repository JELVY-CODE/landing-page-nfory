'use client';

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

export type SelectOption = { value: string; label: string };

type SelectFieldProps = {
  id: string;
  name: string;
  options: SelectOption[];
  placeholder: string;
  defaultValue?: string;
  className: string;
  invalid?: boolean;
  describedBy?: string;
  onChange?: (value: string) => void;
};

export default function SelectField({ id, name, options, placeholder, defaultValue = "", className, invalid, describedBy, onChange }: SelectFieldProps) {
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const typeahead = useRef({ query: "", timer: 0 });

  const selectedIndex = options.findIndex((option) => option.value === value);
  const selected = options[selectedIndex];

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]);

  const openList = () => {
    setActive(Math.max(0, selectedIndex));
    setOpen(true);
  };

  const choose = (index: number) => {
    const option = options[index];
    if (!option) return;
    setValue(option.value);
    setOpen(false);
    onChange?.(option.value);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const last = options.length - 1;
    const keys: Record<string, () => void> = {
      ArrowDown: () => (open ? setActive((index) => Math.min(last, index + 1)) : openList()),
      ArrowUp: () => (open ? setActive((index) => Math.max(0, index - 1)) : openList()),
      Home: () => open && setActive(0),
      End: () => open && setActive(last),
      Enter: () => (open ? choose(active) : openList()),
      " ": () => (open ? choose(active) : openList()),
      Escape: () => setOpen(false),
    };
    const action = keys[event.key];
    if (action) {
      event.preventDefault();
      action();
      return;
    }
    if (event.key === "Tab") return setOpen(false);
    if (event.key.length === 1) {
      const state = typeahead.current;
      window.clearTimeout(state.timer);
      state.query += event.key.toLowerCase();
      state.timer = window.setTimeout(() => (state.query = ""), 500);
      const match = options.findIndex((option) => option.label.toLowerCase().startsWith(state.query));
      if (match >= 0) (open ? setActive : choose)(match);
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <input type="hidden" name={name} value={value} />
      <button
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? `${listId}-${active}` : undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        className={`${className} flex h-11 items-center justify-between gap-3 text-left`}
      >
        <span className={selected ? "truncate text-white" : "truncate text-zinc-600"}>{selected?.label ?? placeholder}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className={`size-4 shrink-0 text-zinc-500 transition-transform duration-200 ease-out-strong ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m4 6 4 4 4-4" />
        </svg>
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-labelledby={id}
          className="popover-in absolute top-full right-0 left-0 z-30 mt-2 origin-top overflow-hidden rounded-xl border border-white/10 bg-zinc-900/95 p-1 shadow-[0_24px_48px_-12px_rgb(0_0_0/0.6)] backdrop-blur-xl"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            return (
              <li
                key={option.value}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={isSelected}
                onPointerEnter={() => setActive(index)}
                onPointerDown={(event) => event.preventDefault()}
                onClick={() => choose(index)}
                className={
                  "flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors duration-100 " +
                  (index === active ? "bg-indigo-500/15 text-white " : "text-zinc-300 ") +
                  (isSelected ? "font-medium" : "")
                }
              >
                {option.label}
                {isSelected && (
                  <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 text-indigo-300" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m3.5 8.5 3 3 6-7" />
                  </svg>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
