'use client';

import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import ModuleIndex, { type ModuleLink } from "@/components/ModuleIndex";
import { visibleOne } from "@/lib/dom";

const HASH = "#desarrolladores";
const DURATION_MS = 1400;
const EASING = "cubic-bezier(0.65, 0, 0.35, 1)";

const subscribe = (callback: () => void) => {
  window.addEventListener("hashchange", callback);
  return () => window.removeEventListener("hashchange", callback);
};
const isOpen = () => window.location.hash === HASH;

const easeInOut = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

type Point = { x: number; y: number };

const center = (element: Element | null): Point | null => {
  const rect = element?.getBoundingClientRect();
  if (!rect || rect.width === 0) return null;
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
};

type DevelopersTransitionProps = {
  children: ReactNode;
  view: ReactNode;
  labels: { open: string; back: string };
  modules: ModuleLink[];
};

export default function DevelopersTransition({ children, view, labels, modules }: DevelopersTransitionProps) {
  const open = useSyncExternalStore(subscribe, isOpen, () => false);
  const pageRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const baseRef = useRef<SVGPathElement>(null);
  const litRef = useRef<SVGPathElement>(null);
  const pulseRef = useRef<SVGCircleElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const previousOpen = useRef<boolean | null>(null);
  const isOpenRef = useRef(open);

  useEffect(() => {
    const page = pageRef.current;
    const panel = panelRef.current;
    const svg = svgRef.current;
    if (!page || !panel || !svg) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const animate = previousOpen.current !== null && previousOpen.current !== open && !reduced;
    previousOpen.current = open;
    isOpenRef.current = open;

    const transition = animate ? `transform ${DURATION_MS}ms ${EASING}` : "none";
    page.style.transition = transition;
    panel.style.transition = transition;
    page.style.transform = open ? "translate3d(-100%, 0, 0)" : "none";
    panel.style.transform = open ? "none" : "translate3d(100%, 0, 0)";
    panel.style.visibility = "visible";
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (open) panel.scrollTop = 0;

    const anchor = open ? null : window.location.hash ? visibleOne(`[id="${CSS.escape(window.location.hash.slice(1))}"].journey-anchor`) : null;
    if (anchor) {
      const margin = parseFloat(getComputedStyle(anchor).scrollMarginTop) || 0;
      window.scrollTo({ top: anchor.getBoundingClientRect().top + window.scrollY - margin, behavior: "instant" });
    }

    const node = panel.querySelector<HTMLElement>("[data-developers-node]");
    if (node) node.dataset.active = String(open && !animate);
    if (!animate) {
      if (!open) panel.style.visibility = "hidden";
      return;
    }

    const tip = anchor?.querySelector("[data-journey-node] > span:last-child") ?? visibleOne("[data-journey-tip]");
    const fallback = (): Point => ({ x: 0, y: window.innerHeight / 2 });
    const base = baseRef.current!;
    const lit = litRef.current!;
    const pulse = pulseRef.current!;
    const start = performance.now();
    let frameId = 0;

    svg.style.opacity = "1";
    const frame = (now: number) => {
      const raw = Math.min(1, (now - start) / DURATION_MS);
      const progress = easeInOut(raw);
      const fromTip = center(tip) ?? fallback();
      const toNode = center(node) ?? { x: window.innerWidth * 0.12, y: window.innerHeight * 0.3 };
      const [from, to] = open ? [fromTip, toNode] : [toNode, fromTip];
      const mid = (from.x + to.x) / 2;
      const d = `M${from.x} ${from.y} C${mid} ${from.y}, ${mid} ${to.y}, ${to.x} ${to.y}`;
      base.setAttribute("d", d);
      lit.setAttribute("d", d);
      const length = lit.getTotalLength();
      lit.style.strokeDasharray = `${length * progress} ${length}`;
      const point = lit.getPointAtLength(length * progress);
      pulse.setAttribute("cx", String(point.x));
      pulse.setAttribute("cy", String(point.y));

      if (raw < 1) {
        frameId = requestAnimationFrame(frame);
        return;
      }
      finish();
    };

    const finish = () => {
      window.clearTimeout(safety);
      if (node) node.dataset.active = String(open);
      if (!open) panel.style.visibility = "hidden";
      svg.style.opacity = "0";
    };
    const safety = window.setTimeout(finish, DURATION_MS + 200);
    frameId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(frameId);
      window.clearTimeout(safety);
    };
  }, [open]);

  useEffect(() => () => void (document.documentElement.style.overflow = ""), []);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const measure = () => panel.style.setProperty("--panel-scrollbar", `${panel.offsetWidth - panel.clientWidth}px`);
    const observer = new ResizeObserver(measure);
    observer.observe(panel);
    measure();
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element).closest?.<HTMLAnchorElement>("a[href*='#']");
      if (!link || link.target) return;
      const url = new URL(link.href);
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || !url.hash) return;
      event.preventDefault();
      if (url.hash === window.location.hash) {
        if (url.hash !== HASH) visibleOne(`[id="${CSS.escape(url.hash.slice(1))}"]`)?.scrollIntoView();
        return;
      }
      window.history.pushState(url.hash === HASH ? { developers: true } : null, "", url.hash);
      window.dispatchEvent(new HashChangeEvent("hashchange"));
      if (url.hash !== HASH && !isOpenRef.current) visibleOne(`[id="${CSS.escape(url.hash.slice(1))}"]`)?.scrollIntoView();
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const close = () => {
    if (window.history.state?.developers) window.history.back();
    else {
      window.history.pushState(null, "", window.location.pathname + window.location.search);
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    }
  };

  const openView = () => {
    window.history.pushState({ developers: true }, "", HASH);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  };

  return (
    <>
      <div ref={pageRef} inert={open}>
        {children}
      </div>

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="developers-title"
        inert={!open}
        className="fixed inset-0 z-40 overflow-y-auto overscroll-contain pt-[4.5rem] pr-4 pl-[calc(1rem+var(--panel-scrollbar,0px))] sm:pr-6 sm:pl-[calc(1.5rem+var(--panel-scrollbar,0px))]"
        style={{ transform: "translate3d(100%, 0, 0)", visibility: "hidden" }}
      >
        <div className="mx-auto max-w-6xl pt-10 pb-8 lg:pl-20">
          <button
            type="button"
            onClick={close}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-zinc-400 transition-[color,background-color,scale] duration-150 ease-out-strong hover:bg-white/[0.06] hover:text-white active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-violet-500"
          >
            <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 8H3m4-4L3 8l4 4" />
            </svg>
            {labels.back}
          </button>
        </div>
        <div className="pt-8">{view}</div>
      </div>

      <svg ref={svgRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[45] size-full opacity-0 transition-opacity duration-500">
        <defs>
          <filter id="developers-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path ref={baseRef} fill="none" stroke="rgb(167 139 250 / 0.18)" strokeWidth="1" strokeDasharray="3 6" />
        <path ref={litRef} fill="none" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" filter="url(#developers-glow)" />
        <circle ref={pulseRef} r="5" fill="#F5F3FF" filter="url(#developers-glow)" />
      </svg>

      <ModuleIndex modules={modules} developers={{ label: labels.open, onOpen: openView }} hidden={open} />
    </>
  );
}
