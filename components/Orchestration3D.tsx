'use client';

import { useEffect, useRef, useState } from "react";
import OrchestrationFlow from "@/components/OrchestrationFlow";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { OrchestrationScene } from "@/lib/orchestration-scene";
import { STAGES } from "@/lib/orchestration";

type Mode = "pending" | "3d" | "fallback";
type Phase = "idle" | "running" | "done";

const LOOP_PAUSE_MS = 1000;

const supportsWebGL = () => {
  try {
    return Boolean(document.createElement("canvas").getContext("webgl2"));
  } catch {
    return false;
  }
};

export default function Orchestration3D({ t }: { t: Dictionary["orchestration"] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<OrchestrationScene | null>(null);
  const [mode, setMode] = useState<Mode>("pending");
  const [ready, setReady] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [stage, setStage] = useState<number | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const next: Mode = reduced || !supportsWebGL() ? "fallback" : "3d";
    const frame = requestAnimationFrame(() => setMode(next));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (mode !== "3d" || !container) return;
    let cancelled = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        import("@/lib/orchestration-scene")
          .then(({ createOrchestrationScene }) => {
            if (cancelled) return;
            sceneRef.current = createOrchestrationScene(container, { labels: t.labels, details: t.details });
            setReady(true);
          })
          .catch(() => !cancelled && setMode("fallback"));
      },
      { rootMargin: "400px 0px" },
    );
    observer.observe(container);

    return () => {
      cancelled = true;
      observer.disconnect();
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, [mode, t.labels, t.details]);

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    const loop = async () => {
      while (!cancelled && sceneRef.current) {
        await Promise.resolve();
        if (cancelled) return;
        setPhase("running");
        await sceneRef.current.run((index) => !cancelled && setStage(index));
        if (cancelled) return;
        setPhase("done");
        await new Promise((resolve) => window.setTimeout(resolve, LOOP_PAUSE_MS));
      }
    };
    void loop();
    return () => {
      cancelled = true;
    };
  }, [ready]);

  if (mode === "fallback") return <OrchestrationFlow t={t} />;

  const status =
    phase === "done" ? t.done.replace("{count}", String(STAGES.length)) : phase === "running" && stage !== null ? t.stages[stage] : t.idle;

  return (
    <div className="flex flex-col">
      <div
        ref={containerRef}
        role="img"
        aria-label={t.ariaLabel}
        data-scene-pending={ready ? undefined : ""}
        className="relative aspect-[16/11] w-full cursor-grab touch-pan-y overflow-hidden active:cursor-grabbing"
      >
        {!ready && <div className="absolute inset-0 animate-pulse bg-[radial-gradient(ellipse_at_center,rgb(99_102_241/0.12),transparent_65%)]" />}
        {ready && (
          <div className="absolute top-3 right-3 z-10 flex flex-col overflow-hidden rounded-xl border border-white/10 bg-zinc-950/70 backdrop-blur-md">
            {[
              { label: t.zoomIn, factor: 0.8, path: "M8 3.5v9M3.5 8h9" },
              { label: t.zoomOut, factor: 1.25, path: "M3.5 8h9" },
            ].map((control) => (
              <button
                key={control.label}
                type="button"
                aria-label={control.label}
                title={control.label}
                onClick={() => sceneRef.current?.zoom(control.factor)}
                className="flex size-9 items-center justify-center text-zinc-300 transition-[background-color,color] duration-150 hover:bg-white/[0.08] hover:text-white focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-violet-500 [&+&]:border-t [&+&]:border-white/10"
              >
                <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d={control.path} />
                </svg>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-white/[0.06] px-4 py-3 sm:px-5">
        <p aria-live="polite" className="flex min-w-0 items-center gap-2 font-mono text-xs text-zinc-400">
          <span
            aria-hidden="true"
            className={`size-1.5 shrink-0 rounded-full ${phase === "running" ? "animate-pulse bg-violet-400" : phase === "done" ? "bg-emerald-400" : "bg-zinc-600"}`}
          />
          <span className="leading-snug">{status}</span>
        </p>
        <ol aria-hidden="true" className="hidden shrink-0 items-center gap-1 sm:flex">
          {STAGES.map((_, index) => {
            const reached = phase === "done" || (phase === "running" && stage !== null && index <= stage);
            return (
              <li
                key={index}
                className={`h-1 rounded-full transition-[width,background-color] duration-300 ease-out ${reached ? "w-4 bg-violet-400" : "w-1.5 bg-white/15"}`}
              />
            );
          })}
        </ol>
      </div>
    </div>
  );
}
