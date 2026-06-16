"use client";

import { useMemo, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export type ProjectOwnership = "owner" | "collaborator";

export interface ProjectItem {
  id: string;
  name: string;
  slug: string;
  ownership: ProjectOwnership;
  updatedAtLabel: string;
}

type ProjectDialog =
  | { type: "create" }
  | { type: "rename"; project: ProjectItem }
  | { type: "delete"; project: ProjectItem }
  | null;

function slugifyProjectName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    || "untitled-project";
}

async function fetchJson<T>(url: string, init?: RequestInit) {
  const response = await fetch(url, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers as Record<string, string>),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      errorText || `Request failed with status ${response.status}`
    );
  }

  const contentType = response.headers.get("content-type");

  if (response.status === 204 || !contentType?.includes("application/json")) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function useProjectActions({
  ownedProjects,
  sharedProjects,
}: {
  ownedProjects: ProjectItem[];
  sharedProjects: ProjectItem[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [projects, setProjects] = useState<ProjectItem[]>([
    ...ownedProjects,
    ...sharedProjects,
  ]);

  useEffect(() => {
      setProjects([...ownedProjects, ...sharedProjects]);
  }, [ownedProjects, sharedProjects]);
  const [dialog, setDialog] = useState<ProjectDialog>(null);
  const [projectName, setProjectName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const slugPreview = useMemo(
    () => slugifyProjectName(projectName),
    [projectName]
  );

  const ownedProjectList = projects.filter(
    (project) => project.ownership === "owner"
  );
  const sharedProjectList = projects.filter(
    (project) => project.ownership === "collaborator"
  );

  function openCreateDialog() {
    setProjectName("");
    setDialog({ type: "create" });
  }

  function openRenameDialog(project: ProjectItem) {
    setProjectName(project.name);
    setDialog({ type: "rename", project });
  }

  function openDeleteDialog(project: ProjectItem) {
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

    try {
      const project = await fetchJson<ProjectItem>("/api/projects", {
        method: "POST",
        body: JSON.stringify({ name: trimmedName }),
      });

      setProjects((currentProjects) => [project, ...currentProjects]);
      setDialog(null);
      setProjectName("");
      router.push(`/editor/${project.id}`);
    } catch (error) {
      console.error("Failed to create project:", error);
      window.alert("Failed to create project. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function submitRenameProject() {
    if (dialog?.type !== "rename") {
      return;
    }

    const trimmedName = projectName.trim();
    if (!trimmedName) {
      return;
    }

    setIsLoading(true);

    try {
      const updatedProject = await fetchJson<ProjectItem>(
        `/api/projects/${dialog.project.id}`,
        {
          method: "PATCH",
          body: JSON.stringify({ name: trimmedName }),
        }
      );

      setProjects((currentProjects) =>
        currentProjects.map((project) =>
          project.id === updatedProject.id ? updatedProject : project
        )
      );
      setDialog(null);
      setProjectName("");
    } catch (error) {
      console.error("Failed to rename project:", error);
      window.alert("Failed to rename project. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function submitDeleteProject() {
    if (dialog?.type !== "delete") {
      return;
    }

    setIsLoading(true);

    try {
      await fetchJson<void>(`/api/projects/${dialog.project.id}`, {
        method: "DELETE",
      });

      setProjects((currentProjects) =>
        currentProjects.filter((project) => project.id !== dialog.project.id)
      );

      if (pathname === `/editor/${dialog.project.id}`) {
        router.push("/editor");
      }

      setDialog(null);
      } catch (error) {
        console.error("Failed to delete project:", error);
        window.alert("Failed to delete project. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function openProject(project: ProjectItem) {
    router.push(`/editor/${project.id}`);
  }

  return {
    dialog,
    isLoading,
    ownedProjects: ownedProjectList,
    projectName,
    projects,
    sharedProjects: sharedProjectList,
    slugPreview,
    closeDialog,
    openCreateDialog,
    openDeleteDialog,
    openProject,
    openRenameDialog,
    setProjectName,
    submitCreateProject,
    submitDeleteProject,
    submitRenameProject,
  };
}
