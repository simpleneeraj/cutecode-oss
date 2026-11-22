"use client";

import { ViewKind } from "../../types";
import { CalendarToolbar } from "../calendar-toolbar";
import { DragProvider } from "../drag/provider";
import { LiveRegion } from "../live-region";
import { ViewOverlays } from "../shortcuts/view-overlays";
import { CalendarError } from "../state/error";
import { CalendarStatusKind } from "../state/status";
import { StatusBanners } from "../state/status-banners";
import { ViewSwitch } from "../view-motion";
import { TimeGrid } from "./index";
import type { CalendarViewProps } from "./props";
import type { GridKind } from "./use-time-grid-model";
import { useTimeGridView } from "./use-time-grid-view";
import { timeGridViewStyles } from "./view-style";

type TimeGridViewProps = {
  calendar: CalendarViewProps;
  kind: GridKind;
  dayCount?: number;
};

const timeGridCopy = {
  empty: {
    [ViewKind.Day]: "Nothing planned this day.",
    [ViewKind.Week]: "Nothing planned this week.",
  },
};

const styles = timeGridViewStyles();

function TimeGridView({ calendar, kind, dayCount }: TimeGridViewProps) {
  const { model, message, navigation, gridRef, keyboard, status, actions, drag, shortcuts, isEmpty } =
    useTimeGridView(calendar, kind, dayCount);

  return (
    <DragProvider value={drag}>
      <div className={styles.root()} data-slot="time-grid-view" dir={model.direction}>
        <CalendarToolbar
          heading={model.heading}
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
            viewKey={`${kind}|${model.range.dates.start}`}
          >
            {status.kind === CalendarStatusKind.Failed ? (
              <CalendarError onRetry={status.onRetry} />
            ) : (
              <TimeGrid
                actions={actions}
                gridRef={gridRef}
                isBusy={status.kind === CalendarStatusKind.Loading}
                keyboard={keyboard}
                model={model}
              />
            )}
          </ViewSwitch>
        </div>
        {isEmpty && <p className={styles.empty()}>{timeGridCopy.empty[kind]}</p>}
        {message && <LiveRegion message={message} />}
        <ViewOverlays settings={model.settings} shortcuts={shortcuts} status={status} />
      </div>
    </DragProvider>
  );
}

export { TimeGridView };
