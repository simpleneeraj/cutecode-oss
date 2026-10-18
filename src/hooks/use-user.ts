/**
 *
 * SWR-backed hooks for all user/social procedures.
 * Components must NEVER call `trpc` directly — always use these hooks.
 *
 * Cache key convention:
 *   ['user.profile', userId, ip?]
 *   ['user.followers', userId, cursor?]
 *   ['user.following', userId, cursor?]
 */

"use client";

import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import useSWRMutation from "swr/mutation";
import { trpc } from "@/lib/trpc";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/types";

type RouterOutput = inferRouterOutputs<AppRouter>;

export type UserProfileOutput = RouterOutput["user"]["profile"];
export type UserFollowersOutput = RouterOutput["user"]["followers"];
export type UserFollowingOutput = RouterOutput["user"]["following"];
export type UserToggleFollowOutput = RouterOutput["user"]["toggleFollow"];

// ─────────────────────────────────────────────
// useUserProfile
// ─────────────────────────────────────────────

export function useUserProfile(userId: string | null | undefined) {
  return useSWR(userId ? (["user.profile", userId] as const) : null, () =>
    trpc.user.profile.query({ userId: userId! }),
  );
}

// ─────────────────────────────────────────────
// useUserFollowers / useUserFollowing
// ─────────────────────────────────────────────

type ConnectionsScope = "user.followers" | "user.following";

function connectionsKeyLoader(scope: ConnectionsScope, userId: string) {
  return (_index: number, previousPage: UserFollowersOutput | null) => {
    if (previousPage && !previousPage.nextCursor) return null;
    return [scope, userId, previousPage?.nextCursor ?? null] as const;
  };
}

export function useUserFollowers(userId: string) {
  return useSWRInfinite(
    connectionsKeyLoader("user.followers", userId),
    ([, id, cursor]) => trpc.user.followers.query({ userId: id, cursor: cursor ?? undefined }),
    { revalidateFirstPage: false },
  );
}

export function useUserFollowing(userId: string) {
  return useSWRInfinite(
    connectionsKeyLoader("user.following", userId),
    ([, id, cursor]) => trpc.user.following.query({ userId: id, cursor: cursor ?? undefined }),
    { revalidateFirstPage: false },
  );
}

// ─────────────────────────────────────────────
// useToggleFollow
// ─────────────────────────────────────────────

type ProfileKey = readonly ["user.profile", string];
type ProfileCache = UserProfileOutput | undefined;

function flipFollow(profile?: ProfileCache): ProfileCache {
  if (!profile) return profile;
  const followers = profile._count.followers + (profile.isFollowing ? -1 : 1);
  return { ...profile, isFollowing: !profile.isFollowing, _count: { ...profile._count, followers } };
}

function applyFollowResult(result: UserToggleFollowOutput, profile?: ProfileCache): ProfileCache {
  if (!profile) return profile;
  return {
    ...profile,
    isFollowing: result.following,
    _count: { ...profile._count, followers: result.followerCount },
  };
}

export function useToggleFollow(targetUserId: string) {
  return useSWRMutation<UserToggleFollowOutput, Error, ProfileKey, never, ProfileCache>(
    ["user.profile", targetUserId],
    () => trpc.user.toggleFollow.mutate({ targetUserId }),
    { optimisticData: flipFollow, populateCache: applyFollowResult, rollbackOnError: true },
  );
}
