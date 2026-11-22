import { describe, expect, it } from "vitest";

import { makeAllDayEvent, makeEvent, makeSettings } from "../../testing";
import { deskCopy, deskTitle, relativeDayLabel } from "./model";

const settings = makeSettings();
const timeZone = settings.timeZone;

describe("relativeDayLabel", () => {
  it("names today, tomorrow and later days", () => {
    expect(relativeDayLabel("2026-11-18", "2026-11-18", settings)).toBe("Today");
    expect(relativeDayLabel("2026-11-19", "2026-11-18", settings)).toBe("Tomorrow");
    expect(relativeDayLabel("2026-11-21", "2026-11-18", settings)).toBe("In 3 days");
  });

  it("falls back to the weekday before the clock is known", () => {
    expect(relativeDayLabel("2026-11-18", null, settings)).toBe("Wednesday");
  });
});

describe("deskTitle", () => {
  const events = [
    makeEvent({ id: "late", title: "Dinner", start: "2026-11-18T19:00:00-08:00", end: "2026-11-18T21:00:00-08:00" }),
    makeEvent({ id: "early", title: "Standup", start: "2026-11-18T09:00:00-08:00", end: "2026-11-18T09:15:00-08:00" }),
    makeAllDayEvent("2026-11-20", "2026-11-21", { title: "Ana's birthday" }),
  ];

  it("takes the first event of the day", () => {
    expect(deskTitle(events, "2026-11-18", timeZone)).toBe("Standup");
    expect(deskTitle(events, "2026-11-20", timeZone)).toBe("Ana's birthday");
  });

  it("names a day with nothing planned", () => {
    expect(deskTitle(events, "2026-11-22", timeZone)).toBe(deskCopy.freeDay);
  });
});
