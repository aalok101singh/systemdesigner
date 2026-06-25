import Link from "next/link";
import { Lock } from "lucide-react";

import { Button } from "@/components/ui/button";

export function AccessDenied() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-base px-6 text-center text-copy-primary">
      <div className="flex max-w-md flex-col items-center rounded-3xl border border-surface-border bg-elevated p-8 shadow-2xl">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-surface-border bg-subtle">
          <Lock className="h-8 w-8 text-copy-muted" aria-hidden="true" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold text-copy-primary">
          Access denied
        </h1>
        <p className="mt-3 text-sm leading-6 text-copy-secondary">
          This project does not exist or you do not have permission to open it.
        </p>
        <div className="mt-6">
          <Button variant="outline" size="lg" asChild>
            <Link href="/editor">Back to editor</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
