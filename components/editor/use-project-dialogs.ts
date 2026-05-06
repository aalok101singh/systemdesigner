"use client";

import { useMemo, useState } from "react";

export type ProjectOwnership = "owner" | "collaborator";

export interface MockProject {
  id: string;
  name: string;
  slug: string;
  ownership: ProjectOwnership;
  updatedAtLabel: string;
}

type ProjectDialog =
  | { type: "create" }
  | { type: "rename"; project: MockProject }
  | { type: "delete"; project: MockProject }
  | null;

const MOCK_PROJECTS: MockProject[] = [
  {
    id: "project-checkout-platform",
    name: "Checkout Platform",
    slug: "checkout-platform",
    ownership: "owner",
    updatedAtLabel: "Updated today",
  },
  {
    id: "project-observability-pipeline",
    name: "Observability Pipeline",
    slug: "observability-pipeline",
    ownership: "owner",
    updatedAtLabel: "Updated yesterday",
  },
  {
    id: "project-analytics-control-plane",
    name: "Analytics Control Plane",
    slug: "analytics-control-plane",
    ownership: "collaborator",
    updatedAtLabel: "Shared this week",
  },
];

function slugifyProjectName(name: string) {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "untitled-project";
}

function createMockProject(name: string): MockProject {
  const slug = slugifyProjectName(name);

  return {
    id: `project-${slug}-${Date.now().toString(36)}`,
    name: name.trim(),
    slug,
    ownership: "owner",
    updatedAtLabel: "Created just now",
  };
}

async function waitForMockSubmit() {
  await new Promise<void>((resolve) => {
    window.setTimeout(resolve, 160);
  });
}

export function useProjectDialogs() {
  const [projects, setProjects] = useState<MockProject[]>(MOCK_PROJECTS);
  const [dialog, setDialog] = useState<ProjectDialog>(null);
  const [projectName, setProjectName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const slugPreview = useMemo(
    () => slugifyProjectName(projectName),
    [projectName]
  );

  const ownedProjects = projects.filter(
    (project) => project.ownership === "owner"
  );
  const sharedProjects = projects.filter(
    (project) => project.ownership === "collaborator"
  );

  function openCreateDialog() {
    setProjectName("");
    setDialog({ type: "create" });
  }

  function openRenameDialog(project: MockProject) {
    setProjectName(project.name);
    setDialog({ type: "rename", project });
  }

  function openDeleteDialog(project: MockProject) {
    setProjectName("");
    setDialog({ type: "delete", project });
  }

  function closeDialog() {
    if (isLoading) {
      return;
    }

    setDialog(null);
    setProjectName("");
  }

  async function submitCreateProject() {
    const trimmedName = projectName.trim();

    if (!trimmedName) {
      return;
    }

    setIsLoading(true);
    await waitForMockSubmit();
    setProjects((currentProjects) => [
      createMockProject(trimmedName),
      ...currentProjects,
    ]);
    setIsLoading(false);
    setDialog(null);
    setProjectName("");
  }

  async function submitRenameProject() {
    if (dialog?.type !== "rename") {
      return;
    }

    const trimmedName = projectName.trim();

    if (!trimmedName) {
      return;
    }

    const projectId = dialog.project.id;

    setIsLoading(true);
    await waitForMockSubmit();
    setProjects((currentProjects) =>
      currentProjects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              name: trimmedName,
              slug: slugifyProjectName(trimmedName),
              updatedAtLabel: "Renamed just now",
            }
          : project
      )
    );
    setIsLoading(false);
    setDialog(null);
    setProjectName("");
  }

  async function submitDeleteProject() {
    if (dialog?.type !== "delete") {
      return;
    }

    const projectId = dialog.project.id;

    setIsLoading(true);
    await waitForMockSubmit();
    setProjects((currentProjects) =>
      currentProjects.filter((project) => project.id !== projectId)
    );
    setIsLoading(false);
    setDialog(null);
  }

  return {
    dialog,
    isLoading,
    ownedProjects,
    projectName,
    projects,
    sharedProjects,
    slugPreview,
    closeDialog,
    openCreateDialog,
    openDeleteDialog,
    openRenameDialog,
    setProjectName,
    submitCreateProject,
    submitDeleteProject,
    submitRenameProject,
  };
}

export type ProjectDialogsController = ReturnType<typeof useProjectDialogs>;
