"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectDialogs } from "@/components/editor/project-dialogs";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { useProjectActions, type ProjectItem } from "@/hooks/use-project-actions";
import { cn } from "@/lib/utils";

interface WorkspaceShellProps {
  roomId: string;
  projectName: string;
  ownedProjects: ProjectItem[];
  sharedProjects: ProjectItem[];
}

export function WorkspaceShell({
  roomId,
  projectName,
  ownedProjects,
  sharedProjects,
}: WorkspaceShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(false);
  const projectActions = useProjectActions({ ownedProjects, sharedProjects });

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-base text-copy-primary">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((isOpen) => !isOpen)}
        projectName={projectName}
        isAiSidebarOpen={isAiSidebarOpen}
        onToggleAiSidebar={() => setIsAiSidebarOpen((isOpen) => !isOpen)}
      />

      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
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
          className="relative flex min-h-0 flex-1 items-center justify-center bg-base px-6"
          aria-label="Canvas workspace"
        >
          <div className="max-w-lg text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-copy-muted">
              Canvas
            </p>
            <h1 className="mt-4 text-2xl font-semibold text-copy-primary sm:text-3xl">
              Architecture canvas coming soon
            </h1>
            <p className="mt-3 text-sm leading-6 text-copy-secondary">
              This workspace is ready for your project. The collaborative canvas
              will load here in a future update.
            </p>
          </div>
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
        >
          <div className="flex items-center gap-2 border-b border-surface-border px-4 py-4">
            <Sparkles className="h-4 w-4 text-accent-ai-text" aria-hidden="true" />
            <h2 className="text-sm font-medium text-copy-primary">Ghost AI</h2>
          </div>
          <div className="flex flex-1 items-center justify-center px-6 text-center">
            <p className="text-sm leading-6 text-copy-muted">
              AI chat will appear here in a future update.
            </p>
          </div>
        </aside>
      </div>

      <ProjectDialogs controller={projectActions} />
    </div>
  );
}
