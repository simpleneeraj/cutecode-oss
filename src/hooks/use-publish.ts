/**
 *
 * SWR-backed hook for the publish procedure.
 * Components must NEVER call `trpc` directly — always use this hook.
 */

"use client";

import useSWR, { useSWRConfig } from "swr";
import { trpc } from "@/lib/trpc";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/types";

type RouterOutput = inferRouterOutputs<AppRouter>;
export type PublishOutput = RouterOutput["publish"]["publish"];
export type PublishQuota = RouterOutput["publish"]["quota"];

const QUOTA_KEY = ["publish.quota"] as const;

export type PublishInput = {
  name?: string;
  width?: number;
  slides?: Record<string, unknown>;
  elements: Record<string, unknown>;
  slideElements?: Record<string, string[]>;
  elementId: string;
  title?: string;
  description?: string;
  tags?: string[];
  visibility?: "PUBLIC" | "UNLISTED" | "PASSCODE" | "PRIVATE";
  passcode?: string;
};

export function usePublish() {
  const { mutate } = useSWRConfig();

  const publish = async (input: PublishInput): Promise<PublishOutput> => {
    const result = await trpc.publish.publish.mutate({
      ...input,
      slides: input.slides ?? {},
      slideElements: input.slideElements ?? {},
      visibility: input.visibility ?? "PUBLIC",
    });

    // Revalidate snippet and presentation lists after a publish
    await Promise.all([
      mutate((key) => Array.isArray(key) && key[0] === "snippet.list"),
      mutate((key) => Array.isArray(key) && key[0] === "presentation.list"),
      mutate(QUOTA_KEY, result.quota, { revalidate: false }),
    ]);

    return result;
  };

  return { publish };
}

export function usePublishQuota(enabled: boolean) {
  return useSWR(enabled ? QUOTA_KEY : null, () => trpc.publish.quota.query());
}
