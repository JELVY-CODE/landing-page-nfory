'use client';

import { useEffect, useRef, type ReactNode } from "react";

type Anchor = { node: HTMLElement; y: number; scroll: number };

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

// Velocidad con la que el punto alcanza su objetivo (1/s).
const FOLLOW_RATE = 10;

// Distancia de scroll (px) en la que un nodo atrae al punto hasta encajarlo en su círculo.
const MAGNET_PX = 90;

const smoothstep = (t: number) => t * t * (3 - 2 * t);

export default function ScrollJourney({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const fill = fillRef.current;
    const tip = tipRef.current;
    if (!root || !fill || !tip) return;

    const nodes = Array.from(root.querySelectorAll<HTMLElement>("[data-journey-node]"));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      fill.style.transform = "scaleY(1)";
      nodes.forEach((node) => (node.dataset.active = "true"));
      return;
    }

    let anchors: Anchor[] = [];
    let height = 1;
    let frameId: number | null = null;

    // Para cada nodo: su posición en la línea y el scroll exacto en el que su sección queda anclada
    // (el mismo destino que un enlace del header), de modo que el punto se detiene justo sobre el círculo.
    const measure = () => {
      const scrollY = window.scrollY;
      const rootTop = root.getBoundingClientRect().top + scrollY;
      const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      height = Math.max(1, root.offsetHeight);
      anchors = nodes.map((node) => {
        const rect = node.getBoundingClientRect();
        const target = node.closest<HTMLElement>(".journey-anchor") ?? node;
        const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
        const targetTop = target.getBoundingClientRect().top + scrollY;
        return {
          node,
          y: rect.top + scrollY + rect.height / 2 - rootTop,
          scroll: Math.min(maxScroll, Math.max(0, targetTop - margin - padding)),
        };
      });
    };

    // Avance proporcional al scroll entre nodos consecutivos.
    const linearPosition = (scrollY: number) => {
      const first = anchors[0];
      if (scrollY <= first.scroll) {
        const start = Math.max(0, first.scroll - window.innerHeight);
        return first.y * clamp01((scrollY - start) / Math.max(1, first.scroll - start));
      }
      for (let i = 0; i < anchors.length - 1; i++) {
        const from = anchors[i];
        const to = anchors[i + 1];
        if (scrollY <= to.scroll) {
          return from.y + (to.y - from.y) * clamp01((scrollY - from.scroll) / Math.max(1, to.scroll - from.scroll));
        }
      }
      return anchors[anchors.length - 1].y;
    };

    // Cerca de un nodo, el punto es atraído hasta su centro: encaja al conectar y se suelta con suavidad.
    const tipPosition = (scrollY: number) => {
      if (!anchors.length) return 0;
      const y = linearPosition(scrollY);
      const nearest = anchors.reduce((best, anchor) =>
        Math.abs(scrollY - anchor.scroll) < Math.abs(scrollY - best.scroll) ? anchor : best,
      );
      const distance = Math.abs(scrollY - nearest.scroll);
      if (distance >= MAGNET_PX) return y;
      return nearest.y + (y - nearest.y) * smoothstep(distance / MAGNET_PX);
    };

    // El punto persigue su objetivo con suavizado exponencial: la rueda y la barra de scroll
    // mueven el objetivo a saltos, pero el recorrido visible siempre es continuo.
    let current = 0;
    let lastTime = 0;

    const render = (y: number) => {
      fill.style.transform = `scaleY(${y / height})`;
      tip.style.transform = `translate(-50%, ${y}px)`;
      tip.style.opacity = y > 0.5 ? "1" : "0";
      for (const anchor of anchors) anchor.node.dataset.active = String(y >= anchor.y - 1);
    };

    const step = (time: number) => {
      const target = tipPosition(window.scrollY);
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = time;
      current += (target - current) * (1 - Math.exp(-dt * FOLLOW_RATE));
      if (Math.abs(target - current) < 0.3) current = target;
      render(current);
      frameId = current === target ? null : requestAnimationFrame(step);
      if (frameId === null) lastTime = 0;
    };

    const requestUpdate = () => {
      if (frameId === null) frameId = requestAnimationFrame(step);
    };

    const remeasure = () => {
      measure();
      requestUpdate();
    };

    measure();
    current = tipPosition(window.scrollY);
    render(current);
    remeasure();
    const resizeObserver = new ResizeObserver(remeasure);
    resizeObserver.observe(root);
    document.fonts?.ready.then(remeasure);
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", remeasure);

    return () => {
      if (frameId !== null) cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", remeasure);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden px-4 sm:px-6 lg:block">
        <div className="relative mx-auto h-full max-w-6xl">
          <div className="absolute inset-y-0 left-6 w-px bg-white/[0.07]">
            <div ref={fillRef} className="h-full w-full origin-top bg-indigo-500" style={{ transform: "scaleY(0)" }} />
            <div
              ref={tipRef}
              data-journey-tip=""
              className="absolute top-0 left-1/2 -mt-1 size-2 rounded-full bg-violet-400 opacity-0 shadow-[0_0_12px_4px_rgb(139_92_246/0.6)]"
            />
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
