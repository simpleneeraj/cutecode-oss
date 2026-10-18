"use client";

import useSWR from "swr";
import { useSetAtom } from "jotai";
import { trpc } from "@/lib/trpc";
import { isForbiddenError } from "@/lib/trpc-error";
import { plansDialogOpenAtom } from "@/store/editor/plans";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/types";

type RouterOutput = inferRouterOutputs<AppRouter>;

export type DashboardSummaryOutput = RouterOutput["dashboard"]["summary"];

export function useDashboard() {
  const setPlansOpen = useSetAtom(plansDialogOpenAtom);
  return useSWR(["dashboard.summary"], () => trpc.dashboard.summary.query(), {
    dedupingInterval: 30_000,
    onError: (error: unknown) => {
      if (isForbiddenError(error)) setPlansOpen(true);
    },
  });
}

export function useDashboardViews() {
  return useSWR(["dashboard.viewsByDay"], () => trpc.dashboard.viewsByDay.query(), {
    dedupingInterval: 30_000,
  });
}
