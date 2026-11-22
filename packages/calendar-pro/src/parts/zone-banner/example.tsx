"use client";

import { TabletView } from "@cutecode/calendar/tablet";
import { CalendarAnnouncer } from "@cutecode/calendar/parts/live-region/announcer";
import { QuickEvent } from "@cutecode/calendar/quick-event";
import { testZones } from "@cutecode/calendar/testing";
import { ToastProvider } from "@cutecode/ui/components/toast";
import { useState } from "react";

import { exampleDate, exampleNow, exampleOptions } from "../../views/recurring/example-data";
import { useExampleCalendar } from "../../views/recurring/use-example-calendar";
import { renderRepeatField } from "../repeat-field";
import { zoneColumnOf } from "../zone-column";
import { ZoneBanner } from "./index";

const calendarZone = "Pacific/Auckland";

function ZoneBannerExample() {
  const [timeZone, setTimeZone] = useState(calendarZone);
  const options = { ...exampleOptions, timeZone, secondaryZone: zoneColumnOf(testZones.losAngeles) };
  const { calendar, quickEvent, rootRef, context } = useExampleCalendar(exampleDate, options);
  const banner = <ZoneBanner now={exampleNow} onTimeZoneChange={setTimeZone} timeZone={timeZone} />;

  return (
    <CalendarAnnouncer>
      <ToastProvider>
        <div ref={rootRef}>
          <TabletView calendar={calendar} sidebar={null} timeZoneBanner={banner} />
        </div>
        <QuickEvent
          actions={quickEvent.actions}
          context={context}
          repeat={renderRepeatField}
          session={quickEvent.session}
        />
      </ToastProvider>
    </CalendarAnnouncer>
  );
}

export { ZoneBannerExample };
