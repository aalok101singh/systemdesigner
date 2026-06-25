"use client";

import { Check, Link2, Share2, Trash2, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ShareDialogController } from "@/hooks/use-share-dialog";
import { cn } from "@/lib/utils";

interface ShareDialogProps {
  controller: ShareDialogController;
  isOwner: boolean;
  projectName: string;
  projectId: string;
}

function CollaboratorAvatar({
  avatarUrl,
  displayName,
  email,
}: {
  avatarUrl: string | null;
  displayName: string | null;
  email: string;
}) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt=""
        className="h-9 w-9 rounded-full border border-surface-border object-cover"
      />
    );
  }

  const fallbackLabel = (displayName ?? email).charAt(0).toUpperCase();

  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-surface-border bg-subtle text-sm font-medium text-copy-secondary">
      {fallbackLabel}
    </div>
  );
}

export function ShareDialog({
  controller,
  isOwner,
  projectName,
  projectId,
}: ShareDialogProps) {
  const {
    collaborators,
    closeDialog,
    copyProjectLink,
    error,
    inviteEmail,
    isCopied,
    isInviting,
    isLoadingList,
    isOpen,
    removingId,
    removeCollaborator,
    setInviteEmail,
    submitInvite,
  } = controller;

  const canInvite = inviteEmail.trim().length > 0 && !isInviting;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeDialog()}>
      <DialogContent className="rounded-3xl border border-surface-border bg-elevated p-5 text-copy-primary shadow-2xl sm:max-w-md">
        <DialogHeader>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-dim text-brand">
            <Share2 className="h-5 w-5" />
          </div>
          <DialogTitle className="text-copy-primary">Share project</DialogTitle>
          <DialogDescription className="text-copy-secondary">
            {isOwner
              ? `Invite collaborators to ${projectName}.`
              : `People with access to ${projectName}.`}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          {isOwner ? (
            <form
              className="grid gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                void submitInvite();
              }}
            >
              <label
                className="text-xs font-medium uppercase text-copy-muted"
                htmlFor="invite-collaborator-email"
              >
                Invite by email
              </label>
              <div className="flex gap-2">
                <Input
                  id="invite-collaborator-email"
                  type="email"
                  autoComplete="email"
                  placeholder="collaborator@example.com"
                  value={inviteEmail}
                  disabled={isInviting}
                  className="text-copy-primary placeholder:text-copy-muted"
                  onChange={(event) => setInviteEmail(event.target.value)}
                />
                <Button type="submit" disabled={!canInvite}>
                  {isInviting ? "Inviting..." : "Invite"}
                </Button>
              </div>
            </form>
          ) : null}

          <div className="grid gap-2">
            <p className="text-xs font-medium uppercase text-copy-muted">
              Collaborators
            </p>
            <div className="rounded-2xl border border-surface-border bg-subtle/40">
              {isLoadingList ? (
                <div className="px-4 py-6 text-sm text-copy-muted">
                  Loading collaborators...
                </div>
              ) : collaborators.length === 0 ? (
                <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
                  <UserRound className="h-8 w-8 text-copy-faint" />
                  <p className="text-sm text-copy-muted">
                    No collaborators yet.
                  </p>
                </div>
              ) : (
                <ScrollArea className="max-h-56">
                  <ul className="divide-y divide-surface-border">
                    {collaborators.map((collaborator) => (
                      <li
                        key={collaborator.id}
                        className="flex items-center gap-3 px-4 py-3"
                      >
                        <CollaboratorAvatar
                          avatarUrl={collaborator.avatarUrl}
                          displayName={collaborator.displayName}
                          email={collaborator.email}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-copy-primary">
                            {collaborator.displayName ?? collaborator.email}
                          </p>
                          {collaborator.displayName ? (
                            <p className="truncate text-xs text-copy-muted">
                              {collaborator.email}
                            </p>
                          ) : null}
                        </div>
                        {isOwner ? (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Remove ${collaborator.email}`}
                            disabled={removingId === collaborator.id}
                            onClick={() =>
                              void removeCollaborator(collaborator.id)
                            }
                          >
                            <Trash2 className="h-4 w-4 text-copy-muted" />
                          </Button>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <p className="text-xs font-medium uppercase text-copy-muted">
              Project link
            </p>
            <div className="flex gap-2">
              <div className="min-w-0 flex-1 rounded-xl border border-surface-border bg-subtle px-3 py-2">
                <p className="truncate font-mono text-xs text-copy-secondary">
                  /editor/{projectId}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "shrink-0 text-copy-primary",
                  isCopied && "border-state-success/40 text-state-success"
                )}
                onClick={() => void copyProjectLink()}
              >
                {isCopied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Link2 className="h-4 w-4" />
                    Copy link
                  </>
                )}
              </Button>
            </div>
          </div>

          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
