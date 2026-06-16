import { NextResponse } from "next/server";

import { getCurrentUserId, getProjectsForUser, createProjectForUser } from "@/lib/projects";

export async function GET() {
  const userId = await getCurrentUserId();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const projectLists = await getProjectsForUser(userId);
  return NextResponse.json(projectLists);
}

export async function POST(request: Request) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const name = typeof body.name === "string" ? body.name : "Untitled Project";

  const project = await createProjectForUser(userId, name);
  return NextResponse.json(project, { status: 201 });
}
