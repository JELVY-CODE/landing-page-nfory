'use client';

import { useEffect, useRef } from "react";

type InteractiveNeuralBackgroundProps = {
  className?: string;
};

type NeuralNode = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  /** 0 = índigo, 1 = violeta. */
  tone: number;
};

const INDIGO = { r: 99, g: 102, b: 241 };
const VIOLET = { r: 139, g: 92, b: 246 };

const AREA_PER_NODE = 13000;
const MIN_NODES = 28;
const MAX_NODES = 140;
const LINK_DISTANCE = 170;
const CURSOR_RADIUS = 200;
const DRIFT_SPEED = 0.18;
const MAX_DPR = 2;
const MAX_CANVAS_PIXELS = 4_000_000;

const TONE_STEPS = 8;
const ALPHA_STEPS = 32;

// Colores precalculados: evita crear miles de strings por fotograma.
const PALETTE = Array.from({ length: (TONE_STEPS + 1) * (ALPHA_STEPS + 1) }, (_, index) => {
  const tone = Math.floor(index / (ALPHA_STEPS + 1)) / TONE_STEPS;
  const alpha = (index % (ALPHA_STEPS + 1)) / ALPHA_STEPS;
  const r = Math.round(INDIGO.r + (VIOLET.r - INDIGO.r) * tone);
  const g = Math.round(INDIGO.g + (VIOLET.g - INDIGO.g) * tone);
  const b = Math.round(INDIGO.b + (VIOLET.b - INDIGO.b) * tone);
  return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
});

function mixTone(tone: number, alpha: number): string {
  const toneIndex = Math.round(tone * TONE_STEPS);
  const alphaIndex = Math.round(Math.min(1, Math.max(0, alpha)) * ALPHA_STEPS);
  return PALETTE[toneIndex * (ALPHA_STEPS + 1) + alphaIndex];
}

function createNodes(width: number, height: number): NeuralNode[] {
  const count = Math.max(
    MIN_NODES,
    Math.min(MAX_NODES, Math.round((width * height) / AREA_PER_NODE)),
  );

  return Array.from({ length: count }, () => {
    const angle = Math.random() * Math.PI * 2;
    const speed = DRIFT_SPEED * (0.4 + Math.random() * 0.6);
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: 1.2 + Math.random() * 1.8,
      tone: Math.random(),
    };
  });
}

export default function InteractiveNeuralBackground({
  className = "",
}: InteractiveNeuralBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = motionQuery.matches;

    let width = 0;
    let height = 0;
    let nodes: NeuralNode[] = [];
    let frameId: number | null = null;
    let lastTime = 0;

    const pointer = { targetX: 0, targetY: 0, x: 0, y: 0, active: false, influence: 0 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const prevWidth = width;
      const prevHeight = height;

      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR, Math.sqrt(MAX_CANVAS_PIXELS / Math.max(1, width * height)));
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (nodes.length === 0 || prevWidth === 0 || prevHeight === 0) {
        nodes = createNodes(width, height);
      } else {
        const sx = width / prevWidth;
        const sy = height / prevHeight;
        for (const node of nodes) {
          node.x *= sx;
          node.y *= sy;
        }
      }

      // Sin bucle activo (movimiento reducido o pestaña oculta) se dibuja un fotograma estático.
      if (frameId === null) draw();
    };

    const step = (dt: number) => {
      const follow = 1 - Math.pow(1 - 0.12, dt);
      pointer.x += (pointer.targetX - pointer.x) * follow;
      pointer.y += (pointer.targetY - pointer.y) * follow;
      pointer.influence += ((pointer.active ? 1 : 0) - pointer.influence) * (1 - Math.pow(1 - 0.06, dt));

      const margin = 20;
      for (const node of nodes) {
        if (pointer.influence > 0.01) {
          const dx = pointer.x - node.x;
          const dy = pointer.y - node.y;
          const dist = Math.hypot(dx, dy);
          if (dist < CURSOR_RADIUS && dist > 0.001) {
            const force = (1 - dist / CURSOR_RADIUS) * 0.012 * pointer.influence;
            node.vx += (dx / dist) * force * dt;
            node.vy += (dy / dist) * force * dt;
          }
        }

        const speed = Math.hypot(node.vx, node.vy);
        if (speed > DRIFT_SPEED) {
          const damping = Math.pow(0.97, dt);
          node.vx *= damping;
          node.vy *= damping;
        }

        node.x += node.vx * dt;
        node.y += node.vy * dt;

        if (node.x < -margin) node.x = width + margin;
        else if (node.x > width + margin) node.x = -margin;
        if (node.y < -margin) node.y = height + margin;
        else if (node.y > height + margin) node.y = -margin;
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const linkDistance = width < 640 ? LINK_DISTANCE * 0.75 : LINK_DISTANCE;
      const linkDistanceSq = linkDistance * linkDistance;

      ctx.lineWidth = 1.1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distSq = dx * dx + dy * dy;
          if (distSq > linkDistanceSq) continue;

          const proximity = 1 - Math.sqrt(distSq) / linkDistance;
          let alpha = proximity * 0.55;

          if (pointer.influence > 0.01) {
            const mx = (a.x + b.x) / 2 - pointer.x;
            const my = (a.y + b.y) / 2 - pointer.y;
            const cursorDist = Math.hypot(mx, my);
            if (cursorDist < CURSOR_RADIUS) {
              alpha += (1 - cursorDist / CURSOR_RADIUS) * 0.3 * proximity * pointer.influence;
            }
          }

          ctx.strokeStyle = mixTone((a.tone + b.tone) / 2, alpha);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      if (pointer.influence > 0.01) {
        for (const node of nodes) {
          const dist = Math.hypot(node.x - pointer.x, node.y - pointer.y);
          if (dist > CURSOR_RADIUS * 0.8) continue;
          const alpha = (1 - dist / (CURSOR_RADIUS * 0.8)) * 0.35 * pointer.influence;
          ctx.strokeStyle = mixTone(node.tone, alpha);
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.stroke();
        }
      }

      for (const node of nodes) {
        let glow = 0;
        if (pointer.influence > 0.01) {
          const dist = Math.hypot(node.x - pointer.x, node.y - pointer.y);
          if (dist < CURSOR_RADIUS) glow = (1 - dist / CURSOR_RADIUS) * pointer.influence;
        }
        ctx.fillStyle = mixTone(node.tone, 0.1 + glow * 0.15);
        ctx.beginPath();
        ctx.arc(node.x, node.y, (node.radius + glow * 1.2) * 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = mixTone(node.tone, 0.85 + glow * 0.15);
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + glow * 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = (time: number) => {
      // dt en frames de 60fps, acotado tras pausas largas.
      const dt = lastTime ? Math.min((time - lastTime) / (1000 / 60), 3) : 1;
      lastTime = time;
      step(dt);
      draw();
      frameId = requestAnimationFrame(loop);
    };

    const start = () => {
      if (frameId !== null || reducedMotion || document.hidden) return;
      lastTime = 0;
      frameId = requestAnimationFrame(loop);
    };

    const stop = () => {
      if (frameId !== null) cancelAnimationFrame(frameId);
      frameId = null;
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
      const rect = canvas.getBoundingClientRect();
      pointer.targetX = event.clientX - rect.left;
      pointer.targetY = event.clientY - rect.top;
      if (!pointer.active) {
        pointer.x = pointer.targetX;
        pointer.y = pointer.targetY;
        pointer.active = true;
      }
    };

    const handlePointerLeave = () => {
      pointer.active = false;
    };

    const handleVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    const handleMotionChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
      if (reducedMotion) {
        stop();
        pointer.active = false;
        pointer.influence = 0;
        draw();
      } else {
        start();
      }
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();
    start();

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("blur", handlePointerLeave);
    document.addEventListener("visibilitychange", handleVisibility);
    motionQuery.addEventListener("change", handleMotionChange);

    return () => {
      stop();
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      document.documentElement.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("blur", handlePointerLeave);
      document.removeEventListener("visibilitychange", handleVisibility);
      motionQuery.removeEventListener("change", handleMotionChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none h-full w-full ${className}`}
    />
  );
}
