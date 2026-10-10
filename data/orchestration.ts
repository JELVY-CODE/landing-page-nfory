export type NodeId = "ingest" | "agent" | "validate" | "data" | "erp";

export type ProcessNode = {
  id: NodeId;
  cx: number;
  cy: number;
  h: number;
  stack?: number;
};

export const NODES: ProcessNode[] = [
  { id: "ingest", cx: -6, cy: 6, h: 1.6, stack: 2 },
  { id: "agent", cx: -3.5, cy: 1.5, h: 3 },
  { id: "validate", cx: -1, cy: -5, h: 1.4 },
  { id: "data", cx: 4, cy: 3, h: 2.4, stack: 3 },
  { id: "erp", cx: 6, cy: -6, h: 2.2 },
];

export const LINKS: { from: NodeId; to: NodeId; pipe: boolean }[] = [
  { from: "ingest", to: "agent", pipe: true },
  { from: "agent", to: "data", pipe: true },
  { from: "data", to: "agent", pipe: false },
  { from: "agent", to: "validate", pipe: true },
  { from: "validate", to: "erp", pipe: true },
];

export const STAGES: { nodes: NodeId[]; next: string[] }[] = [
  { nodes: ["ingest"], next: ["ingest-agent"] },
  { nodes: ["agent"], next: ["agent-data"] },
  { nodes: ["data"], next: ["data-agent"] },
  { nodes: [], next: ["agent-validate"] },
  { nodes: ["validate"], next: ["validate-erp"] },
  { nodes: ["erp"], next: [] },
];
