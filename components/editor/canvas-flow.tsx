"use client";

import { useCallback, type DragEvent } from "react";
import {
  Background,
  BackgroundVariant,
  ConnectionMode,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import { useLiveblocksFlow } from "@liveblocks/react-flow";

import { CanvasNodeRenderer } from "@/components/editor/canvas-node";
import { ShapePanel } from "@/components/editor/shape-panel";
import {
  createCanvasNodeId,
  DEFAULT_NODE_COLOR,
  parseShapeDragPayload,
} from "@/lib/canvas-nodes";
import type { CanvasEdge, CanvasNode } from "@/types/canvas";
import { SHAPE_DRAG_MIME_TYPE } from "@/types/canvas";

import "@xyflow/react/dist/style.css";
import "@liveblocks/react-flow/styles.css";

const nodeTypes = {
  canvasNode: CanvasNodeRenderer,
};

function CanvasFlowInner() {
  const { screenToFlowPosition } = useReactFlow();
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDelete } =
    useLiveblocksFlow<CanvasNode, CanvasEdge>({
      suspense: true,
      nodes: { initial: [] },
      edges: { initial: [] },
    });

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const payload = parseShapeDragPayload(
        event.dataTransfer.getData(SHAPE_DRAG_MIME_TYPE)
      );
      if (!payload) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: CanvasNode = {
        id: createCanvasNodeId(payload.shape),
        type: "canvasNode",
        position,
        width: payload.width,
        height: payload.height,
        data: {
          label: "",
          color: DEFAULT_NODE_COLOR,
          shape: payload.shape,
        },
      };

      onNodesChange([{ type: "add", item: newNode }]);
    },
    [onNodesChange, screenToFlowPosition]
  );

  return (
    <div
      className="relative h-full w-full"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDelete={onDelete}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        className="h-full bg-base"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="var(--border-subtle)"
        />
        <MiniMap
          className="!rounded-xl !border !border-surface-border !bg-surface"
          maskColor="rgba(8, 8, 9, 0.75)"
          nodeColor="var(--border-subtle)"
        />
      </ReactFlow>
      <ShapePanel />
    </div>
  );
}

export function CanvasFlow() {
  return (
    <ReactFlowProvider>
      <CanvasFlowInner />
    </ReactFlowProvider>
  );
}
