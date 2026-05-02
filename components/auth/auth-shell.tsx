import type { ReactNode } from "react";

interface AuthShellProps {
  children: ReactNode;
}

const featureRows = [
  {
    title: "AI system mapping",
    description: "Turn a plain-English idea into structured architecture pieces.",
  },
  {
    title: "Shared canvas thinking",
    description: "Refine nodes, flows, and boundaries with collaborators in place.",
  },
  {
    title: "Spec-ready output",
    description: "Carry the finished graph forward as a technical specification.",
  },
];

export function AuthShell({ children }: AuthShellProps) {
  return (
    <main className="grid min-h-dvh bg-base text-copy-primary lg:grid-cols-[minmax(27rem,0.92fr)_minmax(30rem,1.08fr)]">
      <section className="hidden border-r border-surface-border bg-surface lg:flex lg:min-h-dvh lg:flex-col lg:justify-between lg:px-11 lg:py-9 xl:px-14">
        <div className="flex items-center gap-3" aria-label="Ghost AI">
          <div className="grid h-8 w-8 place-items-center rounded-xl border border-brand/30 bg-accent-dim font-mono text-sm font-semibold text-brand shadow-[0_0_24px_var(--accent-primary-dim)]">
            G
          </div>
          <p className="text-sm font-semibold text-copy-primary">Ghost AI</p>
        </div>

        <div className="max-w-lg">
          <p className="font-mono text-xs uppercase tracking-normal text-brand">
            Architecture workspace
          </p>
          <h1 className="mt-5 max-w-md text-4xl font-semibold leading-tight text-copy-primary">
            Make system design feel clear before the first diagram is done.
          </h1>
          <p className="mt-5 max-w-md text-sm leading-6 text-copy-muted">
            Draft the architecture, shape it with your team, and keep the
            decisions connected to the final engineering spec.
          </p>

          <ul className="mt-10 space-y-6">
            {featureRows.map(({ description, title }) => (
              <li key={title} className="flex gap-4">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand shadow-[0_0_14px_var(--accent-primary)]">
                  <span className="sr-only">Capability</span>
                </span>
                <span>
                  <span className="block text-sm font-medium text-copy-primary">
                    {title}
                  </span>
                  <span className="mt-1 block max-w-md text-xs leading-5 text-copy-muted">
                    {description}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex max-w-md items-center justify-between border-t border-surface-border pt-5 font-mono text-xs text-copy-faint">
          <span>Prompt</span>
          <span className="mx-3 h-px flex-1 bg-surface-border-subtle" />
          <span>Canvas</span>
          <span className="mx-3 h-px flex-1 bg-surface-border-subtle" />
          <span>Spec</span>
        </div>
      </section>

      <section className="flex min-h-dvh items-center justify-center bg-base px-4 py-8 sm:px-6 lg:px-10">
        <div className="w-full max-w-[25rem]">
          <div className="mb-6 hidden items-center justify-center gap-3 lg:flex">
            <span className="h-px w-12 bg-surface-border-subtle" />
            <span className="font-mono text-xs uppercase tracking-normal text-copy-faint">
              Secure workspace access
            </span>
            <span className="h-px w-12 bg-surface-border-subtle" />
          </div>
          {children}
        </div>
      </section>
    </main>
  );
}
