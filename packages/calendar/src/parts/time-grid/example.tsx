"use client";

import { ToastProvider } from "@cutecode/ui/components/toast";
import { useRef, useState } from "react";

import { resolveSettings } from "../../locale";
import { DayView } from "../../views/day";
import { WeekView } from "../../views/week";
import { ViewKind, type EventOccurrence } from "../../types";
import { CalendarAnnouncer } from "../live-region/announcer";
import { QuickEvent } from "../quick-event";
import { occurrenceElement } from "../quick-event/anchor";
import { useExampleEvents } from "../quick-event/example-events";
import { draftOf } from "../quick-event/session";
import { useQuickEvent } from "../quick-event/use-session";
import { exampleCalendars, exampleDate, exampleEvents, exampleOptions } from "./example-data";
import type { GridKind } from "./use-time-grid-model";

type TimeGridExampleProps = {
  initialView: GridKind;
};

const exampleViews = [ViewKind.Day, ViewKind.Week];

const exampleContext = { calendars: exampleCalendars, settings: resolveSettings(exampleOptions) };

function TimeGridExample({ initialView }: TimeGridExampleProps) {
  const [date, setDate] = useState(exampleDate);
  const [view, setView] = useState<ViewKind>(initialView);
  const rootRef = useRef<HTMLDivElement>(null);
  const { events, actions, changeEvent, editing } = useExampleEvents(exampleEvents);
  const quickEvent = useQuickEvent(actions);
  const props = {
    data: { events, calendars: exampleCalendars },
    navigation: { date, onDateChange: setDate, view, onViewChange: setView, views: exampleViews },
    options: { ...exampleOptions, draft: draftOf(quickEvent.session.target) },
    actions: {
      onEventOpen: (occurrence: EventOccurrence) =>
        quickEvent.openEvent(occurrence, occurrenceElement(rootRef.current, occurrence.key)),
      onEventChange: changeEvent,
      onSlotCreate: quickEvent.openNew,
      ...editing,
    },
  };

  return (
    <CalendarAnnouncer>
      <ToastProvider>
        <div ref={rootRef}>{view === ViewKind.Day ? <DayView {...props} /> : <WeekView {...props} />}</div>
        <QuickEvent actions={quickEvent.actions} context={exampleContext} session={quickEvent.session} />
      </ToastProvider>
    </CalendarAnnouncer>
  );
}

export { TimeGridExample };
