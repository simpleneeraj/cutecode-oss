"use client";

import useSWRMutation from "swr/mutation";
import { trpc } from "@/lib/trpc";
import type { BrandRequest } from "@/lib/brand-presets";

export function useBrandRequest() {
  return useSWRMutation("brand.request", (_key, { arg }: { arg: BrandRequest }) => trpc.brand.request.mutate(arg));
}
