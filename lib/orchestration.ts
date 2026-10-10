import { LINKS, NODES, STAGES, type NodeId, type ProcessNode } from "@/data/orchestration";

export { LINKS, NODES, STAGES, type NodeId, type ProcessNode };

export type Point = [number, number];

export const FACE = {
  top: "#818CF8",
  topActive: "#C7D2FE",
  left: "#6366F1",
  right: "#8B5CF6",
  pipe: "#C3C4CD",
};

const UNIT = 18;
const ORIGIN = { x: 320, y: 214 };
const SIZE = 2.4;
const FLOOR = 8.2;

// Escala ortográfica que reproduce la isometría clásica (azimut 45°, elevación ≈35.26°).
const SCALE = UNIT * Math.cos(Math.PI / 6) / Math.SQRT1_2;
export const ISO_ELEVATION = Math.asin(1 / Math.sqrt(3));
export const MIN_ELEVATION = (15 * Math.PI) / 180;
export const MAX_ELEVATION = (65 * Math.PI) / 180;

export const EDGE_IDS = LINKS.map(({ from, to }) => `${from}-${to}`);

type Face = { points: string; fill: string };

export type SceneBlock = {
  id: NodeId;
  depth: number;
  levels: { sides: Face[]; top: string }[];
  leds: Point[];
  labelAt: Point;
  halo: Point;
};

export type SceneEdge = { id: string; d: string; joint: Point; pipe: boolean };

export type Scene = { floor: string; blocks: SceneBlock[]; edges: SceneEdge[] };

const toPoints = (points: Point[]) => points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

const SIDES: { normal: Point; corners: (x: number, y: number) => [Point, Point] }[] = [
  { normal: [0, -1], corners: (x, y) => [[x, y], [x + SIZE, y]] },
  { normal: [1, 0], corners: (x, y) => [[x + SIZE, y], [x + SIZE, y + SIZE]] },
  { normal: [0, 1], corners: (x, y) => [[x + SIZE, y + SIZE], [x, y + SIZE]] },
  { normal: [-1, 0], corners: (x, y) => [[x, y + SIZE], [x, y]] },
];

export function buildScene(angle: number, elevation: number): Scene {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const groundY = Math.SQRT1_2 * Math.sin(elevation) * SCALE;
  const heightY = Math.cos(elevation) * SCALE;

  const rotate = (x: number, y: number): Point => [x * cos - y * sin, x * sin + y * cos];

  // Redondeo a décimas: servidor y navegador deben producir exactamente los mismos atributos al hidratar.
  const project = (x: number, y: number, z = 0): Point => {
    const [rx, ry] = rotate(x, y);
    return [
      Math.round((ORIGIN.x + (rx - ry) * Math.SQRT1_2 * SCALE) * 10) / 10,
      Math.round((ORIGIN.y + (rx + ry) * groundY - z * heightY) * 10) / 10,
    ];
  };

  const byId = (id: NodeId) => NODES.find((node) => node.id === id)!;

  const visibleSides = SIDES.map((side) => {
    const nx = side.normal[0] * cos - side.normal[1] * sin;
    const ny = side.normal[0] * sin + side.normal[1] * cos;
    return { ...side, facing: nx + ny, rightward: nx - ny };
  }).filter((side) => side.facing > 0.001);

  const blocks = NODES.map((node): SceneBlock => {
    const x = node.cx - SIZE / 2;
    const y = node.cy - SIZE / 2;
    const levelCount = node.stack ?? 1;
    const levelHeight = node.h / levelCount;
    const gap = levelCount > 1 ? 0.09 : 0;

    const levels = Array.from({ length: levelCount }, (_, level) => {
      const z0 = level * levelHeight + (level > 0 ? gap : 0);
      const z1 = (level + 1) * levelHeight - (level < levelCount - 1 ? gap : 0);
      return {
        sides: visibleSides.map((side) => {
          const [a, b] = side.corners(x, y);
          return {
            points: toPoints([project(a[0], a[1], z0), project(b[0], b[1], z0), project(b[0], b[1], z1), project(a[0], a[1], z1)]),
            fill: side.rightward > 0 ? FACE.right : FACE.left,
          };
        }),
        top: toPoints([project(x, y, z1), project(x + SIZE, y, z1), project(x + SIZE, y + SIZE, z1), project(x, y + SIZE, z1)]),
      };
    });

    const ledSide = visibleSides.reduce((best, side) => (side.rightward > best.rightward ? side : best), visibleSides[0]);
    const [la, lb] = ledSide.corners(x, y);
    const leds = Array.from({ length: levelCount }, (_, level) =>
      [0.25, 0.45].map((t): Point => project(la[0] + (lb[0] - la[0]) * t, la[1] + (lb[1] - la[1]) * t, (level + 0.5) * levelHeight)),
    ).flat();

    const [rx, ry] = rotate(node.cx, node.cy);
    return {
      id: node.id,
      depth: rx + ry,
      levels,
      leds,
      labelAt: project(node.cx, node.cy, node.h),
      halo: project(node.cx, node.cy),
    };
  }).sort((a, b) => a.depth - b.depth);

  const edges = LINKS.map(({ from, to, pipe }): SceneEdge => {
    const a = byId(from);
    const b = byId(to);
    // Un retorno sin tubería propia recorre en sentido inverso el codo de la tubería de ida.
    const elbow = pipe ? project(b.cx, a.cy) : project(a.cx, b.cy);
    const [p1, corner, p2] = [project(a.cx, a.cy), elbow, project(b.cx, b.cy)];
    return {
      id: `${from}-${to}`,
      d: `M${p1[0].toFixed(1)} ${p1[1].toFixed(1)} L${corner[0].toFixed(1)} ${corner[1].toFixed(1)} L${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`,
      joint: corner,
      pipe,
    };
  });

  const floor = toPoints([project(-FLOOR, -FLOOR), project(FLOOR, -FLOOR), project(FLOOR, FLOOR), project(-FLOOR, FLOOR)]);

  return { floor, blocks, edges };
}
