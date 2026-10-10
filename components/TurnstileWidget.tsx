'use client';

import { useEffect, useRef } from "react";
import type { Locale } from "@/lib/i18n/config";

type Turnstile = {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
let scriptPromise: Promise<Turnstile> | null = null;

const loadTurnstile = () => {
  scriptPromise ??= new Promise<Turnstile>((resolve, reject) => {
    if (window.turnstile) return resolve(window.turnstile);
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error("turnstile")));
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error("turnstile"));
    };
    document.head.appendChild(script);
  });
  return scriptPromise;
};

export default function TurnstileWidget({ siteKey, locale, resetKey }: { siteKey: string; locale: Locale; resetKey: unknown }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let cancelled = false;

    loadTurnstile()
      .then((turnstile) => {
        if (cancelled) return;
        widgetRef.current = turnstile.render(container, {
          sitekey: siteKey,
          theme: "dark",
          language: locale,
          appearance: "interaction-only",
          "response-field-name": "cf-turnstile-response",
        });
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      if (widgetRef.current) window.turnstile?.remove(widgetRef.current);
      widgetRef.current = null;
    };
  }, [siteKey, locale]);

  useEffect(() => {
    if (widgetRef.current) window.turnstile?.reset(widgetRef.current);
  }, [resetKey]);

  return <div ref={containerRef} className="sm:col-span-2 empty:hidden" />;
}
