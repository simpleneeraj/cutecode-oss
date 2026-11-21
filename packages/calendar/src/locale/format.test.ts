import { describe, expect, it } from "vitest";
import { instantAt, makeSettings, testZones } from "../testing";
import { HourCycle, Weekday } from "../types";
import {
  dateTimeFormat,
  formatClock,
  formatDayLabel,
  formatPlainDate,
  formatTime,
  formatTimeRange,
  formatZoneName,
} from "./format";

const unitedStates = makeSettings();
const britain = makeSettings({
  locale: "en-GB",
  timeZone: testZones.london,
  weekStartsOn: Weekday.Monday,
  hourCycle: HourCycle.TwentyFour,
});
const germany = makeSettings({
  locale: "de-DE",
  timeZone: testZones.berlin,
  weekStartsOn: Weekday.Monday,
  hourCycle: HourCycle.TwentyFour,
});
const separator = /\s*[–-]\s*/;

describe("dateTimeFormat", () => {
  it("returns the same instance for the same locale and options", () => {
    const options = { hour: "numeric", timeZone: testZones.tokyo } satisfies Intl.DateTimeFormatOptions;
    expect(dateTimeFormat("en-US", options)).toBe(dateTimeFormat("en-US", { ...options }));
  });

  it("keeps zones apart", () => {
    const tokyo = dateTimeFormat("en-US", { hour: "numeric", timeZone: testZones.tokyo });
    const london = dateTimeFormat("en-US", { hour: "numeric", timeZone: testZones.london });
    expect(tokyo).not.toBe(london);
  });
});

describe("formatTime", () => {
  it("drops minutes on the hour in 12 hour time", () => {
    expect(formatTime(instantAt("2026-11-18", "10:00"), unitedStates)).toBe("10 AM");
  });

  it("shows minutes when they are not zero", () => {
    expect(formatTime(instantAt("2026-11-18", "12:45"), unitedStates)).toBe("12:45 PM");
  });

  it("always shows minutes in 24 hour time", () => {
    expect(formatTime(instantAt("2026-11-18", "09:00", testZones.london), britain)).toBe("09:00");
    expect(formatTime(instantAt("2026-11-18", "14:30", testZones.berlin), germany)).toBe("14:30");
  });

  it("shows midnight as 00:00 in 24 hour time and 12 AM in 12 hour time", () => {
    expect(formatTime(instantAt("2026-11-18", "00:00", testZones.london), britain)).toBe("00:00");
    expect(formatTime(instantAt("2026-11-18", "00:00"), unitedStates)).toBe("12 AM");
  });

  it("lets the hour cycle override the locale", () => {
    const twentyFour = makeSettings({ hourCycle: HourCycle.TwentyFour });
    expect(formatTime(instantAt("2026-11-18", "15:00"), twentyFour)).toBe("15:00");
    const twelve = { ...britain, hourCycle: HourCycle.Twelve };
    expect(formatTime(instantAt("2026-11-18", "15:00", testZones.london), twelve)).toMatch(/^3\spm$/i);
  });

  it("uses the view zone, not the host zone", () => {
    const instant = instantAt("2026-11-18", "10:00");
    expect(formatTime(instant, makeSettings({ timeZone: testZones.kathmandu }))).toBe("11:45 PM");
  });
});

describe("formatTimeRange", () => {
  it("joins a 12 hour range", () => {
    const range = formatTimeRange(instantAt("2026-11-19", "11:00"), instantAt("2026-11-19", "12:00"), unitedStates);
    expect(range.split(separator)).toEqual(["11 AM", "12 PM"]);
  });

  it("shows minutes on both ends when one end has them", () => {
    const range = formatTimeRange(instantAt("2026-11-19", "11:00"), instantAt("2026-11-19", "12:45"), unitedStates);
    expect(range.split(separator)).toEqual(["11:00 AM", "12:45 PM"]);
  });

  it("joins a 24 hour range the way the locale writes it", () => {
    const start = instantAt("2026-11-19", "09:00", testZones.berlin);
    const end = instantAt("2026-11-19", "17:30", testZones.berlin);
    expect(formatTimeRange(start, end, germany)).toBe("09:00\u201317:30 Uhr");
  });
});

describe("formatTimeRange across midnight", () => {
  it("shows only times when a range crosses midnight", () => {
    const range = formatTimeRange(instantAt("2026-11-18", "22:00"), instantAt("2026-11-19", "01:30"), unitedStates);
    expect(range.split(separator)).toEqual(["10:00 PM", "1:30 AM"]);
  });

  it("shows only times when a range ends exactly at midnight", () => {
    const range = formatTimeRange(instantAt("2026-11-18", "22:00"), instantAt("2026-11-19", "00:00"), unitedStates);
    expect(range.split(separator)).toEqual(["10 PM", "12 AM"]);
  });

  it("shows only times across midnight in German", () => {
    const start = instantAt("2026-11-18", "22:00", testZones.berlin);
    const crossing = formatTimeRange(start, instantAt("2026-11-19", "01:30", testZones.berlin), germany);
    const toMidnight = formatTimeRange(start, instantAt("2026-11-19", "00:00", testZones.berlin), germany);
    expect(crossing.split(separator)).toEqual(["22:00", "01:30"]);
    expect(toMidnight.split(separator)).toEqual(["22:00", "00:00"]);
  });
});

describe("formatTime minutes", () => {
  it("detects minutes from the zone offset in half and quarter hour zones", () => {
    const instant = instantAt("2026-11-18", "10:00");
    expect(formatTime(instant, makeSettings({ timeZone: testZones.kolkata }))).toBe("11:30 PM");
    expect(formatTime(instant, makeSettings({ timeZone: testZones.stJohns }))).toBe("2:30 PM");
  });

  it("drops minutes on the hour before 1970", () => {
    expect(formatTime(Date.UTC(1969, 6, 20, 20), makeSettings({ timeZone: testZones.utc }))).toBe("8 PM");
  });
});

describe("formatClock", () => {
  it("formats wall clock times without a zone", () => {
    expect(formatClock("07:00", unitedStates)).toBe("7 AM");
    expect(formatClock("18:30", unitedStates)).toBe("6:30 PM");
    expect(formatClock("07:00", britain)).toBe("07:00");
  });
});

describe("formatDayLabel", () => {
  it("names the weekday, month and day", () => {
    expect(formatDayLabel("2026-11-18", unitedStates)).toBe("Wednesday, November 18");
    expect(formatDayLabel("2026-11-18", britain)).toBe("Wednesday 18 November");
    expect(formatDayLabel("2026-11-18", germany)).toBe("Mittwoch, 18. November");
  });

  it("does not shift the date in a far zone or the host zone", () => {
    expect(formatDayLabel("2026-01-01", makeSettings({ timeZone: testZones.chatham }))).toBe("Thursday, January 1");
    expect(formatDayLabel("2026-12-31", makeSettings({ timeZone: testZones.losAngeles }))).toBe(
      "Thursday, December 31",
    );
  });

  it("uses locale digits", () => {
    const egypt = makeSettings({ locale: "ar-EG", timeZone: "Africa/Cairo" });
    expect(formatPlainDate("2026-11-18", egypt, { day: "numeric" })).toBe("١٨");
  });
});

describe("formatZoneName", () => {
  it("shows PDT then PST for the two 1 AM hours on the fall day", () => {
    const firstOneAm = Date.UTC(2026, 10, 1, 8);
    const secondOneAm = Date.UTC(2026, 10, 1, 9);
    expect(formatTime(firstOneAm, unitedStates)).toBe("1 AM");
    expect(formatTime(secondOneAm, unitedStates)).toBe("1 AM");
    expect(formatZoneName(firstOneAm, unitedStates)).toBe("PDT");
    expect(formatZoneName(secondOneAm, unitedStates)).toBe("PST");
  });

  it("names British summer and winter time", () => {
    expect(formatZoneName(Date.UTC(2026, 6, 1), britain)).toBe("BST");
    expect(formatZoneName(Date.UTC(2026, 11, 1), britain)).toBe("GMT");
  });

  it("gives an offset name for zones without a short name", () => {
    expect(formatZoneName(Date.UTC(2026, 6, 1), makeSettings({ timeZone: testZones.kathmandu }))).toBe("GMT+5:45");
  });
});
