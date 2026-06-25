import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { getCursorColorForUser } from "@/lib/cursor-color";
import { getLiveblocks } from "@/lib/liveblocks";
import {
  getAccessibleProject,
  getCurrentClerkIdentity,
} from "@/lib/project-access";

export async function POST(request: Request) {
  const identity = await getCurrentClerkIdentity();

  if (!identity) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const room = typeof body.room === "string" ? body.room.trim() : "";

  if (!room) {
    return new NextResponse("Room ID is required", { status: 400 });
  }

  const project = await getAccessibleProject(room, identity);

  if (!project) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const liveblocks = getLiveblocks();

  try {
    await liveblocks.getOrCreateRoom(room, {
      defaultAccesses: [],
    });
  } catch (error) {
    console.error("Failed to ensure Liveblocks room exists:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }

  const user = await currentUser();
  const name =
    user?.fullName ??
    user?.username ??
    user?.primaryEmailAddress?.emailAddress ??
    "Anonymous";
  const avatar = user?.imageUrl ?? "";
  const cursorColor = getCursorColorForUser(identity.userId);

  const session = liveblocks.prepareSession(identity.userId, {
    userInfo: {
      name,
      avatar,
      cursorColor,
    },
  });

  session.allow(room, session.FULL_ACCESS);

  const { status, body: responseBody } = await session.authorize();
  return new Response(responseBody, { status });
}
