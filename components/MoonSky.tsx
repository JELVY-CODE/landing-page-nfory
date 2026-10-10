'use client';

import { useEffect, useRef } from "react";
import { drawMoon, getMoonState } from "@/lib/moon";

const UPDATE_MS = 30_000;
const SIZE_PX = 96;

export default function MoonSky() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = canvas.height = Math.round(SIZE_PX * dpr);
    let drawnPhase = -1;

    // La posición se recalcula cada 30 s y la transición CSS lineal la convierte en movimiento continuo.
    const update = () => {
      const moon = getMoonState();
      root.style.transform = `translate(calc(${moon.x * 100}vw - 50%), calc(${moon.y * 100}vh - 50%))`;
      root.style.opacity = String(0.8 + moon.illumination * 0.2);
      if (Math.abs(moon.phase - drawnPhase) > 0.002) {
        drawMoon(canvas, moon.phase);
        drawnPhase = moon.phase;
      }
    };

    update();
    requestAnimationFrame(() => root.classList.add("moon-sky-ready"));
    const timer = window.setInterval(update, UPDATE_MS);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div ref={rootRef} data-moon="" className="moon-sky absolute top-0 left-0">
      <div className="absolute inset-[-120%] rounded-full bg-[radial-gradient(circle,rgb(167_139_250/0.16)_0%,rgb(99_102_241/0.06)_40%,transparent_70%)]" />
      <canvas ref={canvasRef} className="relative block size-24 drop-shadow-[0_0_24px_rgb(196_181_253/0.35)]" />
    </div>
  );
}
