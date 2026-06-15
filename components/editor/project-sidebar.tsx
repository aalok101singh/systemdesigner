"use client";

import { Pencil, Plus, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { MockProject } from "@/components/editor/use-project-dialogs";
import { cn } from "@/lib/utils";

interface ProjectSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  ownedProjects: MockProject[];
  sharedProjects: MockProject[];
  onCreateProject: () => void;
  onRenameProject: (project: MockProject) => void;
  onDeleteProject: (project: MockProject) => void;
}

function EmptyProjectState({ label }: { label: string }) {
  return (
    <div className="flex min-h-40 items-center justify-center rounded-2xl border border-dashed border-surface-border-subtle bg-subtle/45 px-4 text-center text-sm text-copy-muted">
      {label}
    </div>
  );
}

function ProjectList({
  projects,
  emptyLabel,
  onRenameProject,
  onDeleteProject,
}: {
  projects: MockProject[];
  emptyLabel: string;
  onRenameProject: (project: MockProject) => void;
  onDeleteProject: (project: MockProject) => void;
}) {
  if (projects.length === 0) {
    return <EmptyProjectState label={emptyLabel} />;
  }

  return (
    <div className="grid gap-2">
      {projects.map((project) => {
        const canManage = project.ownership === "owner";

        return (
          <div
            key={project.id}
            className="flex items-center gap-2 rounded-2xl border border-surface-border bg-subtle/45 p-2"
          >
            <button
              type="button"
              className="min-w-0 flex-1 rounded-xl px-2 py-1.5 text-left outline-none transition-colors hover:bg-accent-dim focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="block truncate text-sm font-medium text-copy-primary">
                {project.name}
              </span>
              <span className="mt-0.5 block truncate font-mono text-xs text-copy-muted">
                {project.slug}
              </span>
              <span className="mt-1 block truncate text-xs text-copy-faint">
                {project.updatedAtLabel}
              </span>
            </button>

            {canManage && (
              <div className="flex shrink-0 items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Rename ${project.name}`}
                  onClick={() => onRenameProject(project)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="text-state-error hover:text-state-error"
                  aria-label={`Delete ${project.name}`}
                  onClick={() => onDeleteProject(project)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function ProjectSidebar({
  isOpen,
  onClose,
  ownedProjects,
  sharedProjects,
  onCreateProject,
  onRenameProject,
  onDeleteProject,
}: ProjectSidebarProps) {
  return (
    <>
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-base/70 backdrop-blur-sm md:hidden"
          aria-label="Close project sidebar"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed bottom-4 left-4 top-18 z-40 flex w-[min(20rem,calc(100vw-2rem))] flex-col rounded-2xl border border-sidebar-border bg-sidebar px-4 py-4 shadow-2xl backdrop-blur transition-transform duration-200 ease-out",
          isOpen
            ? "translate-x-0"
            : "pointer-events-none -translate-x-[calc(100%+1rem)]"
        )}
        aria-hidden={!isOpen}
        inert={!isOpen}
      >
        <div className="mb-4 flex h-8 items-center justify-between">
          <h2 className="text-sm font-medium text-copy-primary">Projects</h2>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Close project sidebar"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Tabs defaultValue="my-projects" className="min-h-0 flex-1">
          <TabsList className="grid w-full grid-cols-2 bg-subtle">
            <TabsTrigger value="my-projects">My Projects</TabsTrigger>
            <TabsTrigger value="shared">Shared</TabsTrigger>
          </TabsList>
          <TabsContent
            value="my-projects"
            className="mt-4 max-h-[calc(100vh-14rem)] overflow-y-auto pr-1"
          >
            <ProjectList
              projects={ownedProjects}
              emptyLabel="No projects yet."
              onRenameProject={onRenameProject}
              onDeleteProject={onDeleteProject}
            />
          </TabsContent>
          <TabsContent
            value="shared"
            className="mt-4 max-h-[calc(100vh-14rem)] overflow-y-auto pr-1"
          >
            <ProjectList
              projects={sharedProjects}
              emptyLabel="No shared projects yet."
              onRenameProject={onRenameProject}
              onDeleteProject={onDeleteProject}
            />
          </TabsContent>
        </Tabs>

        <Button
          type="button"
          className="mt-4 w-full"
          size="lg"
          onClick={onCreateProject}
        >
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </aside>
    </>
  );
}
