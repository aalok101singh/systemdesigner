"use client";

import { useState } from "react";
import { PanelLeftOpen, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { ProjectDialogs } from "@/components/editor/project-dialogs";
import { useProjectActions, type ProjectItem } from "@/hooks/use-project-actions";

interface EditorWorkspaceProps {
  ownedProjects: ProjectItem[];
  sharedProjects: ProjectItem[];
}

export function EditorWorkspace({ ownedProjects, sharedProjects }: EditorWorkspaceProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const projectActions = useProjectActions({ ownedProjects, sharedProjects });

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-base text-copy-primary">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((isOpen) => !isOpen)}
      />
      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        ownedProjects={projectActions.ownedProjects}
        sharedProjects={projectActions.sharedProjects}
        onCreateProject={projectActions.openCreateDialog}
        onRenameProject={projectActions.openRenameDialog}
        onDeleteProject={projectActions.openDeleteDialog}
        onOpenProject={projectActions.openProject}
      />
      <main
        className="relative grid min-h-0 flex-1 place-items-center bg-base px-6"
        aria-label="Editor home"
        onClick={() => {
          if (isSidebarOpen) {
            setIsSidebarOpen(false);
          }
        }}
      >
        <div className="max-w-xl text-center">
          <h1 className="text-2xl font-semibold text-copy-primary sm:text-3xl">
            Create a project or open an existing one
          </h1>
          <p className="mt-3 text-sm leading-6 text-copy-muted sm:text-base">
            Start a new architecture workspace, or choose a project from the sidebar.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-2 sm:flex-row">
            <Button
              type="button"
              size="lg"
              onClick={projectActions.openCreateDialog}
            >
              <Plus className="h-4 w-4" />
              New Project
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => setIsSidebarOpen(true)}
            >
              <PanelLeftOpen className="h-4 w-4" />
              Open Existing Project
            </Button>
          </div>
        </div>
      </main>
      <ProjectDialogs controller={projectActions} />
    </div>
  );
}
