import { auth, currentUser } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

export type ProjectOwnership = "owner" | "collaborator";

export interface ProjectPayload {
  id: string;
  name: string;
  slug: string;
  ownership: ProjectOwnership;
  updatedAtLabel: string;
}

function slugifyProjectName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    || "untitled-project";
}

function getUpdatedAtLabel(updatedAt: Date) {
  const deltaMs = Date.now() - updatedAt.getTime();
  const deltaMins = Math.floor(deltaMs / 60000);
  const deltaHours = Math.floor(deltaMins / 60);
  const deltaDays = Math.floor(deltaHours / 24);

  if (deltaMins < 5) {
    return "Updated just now";
  }

  if (deltaHours < 24) {
    return "Updated today";
  }

  if (deltaDays < 7) {
    return "Updated this week";
  }

  return `Updated ${updatedAt.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })}`;
}

function mapProject(project: { id: string; name: string; ownerId: string; updatedAt: Date }, userId: string): ProjectPayload {
  return {
    id: project.id,
    name: project.name,
    slug: slugifyProjectName(project.name),
    ownership: project.ownerId === userId ? "owner" : "collaborator",
    updatedAtLabel: getUpdatedAtLabel(project.updatedAt),
  };
}

export async function getProjectsForUser(userId: string): Promise<{
  ownedProjects: ProjectPayload[];
  sharedProjects: ProjectPayload[];
}> {
  const user = await currentUser();
  const userEmail = user?.emailAddresses?.[0]?.emailAddress;

  const projects = await prisma.project.findMany({
    where: {
      OR: [
        { ownerId: userId },
        ...(userEmail
          ? [{ collaborators: { some: { email: userEmail } } }]
          : []),
      ],
    },
    orderBy: { updatedAt: "desc" },
  });

  return {
    ownedProjects: projects
      .filter((project) => project.ownerId === userId)
      .map((project) => mapProject(project, userId)),
    sharedProjects: projects
      .filter((project) => project.ownerId !== userId)
      .map((project) => mapProject(project, userId)),
  };
}

export async function getProjectById(projectId?: string) {
  if (!projectId) {
    return null;
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    return null;
  }

  return project;
}

export async function createProjectForUser(ownerId: string, name?: string) {
  const projectName = name?.trim() || "Untitled Project";

  const project = await prisma.project.create({
    data: {
      ownerId,
      name: projectName,
    },
  });

  return {
    ...mapProject(project, ownerId),
  };
}

export async function renameProjectForUser(
  projectId: string,
  ownerId: string,
  name: string
) {
  if (!projectId) {
    return null;
  }

  const existingProject = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!existingProject) {
    return null;
  }

  if (existingProject.ownerId !== ownerId) {
    throw new Error("forbidden");
  }

  const updatedProject = await prisma.project.update({
    where: { id: projectId },
    data: { name: name.trim() || "Untitled Project" },
  });

  return mapProject(updatedProject, ownerId);
}

export async function deleteProjectForUser(projectId: string, ownerId: string) {
  const deleted = await prisma.project.deleteMany({
    where: { id: projectId, ownerId },
  });

  return deleted.count > 0;
}

export async function getCurrentUserId() {
  const { userId } = await auth();
  return userId;
}
