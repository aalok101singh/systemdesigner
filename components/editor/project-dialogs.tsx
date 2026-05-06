"use client";

import {
  AlertTriangle,
  FolderPlus,
  Pencil,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { ProjectDialogsController } from "@/components/editor/use-project-dialogs";

interface ProjectDialogsProps {
  controller: ProjectDialogsController;
}

export function ProjectDialogs({ controller }: ProjectDialogsProps) {
  const {
    dialog,
    isLoading,
    projectName,
    slugPreview,
    closeDialog,
    setProjectName,
    submitCreateProject,
    submitDeleteProject,
    submitRenameProject,
  } = controller;

  const isCreateOpen = dialog?.type === "create";
  const isRenameOpen = dialog?.type === "rename";
  const isDeleteOpen = dialog?.type === "delete";
  const canSubmitName = projectName.trim().length > 0 && !isLoading;

  return (
    <>
      <Dialog open={isCreateOpen} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="rounded-3xl border border-surface-border bg-elevated p-5 text-copy-primary shadow-2xl sm:max-w-md">
          <DialogHeader>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-dim text-brand">
              <FolderPlus className="h-5 w-5" />
            </div>
            <DialogTitle className="text-copy-primary">
              Create Project
            </DialogTitle>
            <DialogDescription className="text-copy-secondary">
              Name a new architecture workspace. Persistence will be connected in a later feature unit.
            </DialogDescription>
          </DialogHeader>

          <form
            className="grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              void submitCreateProject();
            }}
          >
            <div className="grid gap-2">
              <label
                className="text-xs font-medium uppercase text-copy-muted"
                htmlFor="create-project-name"
              >
                Project name
              </label>
              <Input
                id="create-project-name"
                autoFocus
                value={projectName}
                placeholder="System design workspace"
                className="text-copy-primary placeholder:text-copy-muted"
                disabled={isLoading}
                onChange={(event) => setProjectName(event.target.value)}
              />
            </div>

            <div className="rounded-xl border border-surface-border bg-subtle px-3 py-2">
              <p className="text-xs font-medium uppercase text-copy-faint">
                Slug preview
              </p>
              <p className="mt-1 truncate font-mono text-sm text-brand">
                {slugPreview}
              </p>
            </div>

            <DialogFooter className="-mx-5 -mb-5 rounded-b-3xl border-surface-border bg-subtle/60">
              <Button
                type="button"
                variant="outline"
                className="text-copy-primary"
                onClick={closeDialog}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!canSubmitName}>
                {isLoading ? "Creating..." : "Create Project"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isRenameOpen} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="rounded-3xl border border-surface-border bg-elevated p-5 text-copy-primary shadow-2xl sm:max-w-md">
          <DialogHeader>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-dim text-brand">
              <Pencil className="h-5 w-5" />
            </div>
            <DialogTitle className="text-copy-primary">
              Rename Project
            </DialogTitle>
            <DialogDescription className="text-copy-secondary">
              Current project: {dialog?.type === "rename" ? dialog.project.name : ""}
            </DialogDescription>
          </DialogHeader>

          <form
            className="grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              void submitRenameProject();
            }}
          >
            <div className="grid gap-2">
              <label
                className="text-xs font-medium uppercase text-copy-muted"
                htmlFor="rename-project-name"
              >
                Project name
              </label>
              <Input
                id="rename-project-name"
                autoFocus
                value={projectName}
                className="text-copy-primary placeholder:text-copy-muted"
                disabled={isLoading}
                onChange={(event) => setProjectName(event.target.value)}
              />
            </div>

            <DialogFooter className="-mx-5 -mb-5 rounded-b-3xl border-surface-border bg-subtle/60">
              <Button
                type="button"
                variant="outline"
                className="text-copy-primary"
                onClick={closeDialog}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!canSubmitName}>
                {isLoading ? "Renaming..." : "Rename Project"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="rounded-3xl border border-surface-border bg-elevated p-5 text-copy-primary shadow-2xl sm:max-w-md">
          <DialogHeader>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/15 text-destructive">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <DialogTitle className="text-copy-primary">
              Delete Project
            </DialogTitle>
            <DialogDescription className="text-copy-secondary">
              This removes {dialog?.type === "delete" ? dialog.project.name : "this project"} from the mock project list.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              void submitDeleteProject();
            }}
          >
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-copy-secondary">
              This destructive action has no text confirmation in this feature unit.
            </div>

            <DialogFooter className="-mx-5 -mb-5 mt-4 rounded-b-3xl border-surface-border bg-subtle/60">
              <Button
                type="button"
                variant="outline"
                className="text-copy-primary"
                onClick={closeDialog}
              >
                Cancel
              </Button>
              <Button type="submit" variant="destructive" disabled={isLoading}>
                <Trash2 className="h-4 w-4" />
                {isLoading ? "Deleting..." : "Delete Project"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
