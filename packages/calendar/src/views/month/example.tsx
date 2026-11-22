"use client";

import { ToastProvider } from "@cutecode/ui/components/toast";
import { useState } from "react";

import { CalendarAnnouncer } from "../../parts/live-region/announcer";
import { monthEvents } from "../../parts/month-grid/example-data";
import { useExampleEvents } from "../../parts/quick-event/example-events";
import { exampleCalendars, exampleDate, exampleOptions } from "../../parts/time-grid/example-data";
import { ViewKind } from "../../types";
import { DayView } from "../day";
import { MonthView } from "./index";

const exampleViews = [ViewKind.Day, ViewKind.Month];

function ignoreOpen() {
  return undefined;
}

function MonthExample() {
  const [date, setDate] = useState(exampleDate);
  const [view, setView] = useState<ViewKind>(ViewKind.Month);
  const { events, changeEvent, editing } = useExampleEvents(monthEvents);
  const props = {
    data: { events, calendars: exampleCalendars },
    navigation: { date, onDateChange: setDate, view, onViewChange: setView, views: exampleViews },
    options: exampleOptions,
    actions: { onEventOpen: ignoreOpen, onEventChange: changeEvent, ...editing },
  };

  return (
    <CalendarAnnouncer>
      <ToastProvider>{view === ViewKind.Day ? <DayView {...props} /> : <MonthView {...props} />}</ToastProvider>
    </CalendarAnnouncer>
  );
}

export { MonthExample };
