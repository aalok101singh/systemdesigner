import { clerkClient } from "@clerk/nextjs/server";

import { ForbiddenError } from "@/lib/projects";
import { prisma } from "@/lib/prisma";
import type { ClerkIdentity } from "@/lib/project-access";
import { getAccessibleProject } from "@/lib/project-access";

export interface CollaboratorProfile {
  id: string;
  email: string;
  createdAt: string;
  displayName: string | null;
  avatarUrl: string | null;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string) {
  return EMAIL_PATTERN.test(email);
}

async function getClerkProfileForEmail(email: string) {
  try {
    const client = await clerkClient();
    const response = await client.users.getUserList({
      emailAddress: [email],
      limit: 1,
    });
    const user = response.data[0];

    if (!user) {
      return null;
    }

    const displayName =
      user.fullName?.trim() ||
      [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
      null;

    return {
      displayName: displayName || null,
      avatarUrl: user.imageUrl ?? null,
    };
  } catch (error) {
    console.error("Failed to load Clerk profile for collaborator:", error);
    return null;
  }
}

async function enrichCollaborators(
  collaborators: Array<{ id: string; email: string; createdAt: Date }>
): Promise<CollaboratorProfile[]> {
  const profiles = await Promise.all(
    collaborators.map(async (collaborator) => {
      const clerkProfile = await getClerkProfileForEmail(collaborator.email);

      return {
        id: collaborator.id,
        email: collaborator.email,
        createdAt: collaborator.createdAt.toISOString(),
        displayName: clerkProfile?.displayName ?? null,
        avatarUrl: clerkProfile?.avatarUrl ?? null,
      };
    })
  );

  return profiles;
}

async function assertProjectOwner(projectId: string, ownerId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, ownerId: true },
  });

  if (!project) {
    return null;
  }

  if (project.ownerId !== ownerId) {
    throw new ForbiddenError();
  }

  return project;
}

export async function listProjectCollaborators(
  projectId: string,
  identity: ClerkIdentity
): Promise<CollaboratorProfile[] | null> {
  const project = await getAccessibleProject(projectId, identity);

  if (!project) {
    return null;
  }

  const collaborators = await prisma.projectCollaborator.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      email: true,
      createdAt: true,
    },
  });

  return enrichCollaborators(collaborators);
}

export async function inviteProjectCollaborator(
  projectId: string,
  ownerId: string,
  rawEmail: string
): Promise<CollaboratorProfile | "invalid-email" | "duplicate" | "self-invite" | null> {
  const email = normalizeEmail(rawEmail);

  if (!isValidEmail(email)) {
    return "invalid-email";
  }

  const project = await assertProjectOwner(projectId, ownerId);

  if (!project) {
    return null;
  }

  const owner = await clerkClient().then((client) => client.users.getUser(ownerId));
  const ownerEmail = owner.primaryEmailAddress?.emailAddress?.toLowerCase() ?? null;

  if (ownerEmail && ownerEmail === email) {
    return "self-invite";
  }

  const existingCollaborator = await prisma.projectCollaborator.findUnique({
    where: {
      projectId_email: {
        projectId,
        email,
      },
    },
  });

  if (existingCollaborator) {
    return "duplicate";
  }

  const collaborator = await prisma.projectCollaborator.create({
    data: {
      projectId,
      email,
    },
    select: {
      id: true,
      email: true,
      createdAt: true,
    },
  });

  const [enrichedCollaborator] = await enrichCollaborators([collaborator]);
  return enrichedCollaborator;
}

export async function removeProjectCollaborator(
  projectId: string,
  ownerId: string,
  collaboratorId: string
): Promise<boolean> {
  const project = await assertProjectOwner(projectId, ownerId);

  if (!project) {
    return false;
  }

  const deleted = await prisma.projectCollaborator.deleteMany({
    where: {
      id: collaboratorId,
      projectId,
    },
  });

  return deleted.count > 0;
}
