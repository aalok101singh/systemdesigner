import {
  DEFAULT_NODE_COLOR,
  NODE_SHAPES,
  SHAPE_DEFAULT_SIZES,
  type NodeShape,
  type ShapeDragPayload,
} from "@/types/canvas";

let canvasNodeIdCounter = 0;

export function createCanvasNodeId(shape: NodeShape): string {
  canvasNodeIdCounter += 1;
  return `${shape}-${Date.now()}-${canvasNodeIdCounter}`;
}

export function createShapeDragPayload(shape: NodeShape): ShapeDragPayload {
  const size = SHAPE_DEFAULT_SIZES[shape];
  return { shape, width: size.width, height: size.height };
}

export function parseShapeDragPayload(raw: string): ShapeDragPayload | null {
  try {
    const parsed = JSON.parse(raw) as ShapeDragPayload;
    if (!NODE_SHAPES.includes(parsed.shape)) {
      return null;
    }
    if (
      typeof parsed.width !== "number" ||
      typeof parsed.height !== "number" ||
      parsed.width <= 0 ||
      parsed.height <= 0
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export { DEFAULT_NODE_COLOR };
