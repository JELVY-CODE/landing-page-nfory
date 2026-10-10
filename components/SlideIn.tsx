'use client';

import { useEffect, useRef, type ReactNode } from "react";

type SlideInProps = {
  children: ReactNode;
  /** Retraso relativo (0–1) respecto al progreso del scroll, para escalonar bloques. */
  delay?: number;
  className?: string;
};

const DISTANCE_PERCENT = 55;
const FOLLOW_RATE = 5;
const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

/**
 * Entrada de derecha a izquierda ligada al scroll: avanza al bajar y retrocede al subir.
 * El valor visible persigue al del scroll con suavizado para que el movimiento sea pausado.
 */
export default function SlideIn({ children, delay = 0, className = "" }: SlideInProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      element.style.transform = "none";
      element.style.opacity = "1";
      return;
    }

    let current = -1;
    let frameId: number | null = null;
    let lastTime = 0;

    const targetProgress = () => {
      const top = element.getBoundingClientRect().top;
      const viewport = window.innerHeight;
      const raw = clamp01((viewport * 0.95 - top) / (viewport * 0.55));
      return clamp01((raw - delay) / (1 - delay));
    };

    const render = (progress: number) => {
      const eased = easeOutCubic(progress);
      element.style.transform = `translate3d(${(1 - eased) * DISTANCE_PERCENT}%, 0, 0)`;
      element.style.opacity = String(eased);
    };

    const step = (time: number) => {
      const target = targetProgress();
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = time;
      current = current < 0 ? target : current + (target - current) * (1 - Math.exp(-dt * FOLLOW_RATE));
      if (Math.abs(target - current) < 0.001) current = target;
      render(current);
      frameId = current === target ? null : requestAnimationFrame(step);
      if (frameId === null) lastTime = 0;
    };

    const requestUpdate = () => {
      if (frameId === null) frameId = requestAnimationFrame(step);
    };

    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      if (frameId !== null) cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [delay]);

  return (
    <div ref={ref} className={`slide-in ${className}`}>
      {children}
    </div>
  );
}
