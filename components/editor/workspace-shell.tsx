"use client";

import { useState } from "react";
import { Sparkles, X } from "lucide-react";

import { CanvasEditor } from "@/components/editor/canvas-editor";
import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectDialogs } from "@/components/editor/project-dialogs";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { ShareDialog } from "@/components/editor/share-dialog";
import { Button } from "@/components/ui/button";
import { useProjectActions, type ProjectItem } from "@/hooks/use-project-actions";
import { useShareDialog } from "@/hooks/use-share-dialog";
import { cn } from "@/lib/utils";

interface WorkspaceShellProps {
  roomId: string;
  projectName: string;
  isOwner: boolean;
  ownedProjects: ProjectItem[];
  sharedProjects: ProjectItem[];
}

export function WorkspaceShell({
  roomId,
  projectName,
  isOwner,
  ownedProjects,
  sharedProjects,
}: WorkspaceShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(false);
  const projectActions = useProjectActions({ ownedProjects, sharedProjects });
  const shareDialog = useShareDialog(roomId);

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-base text-copy-primary">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((isOpen) => !isOpen)}
        projectName={projectName}
        isAiSidebarOpen={isAiSidebarOpen}
        onToggleAiSidebar={() => setIsAiSidebarOpen((isOpen) => !isOpen)}
        onShareClick={shareDialog.openDialog}
      />

      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        closeOnOutsideClick={false}
        ownedProjects={projectActions.ownedProjects}
        sharedProjects={projectActions.sharedProjects}
        activeRoomId={roomId}
        onCreateProject={projectActions.openCreateDialog}
        onRenameProject={projectActions.openRenameDialog}
        onDeleteProject={projectActions.openDeleteDialog}
        onOpenProject={projectActions.openProject}
      />

      <div className="relative flex min-h-0 flex-1">
        <main
          className="relative min-h-0 flex-1 bg-base"
          aria-label="Canvas workspace"
        >
          <CanvasEditor roomId={roomId} />
        </main>

        <aside
          className={cn(
            "fixed right-4 top-16 bottom-4 z-40 flex w-[min(20rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-[1.75rem] border border-sidebar-border bg-sidebar shadow-2xl transition-transform duration-200 ease-out",
            isAiSidebarOpen
              ? "translate-x-0"
              : "pointer-events-none translate-x-[calc(100%+1rem)]"
          )}
          aria-hidden={!isAiSidebarOpen}
          inert={!isAiSidebarOpen ? true : undefined}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-surface-border px-4 py-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent-ai-text" aria-hidden="true" />
              <h2 className="text-sm font-medium text-copy-primary">Ghost AI</h2>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Close AI sidebar"
              onClick={() => setIsAiSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-1 items-center justify-center px-6 text-center">
            <p className="text-sm leading-6 text-copy-muted">
              AI chat will appear here in a future update.
            </p>
          </div>
        </aside>
      </div>

      <ProjectDialogs controller={projectActions} />
      <ShareDialog
        controller={shareDialog}
        isOwner={isOwner}
        projectId={roomId}
        projectName={projectName}
      />
    </div>
  );
}
