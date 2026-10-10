'use client';

import { useEffect, useState } from "react";
import { visibleById } from "@/lib/dom";

export type ModuleLink = { index: string; label: string; href: string };

type ModuleIndexProps = {
  modules: ModuleLink[];
  developers: { label: string; onOpen: () => void };
  hidden: boolean;
};

const nodeClass =
  "flex size-11 items-center justify-center rounded-full border bg-zinc-950 font-mono text-xs transition-[border-color,color,scale,box-shadow] duration-200 ease-out-strong " +
  "group-hover/item:scale-105 group-active/item:scale-95 group-focus-visible/item:ring-2 group-focus-visible/item:ring-violet-500";

const labelClass =
  "pointer-events-none translate-x-2 rounded-full border border-white/10 bg-zinc-950/85 px-3 py-1 font-mono text-[11px] tracking-wide whitespace-nowrap text-zinc-200 uppercase opacity-0 " +
  "backdrop-blur-md transition-[opacity,translate] duration-200 ease-out-strong group-hover/item:translate-x-0 group-hover/item:opacity-100 group-focus-visible/item:translate-x-0 group-focus-visible/item:opacity-100";

export default function ModuleIndex({ modules, developers, hidden }: ModuleIndexProps) {
  const [atStart, setAtStart] = useState(true);

  useEffect(() => {
    const first = modules[0] ? visibleById(modules[0].href.slice(1)) : null;
    let frameId: number | null = null;
    const update = () => {
      frameId = null;
      const top = first?.getBoundingClientRect().top ?? Infinity;
      setAtStart(top > window.innerHeight * 0.6);
    };
    const request = () => {
      if (frameId === null) frameId = requestAnimationFrame(update);
    };
    request();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => {
      if (frameId !== null) cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
    };
  }, [modules]);

  const visible = atStart && !hidden;

  return (
    <nav
      aria-label="NFory"
      aria-hidden={!visible}
      inert={!visible}
      className={
        "fixed top-1/2 right-5 z-30 hidden -translate-y-1/2 flex-col items-end transition-[opacity,translate] duration-500 ease-out-strong lg:flex " +
        (visible ? "opacity-100" : "pointer-events-none translate-x-4 opacity-0")
      }
    >
      <ol className="relative flex flex-col items-end gap-4">
        <span aria-hidden="true" className="absolute top-5 right-[1.375rem] bottom-5 w-px translate-x-1/2 bg-gradient-to-b from-violet-500/50 via-indigo-500/30 to-violet-500/50" />
        {modules.map((module) => (
          <li key={module.href} className="relative">
            <a href={module.href} aria-label={module.label} className="group/item flex items-center gap-3 focus-visible:outline-none">
              <span className={labelClass}>{module.label}</span>
              <span className={`${nodeClass} border-white/15 text-zinc-400 group-hover/item:border-violet-400 group-hover/item:text-white`}>{module.index}</span>
            </a>
          </li>
        ))}
      </ol>

      <span aria-hidden="true" className="mr-[1.375rem] h-8 w-px translate-x-1/2 border-l border-dashed border-violet-400/40" />

      <button type="button" onClick={developers.onOpen} aria-label={developers.label} className="group/item flex items-center gap-3 focus-visible:outline-none">
        <span className={labelClass}>{developers.label}</span>
        <span className={`${nodeClass} border-violet-500/50 text-violet-200 shadow-[0_0_24px_-6px_rgb(139_92_246/0.8)] group-hover/item:border-violet-400`}>00</span>
      </button>
    </nav>
  );
}
