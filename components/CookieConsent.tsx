'use client';

import { useSyncExternalStore } from "react";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Choice = "granted" | "denied";

const KEY = "nfory:consent";
const EVENT = "nfory:consent";
let memory: Choice | null = null;

const read = (): Choice | null => {
  try {
    const value = localStorage.getItem(KEY);
    return value === "granted" || value === "denied" ? value : memory;
  } catch {
    return memory;
  }
};

const subscribe = (callback: () => void) => {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
};

const choose = (choice: Choice) => {
  memory = choice;
  try {
    localStorage.setItem(KEY, choice);
  } catch {}
  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  gtag?.("consent", "update", { analytics_storage: choice });
  window.dispatchEvent(new Event(EVENT));
};

export default function CookieConsent({ t }: { t: Dictionary["consent"] }) {
  const choice = useSyncExternalStore(subscribe, read, () => "pending" as const);
  if (choice !== null) return null;

  return (
    <div
      role="region"
      aria-label={t.label}
      className={
        "popover-in fixed inset-x-4 bottom-4 z-[60] mx-auto max-w-md rounded-2xl border border-white/10 bg-zinc-900/90 p-5 " +
        "shadow-2xl shadow-black/50 backdrop-blur-xl sm:inset-x-auto sm:right-6 sm:bottom-6"
      }
    >
      <p className="text-sm leading-relaxed text-zinc-300">{t.message}</p>
      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => choose("denied")}
          className="rounded-full px-4 py-2 text-sm text-zinc-300 transition-[color,background-color,scale] duration-150 ease-out-strong hover:bg-white/[0.06] hover:text-white active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-violet-500"
        >
          {t.reject}
        </button>
        <button
          type="button"
          onClick={() => choose("granted")}
          className="rounded-full bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-[background-color,scale] duration-150 ease-out-strong hover:bg-indigo-400 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
        >
          {t.accept}
        </button>
      </div>
    </div>
  );
}
