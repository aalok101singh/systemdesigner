import { redirect } from "next/navigation";

import { AccessDenied } from "@/components/editor/access-denied";
import { WorkspaceShell } from "@/components/editor/workspace-shell";
import { SIGN_IN_URL } from "@/lib/auth-routes";
import {
  getAccessibleProject,
  getCurrentClerkIdentity,
} from "@/lib/project-access";
import { getProjectsForUser } from "@/lib/projects";

export default async function EditorRoomPage({
  params,
}: Readonly<{ params: Promise<{ roomId: string }> }>) {
  const identity = await getCurrentClerkIdentity();

  if (!identity) {
    redirect(SIGN_IN_URL);
  }

  const { roomId } = await params;
  const project = await getAccessibleProject(roomId, identity);

  if (!project) {
    return <AccessDenied />;
  }

  const { ownedProjects, sharedProjects } = await getProjectsForUser(
    identity.userId
  );

  return (
    <WorkspaceShell
      roomId={roomId}
      projectName={project.name}
      ownedProjects={ownedProjects}
      sharedProjects={sharedProjects}
    />
  );
}
