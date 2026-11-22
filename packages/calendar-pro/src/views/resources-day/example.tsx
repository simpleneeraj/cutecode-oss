"use client";

import { occurrenceElement } from "@cutecode/calendar/parts/quick-event/anchor";
import { useExampleEvents } from "@cutecode/calendar/parts/quick-event/example-events";
import { draftOf } from "@cutecode/calendar/parts/quick-event/session";
import { useQuickEvent } from "@cutecode/calendar/parts/quick-event/use-session";
import { CalendarAnnouncer } from "@cutecode/calendar/parts/live-region/announcer";
import { resolveSettings } from "@cutecode/calendar/locale";
import { QuickEvent, type NewEventSlot } from "@cutecode/calendar/quick-event";
import { ViewKind, type EventOccurrence } from "@cutecode/calendar/types";
import { ToastProvider } from "@cutecode/ui/components/toast";
import { useRef, useState } from "react";

import { ResourcesDayView } from "./index";
import { exampleCalendars, exampleDate, exampleEvents, exampleOptions, exampleResources } from "./example-data";

const exampleViews = [ViewKind.Day];

const exampleContext = { calendars: exampleCalendars, settings: resolveSettings(exampleOptions) };

function ResourcesDayExample() {
  const [date, setDate] = useState(exampleDate);
  const [bookedId, setBookedId] = useState<string | undefined>(undefined);
  const rootRef = useRef<HTMLDivElement>(null);
  const { events, actions, changeEvent, editing } = useExampleEvents(exampleEvents);
  const resourceIds = bookedId === undefined ? undefined : [bookedId];
  const quickEvent = useQuickEvent({ ...actions, onSave: (draft) => actions.onSave(draft.eventId === undefined ? { ...draft, resourceIds } : draft) });
  const props = {
    data: { events, calendars: exampleCalendars, resources: exampleResources },
    navigation: { date, onDateChange: setDate, view: ViewKind.Day, onViewChange: () => undefined, views: exampleViews },
    options: { ...exampleOptions, draft: draftOf(quickEvent.session.target) },
    actions: {
      onEventOpen: (occurrence: EventOccurrence) =>
        quickEvent.openEvent(occurrence, occurrenceElement(rootRef.current, occurrence.key)),
      onEventChange: changeEvent,
      onSlotCreate: (slot: NewEventSlot, anchor: HTMLElement | null) => {
        setBookedId(slot.resourceId);
        quickEvent.openNew(slot, anchor);
      },
      ...editing,
    },
  };

  return (
    <CalendarAnnouncer>
      <ToastProvider>
        <div ref={rootRef}>
          <ResourcesDayView {...props} />
        </div>
        <QuickEvent actions={quickEvent.actions} context={exampleContext} session={quickEvent.session} />
      </ToastProvider>
    </CalendarAnnouncer>
  );
}

export { ResourcesDayExample };
