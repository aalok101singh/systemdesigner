import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

import { getProjectById } from "@/lib/projects";
import { ProjectPageShell } from "@/components/editor/project-page-shell";

export default async function ProjectPage({ params }: Readonly<{ params: Promise<{ projectId: string }> }>) {
  const { userId } = await auth();

  if (!userId) {
    return notFound();
  }

  const resolvedParams = await params;
  const project = await getProjectById(resolvedParams.projectId);

  if (!project) {
    return notFound();
  }

  return <ProjectPageShell projectName={project.name} />;
}
