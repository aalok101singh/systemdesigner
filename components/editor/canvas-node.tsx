"use client";

import { memo } from "react";
import type { NodeProps } from "@xyflow/react";

import { NODE_COLORS, type CanvasNode } from "@/types/canvas";

function CanvasNodeComponent({ data }: NodeProps<CanvasNode>) {
  const { fill, text } = NODE_COLORS[data.color];

  return (
    <div
      className="flex h-full w-full items-center justify-center rounded-xl border border-surface-border px-3 text-sm"
      style={{ backgroundColor: fill, color: text }}
    >
      {data.label ? (
        <span className="truncate">{data.label}</span>
      ) : null}
    </div>
  );
}

export const CanvasNodeRenderer = memo(CanvasNodeComponent);
