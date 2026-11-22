"use client";

import { ViewKind } from "../../types";
import { CalendarToolbar } from "../calendar-toolbar";
import { LiveRegion } from "../live-region";
import { CalendarError } from "../state/error";
import { CalendarStatusKind, conflictAskOf } from "../state/status";
import { StatusBanners } from "../state/status-banners";
import { SyncConflict } from "../state/sync-conflict";
import type { CalendarViewProps } from "../time-grid/props";
import { timeGridViewStyles } from "../time-grid/view-style";
import { ViewSwitch } from "../view-motion";
import { AgendaList } from "./index";
import { useAgendaView } from "./use-agenda-view";

type AgendaListViewProps = {
  calendar: CalendarViewProps;
};

const styles = timeGridViewStyles();

function AgendaListView({ calendar }: AgendaListViewProps) {
  const { heading, direction, navigation, message, list, source, status, isBusy } = useAgendaView(calendar);

  return (
    <div className={styles.root()} data-slot="agenda-view" dir={direction}>
      <CalendarToolbar
        heading={heading}
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
          viewKey={`${ViewKind.Agenda}|${list.anchor}`}
        >
          {status.kind === CalendarStatusKind.Failed ? (
            <CalendarError onRetry={status.onRetry} />
          ) : (
            <AgendaList isBusy={isBusy} list={list} source={source} />
          )}
        </ViewSwitch>
      </div>
      {message && <LiveRegion message={message} />}
      <SyncConflict ask={conflictAskOf(status)} settings={list.view.settings} />
    </div>
  );
}

export { AgendaListView };
