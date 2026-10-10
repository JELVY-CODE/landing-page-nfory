'use client';

import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import {
  EDGE_IDS,
  FACE,
  ISO_ELEVATION,
  MAX_ELEVATION,
  MIN_ELEVATION,
  STAGES,
  buildScene,
  type NodeId,
} from "@/lib/orchestration";

const EDGE_MS = 1100;
const TRAIL = [0, 0.035, 0.07, 0.105];
const DRAG_SENSITIVITY = 0.006;
const KEY_STEP = Math.PI / 12;
const HIDDEN_DASH = "0 100000";

type Phase = "idle" | "running" | "done";

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const clampElevation = (value: number) => Math.min(MAX_ELEVATION, Math.max(MIN_ELEVATION, value));

export default function OrchestrationFlow({ t }: { t: Dictionary["orchestration"] }) {
  const [view, setView] = useState({ angle: 0, elevation: ISO_ELEVATION });
  const [activeNodes, setActiveNodes] = useState<Set<NodeId>>(new Set());
  const [phase, setPhase] = useState<Phase>("idle");
  const [stage, setStage] = useState<number | null>(null);

  const scene = useMemo(() => buildScene(view.angle, view.elevation), [view]);

  const pathRefs = useRef<Record<string, SVGPathElement | null>>({});
  const litRefs = useRef<Record<string, SVGPathElement | null>>({});
  const pulseRefs = useRef<Record<string, SVGGElement | null>>({});
  const runId = useRef(0);
  const motion = useRef({
    angle: 0,
    elevation: ISO_ELEVATION,
    velocity: 0,
    target: null as number | null,
    drag: null as { x: number; y: number } | null,
    frame: 0,
  });

  useEffect(() => {
    const run = runId;
    const state = motion.current;
    return () => {
      run.current++;
      cancelAnimationFrame(state.frame);
    };
  }, []);

  const commitView = () => {
    const state = motion.current;
    setView({ angle: state.angle, elevation: state.elevation });
  };

  const animateRotation = () => {
    const state = motion.current;
    cancelAnimationFrame(state.frame);
    const step = () => {
      if (state.drag) return;
      if (state.target !== null) {
        const delta = state.target - state.angle;
        state.angle += delta * 0.18;
        if (Math.abs(delta) < 0.001) {
          state.angle = state.target;
          state.target = null;
        }
      } else {
        state.angle += state.velocity;
        state.velocity *= 0.9;
        if (Math.abs(state.velocity) < 0.0005) state.velocity = 0;
      }
      commitView();
      if (state.target !== null || state.velocity !== 0) state.frame = requestAnimationFrame(step);
    };
    state.frame = requestAnimationFrame(step);
  };

  const onPointerDown = (event: PointerEvent<SVGSVGElement>) => {
    const state = motion.current;
    cancelAnimationFrame(state.frame);
    state.drag = { x: event.clientX, y: event.clientY };
    state.velocity = 0;
    state.target = null;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent<SVGSVGElement>) => {
    const state = motion.current;
    if (!state.drag) return;
    const dx = (event.clientX - state.drag.x) * DRAG_SENSITIVITY;
    const dy = (event.clientY - state.drag.y) * DRAG_SENSITIVITY;
    state.drag = { x: event.clientX, y: event.clientY };
    state.angle += dx;
    state.velocity = dx;
    state.elevation = clampElevation(state.elevation + dy);
    commitView();
  };

  const onPointerUp = () => {
    const state = motion.current;
    if (!state.drag) return;
    state.drag = null;
    if (prefersReducedMotion()) state.velocity = 0;
    animateRotation();
  };

  const onKeyDown = (event: KeyboardEvent<SVGSVGElement>) => {
    const state = motion.current;
    const horizontal = { ArrowLeft: -1, ArrowRight: 1 }[event.key];
    const vertical = { ArrowUp: -1, ArrowDown: 1 }[event.key];
    if (!horizontal && !vertical) return;
    event.preventDefault();
    if (vertical) {
      state.elevation = clampElevation(state.elevation + vertical * KEY_STEP * 0.5);
      commitView();
      return;
    }
    state.velocity = 0;
    state.target = (state.target ?? state.angle) + horizontal! * KEY_STEP;
    animateRotation();
  };

  const resetEnergy = () => {
    for (const id of EDGE_IDS) {
      const lit = litRefs.current[id];
      const pulse = pulseRefs.current[id];
      if (lit) lit.style.strokeDasharray = HIDDEN_DASH;
      if (pulse) pulse.style.opacity = "0";
    }
  };

  const fireEdge = (edgeId: string, id: number, reduced: boolean) =>
    new Promise<void>((resolve) => {
      const path = pathRefs.current[edgeId];
      const lit = litRefs.current[edgeId];
      const pulse = pulseRefs.current[edgeId];
      if (!path || !lit || !pulse) return resolve();

      if (reduced) {
        lit.style.strokeDasharray = "none";
        return resolve();
      }

      const dots = Array.from(pulse.children) as SVGCircleElement[];
      pulse.style.opacity = "1";
      const start = performance.now();

      const frame = (now: number) => {
        if (id !== runId.current) return resolve();
        const raw = Math.min(1, (now - start) / EDGE_MS);
        const eased = raw < 0.5 ? 4 * raw ** 3 : 1 - (-2 * raw + 2) ** 3 / 2;
        const length = path.getTotalLength();
        lit.style.strokeDasharray = `${length * eased} 100000`;
        dots.forEach((dot, index) => {
          const point = path.getPointAtLength(Math.max(0, eased - TRAIL[index]) * length);
          dot.setAttribute("cx", point.x.toFixed(1));
          dot.setAttribute("cy", point.y.toFixed(1));
        });
        if (raw < 1) {
          requestAnimationFrame(frame);
        } else {
          lit.style.strokeDasharray = "none";
          pulse.style.opacity = "0";
          resolve();
        }
      };
      requestAnimationFrame(frame);
    });

  const run = async () => {
    const id = ++runId.current;
    const reduced = prefersReducedMotion();
    const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, reduced ? Math.min(ms, 250) : ms));

    resetEnergy();
    setActiveNodes(new Set());
    setPhase("running");

    for (const [index, step] of STAGES.entries()) {
      if (id !== runId.current) return;
      setStage(index);
      setActiveNodes((prev) => new Set([...prev, ...step.nodes]));
      await wait(450);
      await Promise.all(step.next.map((edgeId) => fireEdge(edgeId, id, reduced)));
    }

    if (id !== runId.current) return;
    await wait(300);
    setPhase("done");
  };

  const status =
    phase === "done" ? t.done.replace("{count}", String(STAGES.length)) : stage !== null && phase === "running" ? t.stages[stage] : t.idle;

  return (
    <div className="flex flex-col">
      <svg
        viewBox="0 0 640 390"
        role="img"
        tabIndex={0}
        aria-label={t.ariaLabel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
        className="h-auto w-full cursor-grab touch-pan-y select-none outline-none active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-violet-500/60"
      >
        <defs>
          <filter id="energy-glow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="node-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>

        <polygon points={scene.floor} fill="rgb(255 255 255 / 0.015)" stroke="rgb(255 255 255 / 0.06)" />

        {scene.edges
          .filter((edge) => edge.pipe)
          .map((edge) => (
            <g key={edge.id}>
              <path d={edge.d} fill="none" stroke={FACE.pipe} strokeOpacity={0.35} strokeWidth={1.5} strokeLinejoin="round" />
              <path d={edge.d} fill="none" stroke={FACE.pipe} strokeOpacity={0.7} strokeWidth={1.5} className="iso-flow" />
              <circle cx={edge.joint[0]} cy={edge.joint[1]} r={2.5} fill={FACE.pipe} />
            </g>
          ))}

        {scene.edges.map((edge) => (
          <path
            key={`route-${edge.id}`}
            ref={(el) => {
              pathRefs.current[edge.id] = el;
            }}
            d={edge.d}
            fill="none"
            stroke="none"
          />
        ))}

        {scene.edges.map((edge) => (
          <path
            key={`lit-${edge.id}`}
            ref={(el) => {
              litRefs.current[edge.id] = el;
            }}
            d={edge.d}
            fill="none"
            stroke="#A78BFA"
            strokeWidth={2.5}
            strokeLinejoin="round"
            strokeLinecap="round"
            style={{ strokeDasharray: HIDDEN_DASH }}
            filter="url(#energy-glow)"
          />
        ))}

        {scene.blocks.map((block) => (
          <ellipse
            key={`halo-${block.id}`}
            cx={block.halo[0]}
            cy={block.halo[1]}
            rx={46}
            ry={26}
            fill="#8B5CF6"
            filter="url(#node-glow)"
            className="transition-opacity duration-500"
            opacity={activeNodes.has(block.id) ? 0.55 : 0}
          />
        ))}

        {scene.blocks.map((block, index) => {
          const active = activeNodes.has(block.id);
          return (
            <g key={block.id} className="iso-float" style={{ animationDelay: `${index * -0.9}s` }}>
              <g className="iso-node">
                {block.levels.map((level, levelIndex) => (
                  <g key={levelIndex}>
                    {level.sides.map((side, sideIndex) => (
                      <polygon key={sideIndex} points={side.points} fill={side.fill} />
                    ))}
                    <polygon
                      className="iso-top"
                      points={level.top}
                      fill={active && levelIndex === block.levels.length - 1 ? FACE.topActive : FACE.top}
                    />
                  </g>
                ))}
                {block.leds.map(([lx, ly], ledIndex) => (
                  <circle key={ledIndex} cx={lx} cy={ly} r={1.6} className="iso-led" fill={active ? "#F5F3FF" : "#1F1D46"} />
                ))}
              </g>
              <text
                x={block.labelAt[0]}
                y={block.labelAt[1] - 26}
                textAnchor="middle"
                className="font-mono text-[12px] tracking-wide transition-[fill] duration-300"
                fill={active ? "#FFFFFF" : "#A1A1AA"}
              >
                {t.labels[block.id]}
              </text>
            </g>
          );
        })}

        {EDGE_IDS.map((id) => (
          <g
            key={`pulse-${id}`}
            ref={(el) => {
              pulseRefs.current[id] = el;
            }}
            style={{ opacity: 0 }}
            filter="url(#energy-glow)"
          >
            {TRAIL.map((_, index) => (
              <circle key={index} r={4.5 - index} fill={index === 0 ? "#F5F3FF" : "#A78BFA"} opacity={1 - index * 0.22} />
            ))}
          </g>
        ))}
      </svg>

      <div className="flex items-center justify-between gap-4 border-t border-white/[0.06] px-4 py-3 sm:px-5">
        <p aria-live="polite" className="flex min-w-0 items-center gap-2 font-mono text-xs text-zinc-400">
          <span
            aria-hidden="true"
            className={`size-1.5 shrink-0 rounded-full ${phase === "running" ? "animate-pulse bg-violet-400" : phase === "done" ? "bg-emerald-400" : "bg-zinc-600"}`}
          />
          <span className="leading-snug">{status}</span>
        </p>
        <button
          type="button"
          onClick={run}
          disabled={phase === "running"}
          className={
            "inline-flex h-9 shrink-0 items-center gap-2 rounded-full border border-indigo-500/40 bg-indigo-500/15 px-4 text-sm font-medium text-indigo-100 " +
            "transition-[background-color,border-color,scale,opacity] duration-150 ease-out-strong hover:border-indigo-400/60 hover:bg-indigo-500/25 " +
            "active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 disabled:cursor-wait disabled:opacity-60"
          }
        >
          <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5" fill="currentColor">
            <path d="M4.5 3.2v9.6a.6.6 0 0 0 .9.5l7.6-4.8a.6.6 0 0 0 0-1L5.4 2.7a.6.6 0 0 0-.9.5Z" />
          </svg>
          {phase === "running" ? t.running : phase === "done" ? t.rerun : t.run}
        </button>
      </div>
    </div>
  );
}
