import { auth, currentUser } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

export interface ClerkIdentity {
  userId: string;
  primaryEmail: string | null;
}

export async function getCurrentClerkIdentity(): Promise<ClerkIdentity | null> {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const user = await currentUser();
  const primaryEmail = user?.primaryEmailAddress?.emailAddress ?? null;

  return { userId, primaryEmail };
}

export async function getAccessibleProject(roomId: string, identity: ClerkIdentity) {
  if (!roomId) {
    return null;
  }

  return prisma.project.findFirst({
    where: {
      id: roomId,
      OR: [
        { ownerId: identity.userId },
        ...(identity.primaryEmail
          ? [{ collaborators: { some: { email: identity.primaryEmail } } }]
          : []),
      ],
    },
  });
}

export async function hasProjectAccess(
  roomId: string,
  identity: ClerkIdentity
): Promise<boolean> {
  const project = await getAccessibleProject(roomId, identity);
  return project !== null;
}
