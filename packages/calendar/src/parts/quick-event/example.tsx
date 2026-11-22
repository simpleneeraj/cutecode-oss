"use client";

import { Button } from "@cutecode/ui/components/button";
import { AddIcon } from "@solar-icons/react/linear/add";
import { useRef, useState } from "react";

import { resolveSettings } from "../../locale";
import { instantAt } from "../../testing";
import { ViewKind } from "../../types";
import { WeekView } from "../../views/week";
import { CalendarAnnouncer } from "../live-region/announcer";
import { exampleCalendars, exampleDate, exampleEvents, exampleOptions } from "../time-grid/example-data";
import { occurrenceElement } from "./anchor";
import { useExampleEvents } from "./example-events";
import { QuickEvent } from "./index";
import { quickEventExampleStyles } from "./style";
import { useQuickEvent } from "./use-session";

const exampleSettings = resolveSettings(exampleOptions);

const exampleSlot = {
  start: instantAt("2026-11-19", "13:00"),
  end: instantAt("2026-11-19", "14:00"),
  allDay: false,
};

const exampleCopy = {
  newEvent: "New event",
};

const styles = quickEventExampleStyles();

function QuickEventExample() {
  const [date, setDate] = useState(exampleDate);
  const [view, setView] = useState<ViewKind>(ViewKind.Week);
  const rootRef = useRef<HTMLDivElement>(null);
  const { events, actions } = useExampleEvents(exampleEvents);
  const quickEvent = useQuickEvent(actions);
  const navigation = { date, onDateChange: setDate, view, onViewChange: setView, views: [ViewKind.Week] };

  return (
    <CalendarAnnouncer>
      <div ref={rootRef} className={styles.root()}>
        <Button
          className={styles.add()}
          onClick={(event) => quickEvent.openNew(exampleSlot, event.currentTarget)}
          variant="tinted"
        >
          <AddIcon aria-hidden="true" />
          {exampleCopy.newEvent}
        </Button>
        <WeekView
          data={{ events, calendars: exampleCalendars }}
          navigation={navigation}
          actions={{
            onEventOpen: (occurrence) => quickEvent.openEvent(occurrence, occurrenceElement(rootRef.current, occurrence.key)),
          }}
          options={exampleOptions}
        />
      </div>
      <QuickEvent
        actions={quickEvent.actions}
        context={{ calendars: exampleCalendars, settings: exampleSettings }}
        session={quickEvent.session}
      />
    </CalendarAnnouncer>
  );
}

export { QuickEventExample };
