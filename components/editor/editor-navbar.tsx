"use client";

import { UserButton } from "@clerk/nextjs";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { Button } from "@/components/ui/button";

interface EditorNavbarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function EditorNavbar({
  isSidebarOpen,
  onToggleSidebar,
}: EditorNavbarProps) {
  const SidebarIcon = isSidebarOpen ? PanelLeftClose : PanelLeftOpen;

  return (
    <header className="grid h-14 shrink-0 grid-cols-[1fr_auto_1fr] items-center border-b border-surface-border bg-surface px-4">
      <div className="flex items-center">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={isSidebarOpen ? "Close project sidebar" : "Open project sidebar"}
          aria-pressed={isSidebarOpen}
          onClick={onToggleSidebar}
        >
          <SidebarIcon className="h-5 w-5" />
        </Button>
      </div>

      <div className="min-w-0" aria-hidden="true" />

      <div className="flex items-center justify-end">
        <UserButton />
      </div>
    </header>
  );
}
