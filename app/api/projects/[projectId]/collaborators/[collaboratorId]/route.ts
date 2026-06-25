import { NextResponse } from "next/server";

import { removeProjectCollaborator } from "@/lib/collaborators";
import { ForbiddenError } from "@/lib/projects";
import { getCurrentClerkIdentity } from "@/lib/project-access";

export async function DELETE(
  _request: Request,
  context: {
    params: Promise<{ projectId: string; collaboratorId: string }>;
  }
) {
  const identity = await getCurrentClerkIdentity();

  if (!identity) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { projectId, collaboratorId } = await context.params;

  try {
    const removed = await removeProjectCollaborator(
      projectId,
      identity.userId,
      collaboratorId
    );

    if (!removed) {
      return new NextResponse("Not found", { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    console.error("Failed to remove collaborator:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
