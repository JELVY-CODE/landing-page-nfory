'use client';

import { useEffect, useRef, type ReactNode } from "react";

type MarqueeRowProps = {
  children: ReactNode;
  reverse?: boolean;
  labels: { region: string; carousel: string; previous: string; next: string };
};

// Copias suficientes para cubrir siempre el ancho visible.
const COPIES = 4;
const SPEED_PX_PER_S = 36;

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d={direction === "left" ? "m10 3.5-4.5 4.5 4.5 4.5" : "m6 3.5 4.5 4.5-4.5 4.5"} />
    </svg>
  );
}

export default function MarqueeRow({ children, reverse = false, labels }: MarqueeRowProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<{ nudge: (cards: number) => void } | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const direction = reverse ? 1 : -1;

    let setWidth = 0;
    let step = 0;
    let centerOffset = 0;
    let offset = 0;
    let pending = 0;
    let speedFactor = reducedMotion ? 0 : 1;
    let hovered = false;
    let dragging = false;
    let dragX = 0;
    let visible = true;
    let frameId: number | null = null;
    let lastTime = 0;

    const normalize = () => {
      if (setWidth <= 0) return;
      offset = ((offset % setWidth) + setWidth) % setWidth - setWidth; // [-setWidth, 0)
    };

    const render = () => {
      track.style.transform = `translate3d(${offset}px, 0, 0)`;
    };

    const measure = () => {
      const firstSet = track.firstElementChild as HTMLElement | null;
      const firstCard = firstSet?.firstElementChild as HTMLElement | null;
      if (!firstSet || !firstCard) return;
      const gap = parseFloat(getComputedStyle(firstSet).columnGap) || 0;
      setWidth = firstSet.offsetWidth;
      step = firstCard.offsetWidth + gap;
      centerOffset = root.clientWidth / 2 - firstCard.offsetWidth / 2;
    };

    const snapToCenter = () => {
      if (step <= 0) return;
      const target = centerOffset + Math.round((offset + pending - centerOffset) / step) * step;
      pending = target - offset;
    };

    const tick = (time: number) => {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0;
      lastTime = time;

      const targetFactor = reducedMotion || hovered || dragging ? 0 : 1;
      speedFactor += (targetFactor - speedFactor) * (1 - Math.exp(-dt * 5));

      if (!dragging) {
        offset += direction * SPEED_PX_PER_S * speedFactor * dt;
        const applied = reducedMotion ? pending : pending * (1 - Math.exp(-dt * 9));
        offset += applied;
        pending -= applied;
        if (Math.abs(pending) < 0.1) pending = 0;
      }

      normalize();
      render();
      frameId = requestAnimationFrame(tick);
    };

    const start = () => {
      if (frameId !== null || !visible || document.hidden) return;
      lastTime = 0;
      frameId = requestAnimationFrame(tick);
    };

    const stop = () => {
      if (frameId !== null) cancelAnimationFrame(frameId);
      frameId = null;
    };

    measure();
    offset = centerOffset;
    normalize();
    render();

    const onResize = () => {
      // Re-anclar a la tarjeta centrada: escalar el offset rompería el centrado.
      const previousStep = step;
      const cardsFromCenter = previousStep > 0 ? (offset + pending - centerOffset) / previousStep : 0;
      measure();
      offset = centerOffset + Math.round(cardsFromCenter) * step;
      pending = 0;
      normalize();
      render();
    };
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(root);
    window.addEventListener("resize", onResize);

    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    intersection.observe(root);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    const onEnter = (event: PointerEvent) => {
      if (event.pointerType === "mouse") hovered = true;
    };
    const onLeave = () => {
      hovered = false;
    };

    const onDown = (event: PointerEvent) => {
      if ((event.target as HTMLElement).closest("button")) return;
      if (event.pointerType === "mouse" && event.button !== 0) return;
      dragging = true;
      dragX = event.clientX;
      pending = 0;
      root.setPointerCapture(event.pointerId);
    };
    const onMove = (event: PointerEvent) => {
      if (!dragging) return;
      offset += event.clientX - dragX;
      dragX = event.clientX;
    };
    const onUp = (event: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      if (root.hasPointerCapture(event.pointerId)) root.releasePointerCapture(event.pointerId);
      snapToCenter();
    };

    root.addEventListener("pointerenter", onEnter);
    root.addEventListener("pointerleave", onLeave);
    root.addEventListener("pointerdown", onDown);
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerup", onUp);
    root.addEventListener("pointercancel", onUp);

    controlsRef.current = {
      nudge: (cards: number) => {
        pending += cards * step;
        snapToCenter();
        start();
      },
    };

    start();

    return () => {
      stop();
      controlsRef.current = null;
      resizeObserver.disconnect();
      window.removeEventListener("resize", onResize);
      intersection.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      root.removeEventListener("pointerenter", onEnter);
      root.removeEventListener("pointerleave", onLeave);
      root.removeEventListener("pointerdown", onDown);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerup", onUp);
      root.removeEventListener("pointercancel", onUp);
    };
  }, [reverse]);

  const arrowClass =
    "absolute top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 " +
    "bg-zinc-950/70 text-zinc-300 backdrop-blur-md opacity-0 transition-[opacity,border-color,color,scale] duration-200 ease-out-strong " +
    "group-hover/row:opacity-100 focus-visible:opacity-100 hover:border-indigo-500/40 hover:text-white active:scale-[0.94] " +
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 pointer-coarse:hidden";

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription={labels.carousel}
      aria-label={labels.region}
      className="group/row relative cursor-grab touch-pan-y select-none active:cursor-grabbing"
    >
      <div className="marquee">
        <div ref={trackRef} className="flex w-max will-change-transform">
          {Array.from({ length: COPIES }, (_, copy) => (
            <div
              key={copy}
              className="flex gap-4 pr-4"
              aria-hidden={copy > 0 ? true : undefined}
              inert={copy > 0}
            >
              {children}
            </div>
          ))}
        </div>
      </div>

      <button type="button" aria-label={labels.previous} onClick={() => controlsRef.current?.nudge(1)} className={`${arrowClass} left-4 sm:left-6`}>
        <Chevron direction="left" />
      </button>
      <button type="button" aria-label={labels.next} onClick={() => controlsRef.current?.nudge(-1)} className={`${arrowClass} right-4 sm:right-6`}>
        <Chevron direction="right" />
      </button>
    </div>
  );
}
