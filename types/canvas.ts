import type { Edge, Node } from "@xyflow/react";

export const NODE_COLORS = {
  neutral: { fill: "#1F1F1F", text: "#EDEDED" },
  blue: { fill: "#10233D", text: "#52A8FF" },
  purple: { fill: "#2E1938", text: "#BF7AF0" },
  orange: { fill: "#331B00", text: "#FF990A" },
  red: { fill: "#3C1618", text: "#FF6166" },
  pink: { fill: "#3A1726", text: "#F75F8F" },
  green: { fill: "#0F2E18", text: "#62C073" },
  teal: { fill: "#062822", text: "#0AC7B4" },
} as const;

export type NodeColorKey = keyof typeof NODE_COLORS;

export const DEFAULT_NODE_COLOR: NodeColorKey = "neutral";

export const NODE_SHAPES = [
  "rectangle",
  "diamond",
  "circle",
  "pill",
  "cylinder",
  "hexagon",
] as const;

export type NodeShape = (typeof NODE_SHAPES)[number];

export const DEFAULT_NODE_SHAPE: NodeShape = "rectangle";

export const SHAPE_DEFAULT_SIZES: Record<
  NodeShape,
  { width: number; height: number }
> = {
  rectangle: { width: 160, height: 80 },
  diamond: { width: 140, height: 140 },
  circle: { width: 100, height: 100 },
  pill: { width: 160, height: 64 },
  cylinder: { width: 120, height: 100 },
  hexagon: { width: 140, height: 120 },
};

export const SHAPE_DRAG_MIME_TYPE = "application/ghost-canvas-shape";

export interface ShapeDragPayload {
  shape: NodeShape;
  width: number;
  height: number;
}

export interface CanvasNodeData extends Record<string, unknown> {
  label: string;
  color: NodeColorKey;
  shape: NodeShape;
}

export type CanvasNode = Node<CanvasNodeData, "canvasNode">;
export type CanvasEdge = Edge<Record<string, never>, "canvasEdge">;
