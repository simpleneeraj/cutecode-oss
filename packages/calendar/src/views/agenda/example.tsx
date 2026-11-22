"use client";

import { useState } from "react";

import { CalendarAnnouncer } from "../../parts/live-region/announcer";
import { monthEvents } from "../../parts/month-grid/example-data";
import { exampleCalendars, exampleDate, exampleOptions } from "../../parts/time-grid/example-data";
import { ViewKind } from "../../types";
import { AgendaView } from "./index";

const exampleData = { events: monthEvents, calendars: exampleCalendars };

const exampleViews = [ViewKind.Agenda];

function ignoreOpen() {
  return undefined;
}

const exampleActions = { onEventOpen: ignoreOpen };

function ignoreView() {
  return undefined;
}

function AgendaExample() {
  const [date, setDate] = useState(exampleDate);
  const navigation = { date, onDateChange: setDate, view: ViewKind.Agenda, onViewChange: ignoreView, views: exampleViews };

  return (
    <CalendarAnnouncer>
      <AgendaView actions={exampleActions} data={exampleData} navigation={navigation} options={exampleOptions} />
    </CalendarAnnouncer>
  );
}

export { AgendaExample };
