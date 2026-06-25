"use client";

import { UserButton } from "@clerk/nextjs";
import {
  PanelLeftClose,
  PanelLeftOpen,
  Share2,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface EditorNavbarProps {
  isSidebarOpen: boolean;
  onToggleSidebar?: () => void;
  projectName?: string;
  isAiSidebarOpen?: boolean;
  onToggleAiSidebar?: () => void;
  onShareClick?: () => void;
}

export function EditorNavbar({
  isSidebarOpen,
  onToggleSidebar,
  projectName,
  isAiSidebarOpen = false,
  onToggleAiSidebar,
  onShareClick,
}: EditorNavbarProps) {
  const SidebarIcon = isSidebarOpen ? PanelLeftClose : PanelLeftOpen;

  return (
    <header className="grid h-14 shrink-0 grid-cols-[1fr_auto_1fr] items-center border-b border-surface-border bg-surface px-4">
      <div className="flex items-center">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={
            isSidebarOpen ? "Close project sidebar" : "Open project sidebar"
          }
          aria-expanded={isSidebarOpen}
          onClick={() => onToggleSidebar?.()}
        >
          <SidebarIcon className="h-5 w-5" />
        </Button>
      </div>

      <div className="min-w-0 px-4 text-center">
        {projectName ? (
          <p className="truncate text-sm font-medium text-copy-primary">
            {projectName}
          </p>
        ) : null}
      </div>

      <div className="flex items-center justify-end gap-1">
        {onToggleAiSidebar ? (
          <>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-label="Share project"
              onClick={() => onShareClick?.()}
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-accent-ai-text hover:bg-accent-ai/10 hover:text-accent-ai-text"
              aria-label={
                isAiSidebarOpen ? "Close AI sidebar" : "Open AI sidebar"
              }
              aria-expanded={isAiSidebarOpen}
              onClick={() => onToggleAiSidebar()}
            >
              <Sparkles className="h-5 w-5" />
            </Button>
          </>
        ) : null}
        <UserButton />
      </div>
    </header>
  );
}
