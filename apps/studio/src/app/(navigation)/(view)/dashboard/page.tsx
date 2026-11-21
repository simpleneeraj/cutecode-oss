"use client";

import Link from "next/link";
import { useSetAtom } from "jotai";
import { resetEditorAtom } from "@/store/editor/editor";
import { useDashboard } from "@/hooks/use-dashboard";
import { useSubscription } from "@/hooks/use-subscription";
import { Button } from "@cutecode/ui/components/button";
import { AddSquareIcon } from "@solar-icons/react/linear/add-square";
import { StatCards } from "./components/stat-cards";
import { SnippetsTable } from "./components/snippets-table";
import { AccountCard } from "./components/account-card";
import { DashboardEmptyState } from "./components/empty-state";
import { LockedAnalytics } from "./components/locked-analytics";
import { ViewsChart } from "./components/views-chart";
import { DashboardSkeleton } from "./components/dashboard-skeleton";

export default function DashboardPage() {
  const { data, isLoading } = useDashboard();
  const { can } = useSubscription();
  const resetEditor = useSetAtom(resetEditorAtom);

  if (isLoading || !data) return <DashboardSkeleton />;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-6 md:py-10">
      <div className="flex items-end justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back{data.userName ? `, ${data.userName}` : ""}</p>
        </div>
        <Button onClick={resetEditor} render={<Link href="/" />}>
          <AddSquareIcon className="size-4" aria-hidden="true" />
          New snippet
        </Button>
      </div>

      <StatCards totals={data.totals} />

      {can("fullAnalytics") ? <ViewsChart /> : <LockedAnalytics />}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {data.rows.length === 0 ? <DashboardEmptyState /> : <SnippetsTable snippets={data.rows} />}
        </div>
        <AccountCard
          plan={data.plan}
          renewsAt={data.renewsAt}
          cancelAtPeriodEnd={data.cancelAtPeriodEnd}
          totalSnippets={data.totalSnippets}
          quota={data.quota}
        />
      </div>
    </div>
  );
}
