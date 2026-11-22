"use client";

import { CalendarAnnouncer } from "@cutecode/calendar/parts/live-region/announcer";
import { ViewKind } from "@cutecode/calendar/types";
import { useState } from "react";

import { YearView } from "./index";
import { exampleCalendars, exampleDate, exampleEvents, exampleOptions } from "./example-data";

const exampleViews = [ViewKind.Day, ViewKind.Year];

function YearExample() {
  const [date, setDate] = useState(exampleDate);
  const [view, setView] = useState<ViewKind>(ViewKind.Year);
  const data = { events: exampleEvents, calendars: exampleCalendars };
  const navigation = { date, onDateChange: setDate, view, onViewChange: setView, views: exampleViews };

  return (
    <CalendarAnnouncer>
      <YearView data={data} navigation={navigation} options={exampleOptions} />
    </CalendarAnnouncer>
  );
}

export { YearExample };
