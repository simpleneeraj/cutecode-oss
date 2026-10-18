/**
 *
 * SWR-backed hooks for all share-link procedures.
 * Components must NEVER call `trpc` directly — always use these hooks.
 *
 * Cache key convention:
 *   ['share.list', snippetId?, presentationId?]
 *   ['share.preview', slug, passcode?]
 *   ['share.analytics', id]
 */

"use client";

import useSWR, { useSWRConfig } from "swr";
import { useSetAtom } from "jotai";
import { trpc } from "@/lib/trpc";
import { isForbiddenError } from "@/lib/trpc-error";
import { plansDialogOpenAtom } from "@/store/editor/plans";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/types";

type RouterOutput = inferRouterOutputs<AppRouter>;

export type ShareListOutput = RouterOutput["share"]["list"];
export type SharePreviewOutput = RouterOutput["share"]["preview"];
export type ShareAnalyticsOutput = RouterOutput["share"]["analytics"];
export type ShareCreateOutput = RouterOutput["share"]["create"];

// ─────────────────────────────────────────────
// useShareLinkList
// ─────────────────────────────────────────────

export function useShareList({
  snippetId,
  presentationId,
}: {
  snippetId?: string;
  presentationId?: string;
} = {}) {
  return useSWR(["share.list", snippetId ?? null, presentationId ?? null] as const, () =>
    trpc.share.list.query({ snippetId, presentationId }),
  );
}

// ─────────────────────────────────────────────
// useShareLinkPreview
// ─────────────────────────────────────────────

export function sharePreviewKey(slug: string, passcode?: string) {
  return ["share.preview", slug, passcode ?? null] as const;
}

export type SharePreviewKey = ReturnType<typeof sharePreviewKey>;

export function useSharePreview(slug: string | null, { passcode }: { passcode?: string } = {}) {
  return useSWR(
    slug ? sharePreviewKey(slug, passcode) : null,
    () => trpc.share.preview.mutate({ slug: slug!, passcode: passcode || undefined }),
    { dedupingInterval: 5_000 },
  );
}

type ShareLoadCallbacks = {
  onSuccess: (data: SharePreviewOutput) => void;
  onError: () => void;
};

export function useShareLoad(slug: string, { onSuccess, onError }: ShareLoadCallbacks) {
  return useSWR(["share.load", slug] as const, () => trpc.share.preview.mutate({ slug }), {
    onSuccess,
    onError,
    dedupingInterval: 0,
    revalidateOnMount: true,
    revalidateOnReconnect: false,
    shouldRetryOnError: false,
  });
}

// ─────────────────────────────────────────────
// useShareLinkAnalytics
// ─────────────────────────────────────────────

export function useShareAnalytics(id: string | null) {
  const setPlansOpen = useSetAtom(plansDialogOpenAtom);
  return useSWR(id ? (["share.analytics", id] as const) : null, () => trpc.share.analytics.query({ id: id! }), {
    onError: (error: unknown) => {
      if (isForbiddenError(error)) setPlansOpen(true);
    },
  });
}

// ─────────────────────────────────────────────
// useShareLinkMutations
// ─────────────────────────────────────────────

export type CreateShareInput = {
  snippetId?: string;
  presentationId?: string;
  visibility?: "PUBLIC" | "UNLISTED" | "PASSCODE" | "PRIVATE";
  passcode?: string;
  isE2EEncrypted?: boolean;
  encryptionHint?: string;
  maxViews?: number;
  expiresAt?: string;
  allowDownload?: boolean;
  allowCopy?: boolean;
};

export type UpdateShareInput = {
  visibility?: "PUBLIC" | "UNLISTED" | "PASSCODE" | "PRIVATE";
  passcode?: string;
  isE2EEncrypted?: boolean;
  encryptionHint?: string;
  maxViews?: number | null;
  expiresAt?: string | null;
  allowDownload?: boolean;
  allowCopy?: boolean;
};

export function useShareMutations() {
  const { mutate } = useSWRConfig();
  const setPlansOpen = useSetAtom(plansDialogOpenAtom);

  const openPlansOnForbidden = (error: unknown): never => {
    if (isForbiddenError(error)) setPlansOpen(true);
    throw error;
  };

  const createShare = async (input: CreateShareInput) => {
    const result = await trpc.share.create
      .mutate({
        ...input,
        visibility: input.visibility ?? "PUBLIC",
        isE2EEncrypted: input.isE2EEncrypted ?? false,
        allowDownload: input.allowDownload ?? true,
        allowCopy: input.allowCopy ?? true,
      })
      .catch(openPlansOnForbidden);
    await mutate((key) => Array.isArray(key) && key[0] === "share.list");
    return result;
  };

  const updateShare = async (id: string, data: UpdateShareInput) => {
    const result = await trpc.share.update.mutate({ id, data }).catch(openPlansOnForbidden);
    await mutate((key) => Array.isArray(key) && (key[0] === "share.list" || key[0] === "share.preview"));
    return result;
  };

  const deleteShare = async (id: string) => {
    const result = await trpc.share.delete.mutate({ id });
    await mutate((key) => Array.isArray(key) && key[0] === "share.list");
    return result;
  };

  return { createShare, updateShare, deleteShare };
}
