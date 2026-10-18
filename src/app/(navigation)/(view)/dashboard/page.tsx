"use client";

import { useDashboard } from "@/hooks/use-dashboard";
import { StatCards } from "./components/stat-cards";
import { SnippetsTable } from "./components/snippets-table";
import { AccountCard } from "./components/account-card";
import { DashboardEmptyState } from "./components/empty-state";
import { LockedAnalytics } from "./components/locked-analytics";
import { useSubscription } from "@/hooks/use-subscription";
import { Spinner } from "@/components/ui/spinner";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const { data, isLoading } = useDashboard();
  const { can } = useSubscription();

  if (isLoading || !data) {
    return (
      <div className="mx-auto flex w-full max-w-6xl items-center justify-center px-4 py-20 md:px-6">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-10">
      <div className="mb-8 flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back{data.userName ? `, ${data.userName}` : ""}. Here is how your snippets are performing.
        </p>
      </div>

      <StatCards totals={data.totals} totalSnippets={data.totalSnippets} />

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          {data.rows.length === 0 ? <DashboardEmptyState /> : <SnippetsTable snippets={data.rows} />}
          {!can("fullAnalytics") && <LockedAnalytics />}
        </div>
        <AccountCard
          plan={data.plan}
          renewsAt={data.renewsAt}
          cancelAtPeriodEnd={data.cancelAtPeriodEnd}
          totalSnippets={data.totalSnippets}
        />
      </div>
    </div>
  );
}
