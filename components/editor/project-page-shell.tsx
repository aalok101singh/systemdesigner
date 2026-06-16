"use client";

import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { EditorNavbar } from "@/components/editor/editor-navbar";

interface ProjectPageShellProps {
  projectName: string;
}

export function ProjectPageShell({ projectName }: ProjectPageShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-base text-copy-primary">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((isOpen) => !isOpen)}
      />
      <main className="relative grid min-h-0 flex-1 place-items-center bg-base px-6 py-8">
        <div className="max-w-2xl rounded-3xl border border-surface-border bg-elevated p-8 text-center shadow-2xl">
          <p className="text-sm uppercase tracking-[0.2em] text-copy-muted">
            Project workspace
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-copy-primary">
            {projectName}
          </h1>
          <p className="mt-3 text-sm leading-6 text-copy-secondary">
            This workspace is backed by your project record. The editor canvas will come in the next feature unit.
          </p>
          <div className="mt-6 flex justify-center">
            <Button variant="outline" size="lg" asChild>
              <Link href="/editor">
                Back to editor home
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
