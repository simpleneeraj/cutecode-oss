"use client";

import { testZones } from "@cutecode/calendar/testing";

import { ExampleFrame } from "../../views/recurring/example-frame";
import { exampleOptions } from "../../views/recurring/example-data";
import { useExampleCalendar } from "../../views/recurring/use-example-calendar";
import { zoneColumnOf } from "./index";

const londonFallBack = "2026-10-24";

const zoneOptions = { ...exampleOptions, now: "2026-10-24T10:20", secondaryZone: zoneColumnOf(testZones.london) };

function ZoneColumnExample() {
  const example = useExampleCalendar(londonFallBack, zoneOptions);

  return <ExampleFrame example={example} />;
}

export { ZoneColumnExample };
