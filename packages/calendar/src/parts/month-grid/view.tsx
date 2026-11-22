"use client";

import { ViewKind } from "../../types";
import { CalendarToolbar } from "../calendar-toolbar";
import { DragProvider } from "../drag/provider";
import { LiveRegion } from "../live-region";
import { CalendarSkeleton } from "../skeleton";
import { CalendarError } from "../state/error";
import { ViewOverlays } from "../shortcuts/view-overlays";
import { CalendarStatusKind } from "../state/status";
import { StatusBanners } from "../state/status-banners";
import type { CalendarViewProps } from "../time-grid/props";
import { timeGridViewStyles } from "../time-grid/view-style";
import { ViewSwitch } from "../view-motion";
import { MonthGrid } from "./index";
import { useMonthView, type MonthViewState } from "./use-month-view";

type MonthGridViewProps = {
  calendar: CalendarViewProps;
};

type MonthBodyProps = {
  view: MonthViewState;
};

const monthCopy = {
  empty: "Nothing planned this month.",
};

const styles = timeGridViewStyles();

function MonthBody({ view }: MonthBodyProps) {
  const { status, month, keyboard, actions, rowRef, gridRef } = view;
  if (status.kind === CalendarStatusKind.Failed) {
    return <CalendarError onRetry={status.onRetry} />;
  }
  if (status.kind === CalendarStatusKind.Loading) {
    return (
      <div aria-busy="true">
        <CalendarSkeleton view={ViewKind.Month} />
      </div>
    );
  }
  return <MonthGrid actions={actions} keyboard={keyboard} month={month} gridRef={gridRef} rowRef={rowRef} />;
}

function MonthGridView({ calendar }: MonthGridViewProps) {
  const view = useMonthView(calendar);
  const { month, navigation, message, isEmpty, status, drag, shortcuts } = view;

  return (
    <DragProvider value={drag}>
      <div className={styles.root()} data-slot="month-view" dir={month.direction}>
        <CalendarToolbar
          heading={month.heading}
          onViewChange={navigation.changeView}
          steps={navigation.steps}
          view={calendar.navigation.view}
          views={navigation.views}
        />
        <StatusBanners status={status} />
        <div className={styles.surface()}>
          <ViewSwitch
            kind={navigation.viewSwitch.kind}
            surfaceRef={navigation.viewSwitch.surfaceRef}
            viewKey={`${ViewKind.Month}|${month.anchor}`}
          >
            <MonthBody view={view} />
          </ViewSwitch>
        </div>
        {isEmpty && <p className={styles.empty()}>{monthCopy.empty}</p>}
        {message && <LiveRegion message={message} />}
        <ViewOverlays settings={month.settings} shortcuts={shortcuts} status={status} />
      </div>
    </DragProvider>
  );
}

export { MonthGridView };
