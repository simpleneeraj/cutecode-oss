"use client";

import type { CalendarViewProps, TimeGridOptions } from "@cutecode/calendar/week";
import { resolveSettings } from "@cutecode/calendar/locale";
import { occurrenceElement } from "@cutecode/calendar/parts/quick-event/anchor";
import { savedEvents, useExampleEvents, type SaveApplier } from "@cutecode/calendar/parts/quick-event/example-events";
import { draftOf } from "@cutecode/calendar/parts/quick-event/session";
import { useQuickEvent } from "@cutecode/calendar/parts/quick-event/use-session";
import { ViewKind, type EventOccurrence, type PlainDate } from "@cutecode/calendar/types";
import { useRef, useState } from "react";

import { applyRecurringChange, applyRecurringSave, expandRecurrences } from "../../recurrence";
import { exampleCalendars, exampleEvents } from "./example-data";

const exampleViews = [ViewKind.Day, ViewKind.Week];

const saveRecurring: SaveApplier = (events, draft) => {
  const { eventId } = draft;
  return eventId === undefined ? savedEvents(events, draft) : applyRecurringSave(events, { ...draft, eventId }, Date.now());
};

export function useExampleCalendar(initialDate: PlainDate, options: TimeGridOptions) {
  const [date, setDate] = useState(initialDate);
  const [view, setView] = useState<ViewKind>(ViewKind.Week);
  const rootRef = useRef<HTMLDivElement>(null);
  const { events, actions, changeEvent, editing } = useExampleEvents(exampleEvents, applyRecurringChange, saveRecurring);
  const quickEvent = useQuickEvent(actions);
  const calendar: CalendarViewProps = {
    data: { events, calendars: exampleCalendars, expand: expandRecurrences },
    navigation: { date, onDateChange: setDate, view, onViewChange: setView, views: exampleViews },
    options: { ...options, draft: draftOf(quickEvent.session.target) },
    actions: {
      onEventOpen: (occurrence: EventOccurrence) =>
        quickEvent.openEvent(occurrence, occurrenceElement(rootRef.current, occurrence.key)),
      onEventChange: changeEvent,
      onSlotCreate: quickEvent.openNew,
      ...editing,
    },
  };
  const context = { calendars: exampleCalendars, settings: resolveSettings(options) };
  return { calendar, quickEvent, rootRef, context, onSave: actions.onSave };
}

export type ExampleCalendar = ReturnType<typeof useExampleCalendar>;
