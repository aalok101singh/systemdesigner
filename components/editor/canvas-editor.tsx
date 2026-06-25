"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { LiveMap, LiveObject } from "@liveblocks/client";
import { WifiOff } from "lucide-react";
import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
} from "@liveblocks/react/suspense";

import { CanvasFlow } from "@/components/editor/canvas-flow";

interface CanvasEditorProps {
  roomId: string;
}

interface CanvasErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface CanvasErrorBoundaryState {
  hasError: boolean;
}

class CanvasErrorBoundary extends Component<
  CanvasErrorBoundaryProps,
  CanvasErrorBoundaryState
> {
  state: CanvasErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): CanvasErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Canvas connection error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

function CanvasLoadingState() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-base">
      <p className="text-sm text-copy-muted">Loading canvas…</p>
    </div>
  );
}

function CanvasConnectionError() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-base px-6 text-center">
      <WifiOff className="h-8 w-8 text-copy-muted" aria-hidden="true" />
      <div>
        <p className="text-sm font-medium text-copy-primary">
          Unable to connect to the canvas
        </p>
        <p className="mt-1 text-sm text-copy-muted">
          Check your connection and try refreshing the page.
        </p>
      </div>
    </div>
  );
}

export function CanvasEditor({ roomId }: CanvasEditorProps) {
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <RoomProvider
        id={roomId}
        initialPresence={{ cursor: null, isThinking: false }}
        initialStorage={{
          flow: new LiveObject({
            nodes: new LiveMap(),
            edges: new LiveMap(),
          }),
        }}
      >
        <CanvasErrorBoundary fallback={<CanvasConnectionError />}>
          <ClientSideSuspense fallback={<CanvasLoadingState />}>
            <div className="h-full w-full">
              <CanvasFlow />
            </div>
          </ClientSideSuspense>
        </CanvasErrorBoundary>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
