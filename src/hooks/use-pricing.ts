"use client";

import useSWR from "swr";
import { trpc } from "@/lib/trpc";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/types";

type RouterOutput = inferRouterOutputs<AppRouter>;
export type PricingResult = RouterOutput["billing"]["pricing"];

export function usePricing() {
  return useSWR(["billing.pricing"], () => trpc.billing.pricing.query(), {
    revalidateOnFocus: false,
    dedupingInterval: 5 * 60 * 1000,
  });
}
