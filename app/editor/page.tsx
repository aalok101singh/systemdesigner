import { redirect } from "next/navigation";

import { EditorWorkspace } from "@/components/editor/editor-workspace";
import { SIGN_IN_URL } from "@/lib/auth-routes";
import { getCurrentUserId, getProjectsForUser } from "@/lib/projects";

export default async function EditorPage() {
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect(SIGN_IN_URL);
  }

  const { ownedProjects, sharedProjects } = await getProjectsForUser(userId);

  return (
    <EditorWorkspace
      ownedProjects={ownedProjects}
      sharedProjects={sharedProjects}
    />
  );
}
