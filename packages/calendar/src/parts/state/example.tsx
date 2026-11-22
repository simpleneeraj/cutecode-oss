"use client";

import { ToggleGroup, ToggleGroupItem } from "@cutecode/ui/components/toggle-group";
import { useState } from "react";

import { makeEvent } from "../../testing";
import { ViewKind } from "../../types";
import { WeekView } from "../../views/week";
import { CalendarAnnouncer } from "../live-region/announcer";
import { exampleCalendars, exampleDate, exampleEvents, exampleOptions } from "../time-grid/example-data";
import { ReadOnlyHint } from "./read-only-hint";
import { CalendarStatusKind, type CalendarStatus } from "./status";
import { stateExampleStyles } from "./style";

const shownKinds = [CalendarStatusKind.Ready, CalendarStatusKind.Offline, CalendarStatusKind.Conflict];

const kindLabels: Record<CalendarStatusKind, string> = {
  [CalendarStatusKind.Ready]: "Ready",
  [CalendarStatusKind.Loading]: "Loading",
  [CalendarStatusKind.Failed]: "Failed",
  [CalendarStatusKind.Offline]: "Offline",
  [CalendarStatusKind.Conflict]: "Conflict",
};

const yours = makeEvent({
  id: "crit",
  title: "Design crit",
  start: "2026-11-19T11:00:00-08:00",
  end: "2026-11-19T12:00:00-08:00",
});

const theirs = { ...yours, start: "2026-11-19T14:00:00-08:00", end: "2026-11-19T15:00:00-08:00", version: 2 };

const exampleCopy = {
  status: "Status",
  readOnlyCalendar: "US holidays",
};

const styles = stateExampleStyles();

function ignoreOpen() {
  return undefined;
}

const exampleActions = { onEventOpen: ignoreOpen };

function isShownKind(value: unknown): value is CalendarStatusKind {
  return shownKinds.some((kind) => kind === value);
}

function statusFor(kind: CalendarStatusKind, onSettle: () => void): CalendarStatus {
  if (kind === CalendarStatusKind.Offline) {
    return { kind, pendingEventIds: [yours.id] };
  }
  if (kind === CalendarStatusKind.Conflict) {
    const ask = { conflict: { yours, theirs }, isSaving: false, onResolve: onSettle, onDismiss: onSettle };
    return { kind, ask };
  }
  return { kind: CalendarStatusKind.Ready };
}

function CalendarStatesExample() {
  const [date, setDate] = useState(exampleDate);
  const [view, setView] = useState<ViewKind>(ViewKind.Week);
  const [kind, setKind] = useState(CalendarStatusKind.Offline);
  const navigation = { date, onDateChange: setDate, view, onViewChange: setView, views: [ViewKind.Week] };
  const selectKind = (values: unknown[]) => {
    const [next] = values;
    if (isShownKind(next)) {
      setKind(next);
    }
  };

  return (
    <CalendarAnnouncer>
      <div className={styles.root()}>
        <div className={styles.controls()}>
          <ToggleGroup aria-label={exampleCopy.status} onValueChange={selectKind} value={[kind]}>
            {shownKinds.map((shown) => (
              <ToggleGroupItem key={shown} value={shown}>
                {kindLabels[shown]}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <ReadOnlyHint calendarName={exampleCopy.readOnlyCalendar} />
        </div>
        <WeekView
          data={{ events: exampleEvents, calendars: exampleCalendars }}
          navigation={navigation}
          actions={exampleActions}
          options={exampleOptions}
          status={statusFor(kind, () => setKind(CalendarStatusKind.Ready))}
        />
      </div>
    </CalendarAnnouncer>
  );
}

export { CalendarStatesExample };
