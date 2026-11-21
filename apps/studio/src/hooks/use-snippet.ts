/**
 *
 * SWR-backed hooks for all snippet procedures.
 * Components must NEVER call `trpc` directly — always use these hooks.
 *
 * Cache key convention:
 *   ['snippet.list', page, limit]
 *   ['snippet.get', id]
 *   ['snippet.comments', snippetId, cursor?]
 */

"use client";

import useSWR, { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { trpc } from "@/lib/trpc";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/types";
import type { SharePreviewKey } from "@/hooks/use-share";

type RouterOutput = inferRouterOutputs<AppRouter>;

export type SnippetListOutput = RouterOutput["snippet"]["list"];
export type SnippetExploreOutput = RouterOutput["snippet"]["explore"];
export type SnippetGetOutput = RouterOutput["snippet"]["get"];
export type SnippetToggleUpvoteOutput = RouterOutput["snippet"]["toggleUpvote"];
export type SnippetToggleBookmarkOutput = RouterOutput["snippet"]["toggleBookmark"];
export type SnippetListCommentsOutput = RouterOutput["snippet"]["listComments"];
export type SnippetAddCommentOutput = RouterOutput["snippet"]["addComment"];

// ─────────────────────────────────────────────
// useSnippetList
// ─────────────────────────────────────────────

export function useSnippetList({ page = 1, limit = 20 }: { page?: number; limit?: number } = {}) {
  return useSWR(["snippet.list", page, limit] as const, () => trpc.snippet.list.query({ page, limit }));
}

// ─────────────────────────────────────────────
// useSnippetExplore
// ─────────────────────────────────────────────

export function useSnippetExplore({
  page = 1,
  limit = 24,
  sort = "recent" as "recent" | "popular",
  language,
  userId,
}: {
  page?: number;
  limit?: number;
  sort?: "recent" | "popular";
  language?: string;
  userId?: string;
} = {}) {
  return useSWR(
    ["snippet.explore", page, limit, sort, language, userId] as const,
    () => trpc.snippet.explore.query({ page, limit, sort, language, userId }),
  );
}

// ─────────────────────────────────────────────
// useSnippet (single)
// ─────────────────────────────────────────────

export function useSnippet(id: string | null) {
  return useSWR(id ? (["snippet.get", id] as const) : null, () => trpc.snippet.get.query({ id: id! }));
}

// ─────────────────────────────────────────────
// useSnippetComments
// ─────────────────────────────────────────────

export function useSnippetComments(snippetId: string | null, cursor?: string) {
  return useSWR(snippetId ? (["snippet.comments", snippetId, cursor ?? null] as const) : null, () =>
    trpc.snippet.listComments.query({ snippetId: snippetId!, cursor }),
  );
}

// ─────────────────────────────────────────────
// useSnippetMutations
// ─────────────────────────────────────────────

export function useSnippetMutations() {
  const { mutate } = useSWRConfig();

  const createSnippet = async (input: {
    presentationId: string;
    elementId: string;
    title?: string;
    isPublic?: boolean;
  }) => {
    const result = await trpc.snippet.create.mutate(input);
    await mutate((key) => Array.isArray(key) && key[0] === "snippet.list");
    return result;
  };

  const updateSnippet = async (id: string, data: { title?: string; isPublic?: boolean }) => {
    const result = await trpc.snippet.update.mutate({ id, data });
    await mutate(["snippet.get", id]);
    await mutate((key) => Array.isArray(key) && key[0] === "snippet.list");
    return result;
  };

  const deleteSnippet = async (id: string) => {
    const result = await trpc.snippet.delete.mutate({ id });
    await mutate((key) => Array.isArray(key) && key[0] === "snippet.list");
    return result;
  };

  const togglePin = async (id: string) => {
    const result = await trpc.snippet.togglePin.mutate({ id });
    await mutate((key) => Array.isArray(key) && (key[0] === "share.preview" || key[0] === "snippet.explore"));
    return result;
  };

  return { createSnippet, updateSnippet, deleteSnippet, togglePin };
}

export function useAddComment(snippetId: string | null) {
  return useSWRMutation(
    snippetId ? (["snippet.comments", snippetId, null] as const) : null,
    ([, id], { arg }: { arg: string }) => trpc.snippet.addComment.mutate({ snippetId: id, content: arg }),
  );
}

export function useSnippetReactions(previewKey: SharePreviewKey) {
  const upvote = useSWRMutation(previewKey, (_key, { arg }: { arg: string }) =>
    trpc.snippet.toggleUpvote.mutate({ snippetId: arg }),
  );
  const bookmark = useSWRMutation(previewKey, (_key, { arg }: { arg: string }) =>
    trpc.snippet.toggleBookmark.mutate({ snippetId: arg }),
  );
  return {
    toggleUpvote: upvote.trigger,
    toggleBookmark: bookmark.trigger,
    isMutating: upvote.isMutating || bookmark.isMutating,
  };
}
