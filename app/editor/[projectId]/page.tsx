import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";

import { SIGN_IN_URL } from "@/lib/auth-routes";
import { getProjectById } from "@/lib/projects";
import { ProjectPageShell } from "@/components/editor/project-page-shell";

export default async function ProjectPage({ params }: Readonly<{ params: Promise<{ projectId: string }> }>) {
  const { userId } = await auth();

  if (!userId) {
    redirect(SIGN_IN_URL);
  }

  const resolvedParams = await params;
  const project = await getProjectById(resolvedParams.projectId, userId);

  if (!project) {
    return notFound();
  }

  return <ProjectPageShell projectName={project.name} />;
}
