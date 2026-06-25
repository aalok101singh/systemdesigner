import { NextResponse } from "next/server";

import {
  inviteProjectCollaborator,
  listProjectCollaborators,
} from "@/lib/collaborators";
import { ForbiddenError } from "@/lib/projects";
import { getCurrentClerkIdentity } from "@/lib/project-access";

export async function GET(
  _request: Request,
  context: { params: Promise<{ projectId: string }> }
) {
  const identity = await getCurrentClerkIdentity();

  if (!identity) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { projectId } = await context.params;

  try {
    const collaborators = await listProjectCollaborators(projectId, identity);

    if (!collaborators) {
      return new NextResponse("Project not found", { status: 404 });
    }

    return NextResponse.json({ collaborators });
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    console.error("Failed to list collaborators:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ projectId: string }> }
) {
  const identity = await getCurrentClerkIdentity();

  if (!identity) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { projectId } = await context.params;
  const body = await request.json().catch(() => ({}));
  const email = typeof body.email === "string" ? body.email : "";

  if (!email.trim()) {
    return new NextResponse("Email is required", { status: 400 });
  }

  try {
    const result = await inviteProjectCollaborator(
      projectId,
      identity.userId,
      email
    );

    if (result === null) {
      return new NextResponse("Project not found", { status: 404 });
    }

    if (result === "invalid-email") {
      return new NextResponse("Invalid email address", { status: 400 });
    }

    if (result === "duplicate") {
      return new NextResponse("Collaborator already invited", { status: 409 });
    }

    if (result === "self-invite") {
      return new NextResponse("You cannot invite yourself", { status: 400 });
    }

    return NextResponse.json({ collaborator: result }, { status: 201 });
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    console.error("Failed to invite collaborator:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
