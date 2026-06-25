"use client";

import { useCallback, useEffect, useState } from "react";

export interface CollaboratorItem {
  id: string;
  email: string;
  createdAt: string;
  displayName: string | null;
  avatarUrl: string | null;
}

async function fetchJson<T>(url: string, init?: RequestInit) {
  const response = await fetch(url, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers as Record<string, string>),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      errorText || `Request failed with status ${response.status}`
    );
  }

  const contentType = response.headers.get("content-type");

  if (response.status === 204 || !contentType?.includes("application/json")) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function useShareDialog(projectId: string) {
  const [isOpen, setIsOpen] = useState(false);
  const [collaborators, setCollaborators] = useState<CollaboratorItem[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const loadCollaborators = useCallback(async () => {
    setIsLoadingList(true);
    setError(null);

    try {
      const data = await fetchJson<{ collaborators: CollaboratorItem[] }>(
        `/api/projects/${projectId}/collaborators`
      );
      setCollaborators(data.collaborators);
    } catch (loadError) {
      console.error("Failed to load collaborators:", loadError);
      setError("Failed to load collaborators. Please try again.");
    } finally {
      setIsLoadingList(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (isOpen) {
      void loadCollaborators();
    }
  }, [isOpen, loadCollaborators]);

  useEffect(() => {
    if (!isCopied) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsCopied(false);
    }, 2000);

    return () => window.clearTimeout(timeoutId);
  }, [isCopied]);

  function openDialog() {
    setInviteEmail("");
    setError(null);
    setIsOpen(true);
  }

  function closeDialog() {
    if (isInviting || removingId) {
      return;
    }

    setIsOpen(false);
    setInviteEmail("");
    setError(null);
  }

  async function submitInvite() {
    const trimmedEmail = inviteEmail.trim();

    if (!trimmedEmail) {
      return;
    }

    setIsInviting(true);
    setError(null);

    try {
      const data = await fetchJson<{ collaborator: CollaboratorItem }>(
        `/api/projects/${projectId}/collaborators`,
        {
          method: "POST",
          body: JSON.stringify({ email: trimmedEmail }),
        }
      );

      setCollaborators((currentCollaborators) => {
        const alreadyListed = currentCollaborators.some(
          (collaborator) => collaborator.id === data.collaborator.id
        );

        if (alreadyListed) {
          return currentCollaborators;
        }

        return [...currentCollaborators, data.collaborator];
      });
      setInviteEmail("");
    } catch (inviteError) {
      console.error("Failed to invite collaborator:", inviteError);
      setError(
        inviteError instanceof Error
          ? inviteError.message
          : "Failed to invite collaborator. Please try again."
      );
    } finally {
      setIsInviting(false);
    }
  }

  async function removeCollaborator(collaboratorId: string) {
    setRemovingId(collaboratorId);
    setError(null);

    try {
      await fetchJson<void>(
        `/api/projects/${projectId}/collaborators/${collaboratorId}`,
        {
          method: "DELETE",
        }
      );

      setCollaborators((currentCollaborators) =>
        currentCollaborators.filter(
          (collaborator) => collaborator.id !== collaboratorId
        )
      );
    } catch (removeError) {
      console.error("Failed to remove collaborator:", removeError);
      setError("Failed to remove collaborator. Please try again.");
    } finally {
      setRemovingId(null);
    }
  }

  async function copyProjectLink() {
    const projectUrl = `${window.location.origin}/editor/${projectId}`;

    try {
      await navigator.clipboard.writeText(projectUrl);
      setIsCopied(true);
    } catch (copyError) {
      console.error("Failed to copy project link:", copyError);
      setError("Failed to copy link. Please copy it manually.");
    }
  }

  return {
    collaborators,
    closeDialog,
    copyProjectLink,
    error,
    inviteEmail,
    isCopied,
    isInviting,
    isLoadingList,
    isOpen,
    openDialog,
    removingId,
    removeCollaborator,
    setInviteEmail,
    submitInvite,
  };
}

export type ShareDialogController = ReturnType<typeof useShareDialog>;
