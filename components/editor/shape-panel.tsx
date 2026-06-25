"use client";

import {
  Circle,
  Cylinder,
  Diamond,
  Hexagon,
  Pill,
  Square,
} from "lucide-react";

import { createShapeDragPayload } from "@/lib/canvas-nodes";
import { cn } from "@/lib/utils";
import {
  NODE_SHAPES,
  SHAPE_DRAG_MIME_TYPE,
  type NodeShape,
} from "@/types/canvas";

const SHAPE_ICONS: Record<NodeShape, typeof Square> = {
  rectangle: Square,
  diamond: Diamond,
  circle: Circle,
  pill: Pill,
  cylinder: Cylinder,
  hexagon: Hexagon,
};

const SHAPE_LABELS: Record<NodeShape, string> = {
  rectangle: "Rectangle",
  diamond: "Diamond",
  circle: "Circle",
  pill: "Pill",
  cylinder: "Cylinder",
  hexagon: "Hexagon",
};

function handleDragStart(event: React.DragEvent<HTMLButtonElement>, shape: NodeShape) {
  const payload = createShapeDragPayload(shape);
  event.dataTransfer.setData(SHAPE_DRAG_MIME_TYPE, JSON.stringify(payload));
  event.dataTransfer.effectAllowed = "move";
}

export function ShapePanel() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex justify-center"
      aria-label="Shape panel"
    >
      <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-surface-border bg-surface px-3 py-2 shadow-2xl">
        {NODE_SHAPES.map((shape) => {
          const Icon = SHAPE_ICONS[shape];

          return (
            <button
              key={shape}
              type="button"
              draggable
              onDragStart={(event) => handleDragStart(event, shape)}
              className={cn(
                "flex h-9 w-9 cursor-grab items-center justify-center rounded-full text-copy-secondary transition-colors",
                "hover:bg-elevated hover:text-copy-primary active:cursor-grabbing"
              )}
              aria-label={`Drag ${SHAPE_LABELS[shape]} onto canvas`}
              title={SHAPE_LABELS[shape]}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
