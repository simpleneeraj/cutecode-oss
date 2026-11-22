"use client";

import { ToastProvider } from "@cutecode/ui/components/toast";
import { useRef, useState } from "react";

import { resolveSettings } from "../../locale";
import { CalendarAnnouncer } from "../../parts/live-region/announcer";
import { occurrenceElement } from "../../parts/quick-event/anchor";
import { useExampleEvents } from "../../parts/quick-event/example-events";
import { QuickEvent } from "../../parts/quick-event";
import { draftOf } from "../../parts/quick-event/session";
import { useQuickEvent } from "../../parts/quick-event/use-session";
import { exampleCalendars, exampleDate, exampleEvents, exampleOptions } from "../../parts/time-grid/example-data";
import { toneStyles } from "../../parts/tone/style";
import { ViewKind, type EventOccurrence } from "../../types";
import { TabletView } from "./index";
import { tabletExampleStyles } from "./style";

const exampleSettings = resolveSettings(exampleOptions);

const tabletViews = [ViewKind.Day, ViewKind.Week];

const styles = tabletExampleStyles();

function ExampleSidebar() {
  return (
    <ul className={styles.calendars()}>
      {exampleCalendars.map((calendar) => (
        <li key={calendar.id} className={styles.calendar()}>
          <span aria-hidden="true" className={styles.tick({ class: toneStyles({ tone: calendar.tone }).bar() })} />
          {calendar.name}
        </li>
      ))}
    </ul>
  );
}

function TabletExample() {
  const [date, setDate] = useState(exampleDate);
  const [view, setView] = useState<ViewKind>(ViewKind.Week);
  const rootRef = useRef<HTMLDivElement>(null);
  const { events, actions, changeEvent, editing } = useExampleEvents(exampleEvents);
  const quickEvent = useQuickEvent(actions);
  const calendar = {
    data: { events, calendars: exampleCalendars },
    navigation: { date, onDateChange: setDate, view, onViewChange: setView, views: tabletViews },
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
        <div ref={rootRef}>
          <TabletView calendar={calendar} sidebar={<ExampleSidebar />} />
        </div>
        <QuickEvent
          actions={quickEvent.actions}
          context={{ calendars: exampleCalendars, settings: exampleSettings }}
          session={quickEvent.session}
        />
      </ToastProvider>
    </CalendarAnnouncer>
  );
}

export { TabletExample };
