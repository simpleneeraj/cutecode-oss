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
import { dashboardStyles } from "./components/style";

const styles = dashboardStyles();

export default function DashboardPage() {
  const { data, isLoading } = useDashboard();
  const { can } = useSubscription();
  const resetEditor = useSetAtom(resetEditorAtom);

  const isPending = isLoading || !data;
  if (isPending) {
    return <DashboardSkeleton />;
  }
  return (
    <div className={styles.root()}>
      <div className={styles.header()}>
        <div className={styles.heading()}>
          <h1 className={styles.title()}>Dashboard</h1>
          <p className={styles.subtitle()}>Welcome back{data.userName ? `, ${data.userName}` : ""}</p>
        </div>
        <Button className={styles.action()} onClick={resetEditor} render={<Link href="/" />}>
          <AddSquareIcon className={styles.icon()} aria-hidden="true" />
          New snippet
        </Button>
      </div>

      <StatCards totals={data.totals} />

      {can("fullAnalytics") ? <ViewsChart /> : <LockedAnalytics />}

      <div className={styles.columns()}>
        <div className={styles.main()}>
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
