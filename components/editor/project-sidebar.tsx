"use client";

import { Pencil, Plus, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ProjectItem } from "@/hooks/use-project-actions";
import { cn } from "@/lib/utils";

interface ProjectSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  ownedProjects: ProjectItem[];
  sharedProjects: ProjectItem[];
  onCreateProject: () => void;
  onRenameProject: (project: ProjectItem) => void;
  onDeleteProject: (project: ProjectItem) => void;
  onOpenProject: (project: ProjectItem) => void;
}

function EmptyProjectState({ label }: { label: string }) {
  return (
    <div className="flex min-h-[12rem] w-full items-center justify-center px-4 text-center text-sm text-copy-muted">
      {label}
    </div>
  );
}

function ProjectList({
  projects,
  emptyLabel,
  onRenameProject,
  onDeleteProject,
  onOpenProject,
}: {
  projects: ProjectItem[];
  emptyLabel: string;
  onRenameProject: (project: ProjectItem) => void;
  onDeleteProject: (project: ProjectItem) => void;
  onOpenProject: (project: ProjectItem) => void;
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
            <div
              role="button"
              tabIndex={0}
              className="min-w-0 flex-1 rounded-xl px-2 py-1.5 text-left outline-none transition-colors hover:bg-accent-dim focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => onOpenProject(project)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onOpenProject(project);
                }
              }}
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
            </div>

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
  onOpenProject,
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
          "fixed left-4 top-16 bottom-4 z-40 flex w-[min(20rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-[1.75rem] border border-sidebar-border bg-sidebar shadow-2xl transition-transform duration-200 ease-out",
          isOpen
            ? "translate-x-0"
            : "pointer-events-none -translate-x-[calc(100%+1rem)]"
        )}
        aria-hidden={!isOpen}
        inert={!isOpen ? true : undefined}
      >
        <div className="flex items-center justify-between px-4 py-4">
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

        <Tabs defaultValue="my-projects" className="mx-auto flex w-full max-w-[22rem] flex-1 flex-col items-center overflow-hidden px-4 pb-4 pt-4">
          <div className="rounded-3xl border border-surface-border bg-surface p-3 mx-auto w-full max-w-[20rem]">
            <TabsList className="mx-auto grid w-full grid-cols-2 gap-2 rounded-2xl bg-subtle p-1">
              <TabsTrigger className="h-10 rounded-full border border-surface-border bg-transparent px-4 text-sm font-medium text-copy-muted transition-colors data-[state=active]:bg-surface data-[state=active]:text-copy-primary data-[state=active]:shadow-sm" value="my-projects">
                My Projects
              </TabsTrigger>
              <TabsTrigger className="h-10 rounded-full border border-surface-border bg-transparent px-4 text-sm font-medium text-copy-muted transition-colors data-[state=active]:bg-surface data-[state=active]:text-copy-primary data-[state=active]:shadow-sm" value="shared">
                Shared
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="mt-4 flex min-h-0 flex-1 overflow-hidden rounded-3xl border border-surface-border bg-subtle">
            <div className="flex-1 overflow-y-auto p-4 flex justify-center">
              <div className="w-full max-w-[18rem]">
                <TabsContent
                  value="my-projects"
                  className="h-full"
                >
                  <ProjectList
                    projects={ownedProjects}
                    emptyLabel="No projects yet."
                    onRenameProject={onRenameProject}
                    onDeleteProject={onDeleteProject}
                    onOpenProject={onOpenProject}
                  />
                </TabsContent>
                <TabsContent
                  value="shared"
                  className="h-full"
                >
                  <ProjectList
                    projects={sharedProjects}
                    emptyLabel="No shared projects yet."
                    onRenameProject={onRenameProject}
                    onDeleteProject={onDeleteProject}
                    onOpenProject={onOpenProject}
                  />
                </TabsContent>
              </div>
            </div>
          </div>
        </Tabs>

        <div className="px-4 pb-4 pt-3">
          <Button
            type="button"
            className="w-full"
            size="lg"
            onClick={onCreateProject}
          >
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </aside>
    </>
  );
}
