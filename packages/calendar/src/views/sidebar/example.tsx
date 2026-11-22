"use client";

import { useState } from "react";

import { CalendarAnnouncer } from "../../parts/live-region/announcer";
import { monthEvents } from "../../parts/month-grid/example-data";
import { exampleCalendars, exampleDate, exampleOptions } from "../../parts/time-grid/example-data";
import { ViewKind } from "../../types";
import { WeekView } from "../week";
import { CalendarSidebar } from "./index";
import { sidebarExampleStyles } from "./style";

const exampleViews = [ViewKind.Week];

const sharedCalendarIds = ["team"];

const styles = sidebarExampleStyles();

function ignoreOpen() {
  return undefined;
}

const exampleActions = { onEventOpen: ignoreOpen };

function ignoreView() {
  return undefined;
}

function SidebarExample() {
  const [date, setDate] = useState(exampleDate);
  const [hiddenCalendarIds, setHiddenCalendarIds] = useState<string[]>([]);
  const calendars = exampleCalendars.map((calendar) => ({
    ...calendar,
    visible: !hiddenCalendarIds.includes(calendar.id),
  }));
  const data = { events: monthEvents, calendars };
  const changeVisibility = (calendarId: string, visible: boolean) => {
    const others = hiddenCalendarIds.filter((id) => id !== calendarId);
    setHiddenCalendarIds(visible ? others : [...others, calendarId]);
  };
  const visibility = { onVisibilityChange: changeVisibility, otherCalendarIds: sharedCalendarIds };
  const navigation = {
    date,
    onDateChange: setDate,
    view: ViewKind.Week,
    onViewChange: ignoreView,
    views: exampleViews,
  };

  return (
    <CalendarAnnouncer>
      <div className={styles.root()}>
        <div className={styles.shell()}>
          <div className={styles.side()}>
            <CalendarSidebar
              data={data}
              navigation={navigation}
              onEventOpen={ignoreOpen}
              options={exampleOptions}
              visibility={visibility}
            />
          </div>
          <div className={styles.main()}>
            <WeekView actions={exampleActions} data={data} navigation={navigation} options={exampleOptions} />
          </div>
        </div>
      </div>
    </CalendarAnnouncer>
  );
}

export { SidebarExample };
