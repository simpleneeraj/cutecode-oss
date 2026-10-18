"use client";

import useSWR from "swr";
import { trpc } from "@/lib/trpc";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/types";

type RouterOutput = inferRouterOutputs<AppRouter>;

export type BillingStatusOutput = RouterOutput["billing"]["status"];

export function useBillingStatus(enabled = true) {
  return useSWR(enabled ? ["billing.status"] : null, () => trpc.billing.status.query(), {
    dedupingInterval: 60_000,
  });
}
