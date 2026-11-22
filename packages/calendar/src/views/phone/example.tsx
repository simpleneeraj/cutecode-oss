"use client";

import { useState } from "react";

import { CalendarAnnouncer } from "../../parts/live-region/announcer";
import { useExampleEvents } from "../../parts/quick-event/example-events";
import { exampleCalendars, exampleDate, exampleEvents, exampleOptions } from "../../parts/time-grid/example-data";
import { ViewKind } from "../../types";
import { PhoneView } from "./index";

const phoneViews = [ViewKind.Day, ViewKind.Week, ViewKind.Month, ViewKind.Agenda];

function PhoneExample() {
  const [date, setDate] = useState(exampleDate);
  const [view, setView] = useState<ViewKind>(ViewKind.Day);
  const { events, actions, changeEvent } = useExampleEvents(exampleEvents);
  const navigation = { date, onDateChange: setDate, view, onViewChange: setView, views: phoneViews };

  return (
    <CalendarAnnouncer>
      <PhoneView
        data={{ events, calendars: exampleCalendars }}
        features={{ actions, onEventChange: changeEvent }}
        navigation={navigation}
        options={exampleOptions}
      />
    </CalendarAnnouncer>
  );
}

export { PhoneExample };
