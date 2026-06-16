import { NextResponse } from "next/server";

import {
  ForbiddenError,
  getCurrentUserId,
  renameProjectForUser,
  deleteProjectForUser,
} from "@/lib/projects";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ projectId: string }> }
) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const params = await context.params;
  const projectId = params.projectId;
  const body = await request.json().catch(() => ({}));
  const name = typeof body.name === "string" ? body.name : "";

  if (!name.trim()) {
    return new NextResponse("Project name is required", { status: 400 });
  }

  try {
    const updatedProject = await renameProjectForUser(projectId, userId, name);

    if (!updatedProject) {
      return new NextResponse("Project not found", { status: 404 });
    }

    return NextResponse.json(updatedProject);
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    console.error("Failed to rename project:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ projectId: string }> }
) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const params = await context.params;
  const projectId = params.projectId;
  const deleted = await deleteProjectForUser(projectId, userId);

  if (!deleted) {
    return new NextResponse("Forbidden or not found", { status: 403 });
  }

  return new NextResponse(null, { status: 204 });
}
