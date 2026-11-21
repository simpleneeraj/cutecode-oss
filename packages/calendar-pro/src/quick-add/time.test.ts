import { beforeAll, describe, expect, it } from "vitest";
import { instantAt, makeSettings, testZones } from "@cutecode/calendar/testing";
import { HourCycle, QuickAddField, type QuickAddContext, type QuickAddParser } from "@cutecode/calendar/types";
import { loadQuickAddParser } from "./parse";

let parse: QuickAddParser;

beforeAll(async () => {
  parse = await loadQuickAddParser();
});

const wednesdayMorning: QuickAddContext = {
  now: instantAt("2026-10-28", "10:00"),
  settings: makeSettings(),
  calendarId: "work",
};

describe("quick add time zones", () => {
  it("places the repeated fall hour on its first pass in Los Angeles", () => {
    expect(parse("Dentist Nov 1 1:30am", wednesdayMorning).draft).toMatchObject({
      title: "Dentist",
      start: "2026-11-01T01:30:00-07:00",
      end: "2026-11-01T01:30:00-08:00",
      allDay: false,
    });
  });

  it("moves a time in the spring gap forward", () => {
    const context = { ...wednesdayMorning, now: instantAt("2026-03-01", "10:00") };
    expect(parse("Flight Mar 8 2:30am", context).draft?.start).toBe("2026-03-08T03:30:00-07:00");
  });

  it("builds the draft in the settings zone, not the host zone", () => {
    const tokyo = { ...wednesdayMorning, settings: makeSettings({ timeZone: testZones.tokyo }) };
    expect(parse("Call tomorrow 9am", tokyo).draft?.start).toBe("2026-10-30T09:00:00+09:00");
  });

  it("reads today from the settings zone near midnight", () => {
    const lateNight = { ...wednesdayMorning, now: instantAt("2026-11-18", "23:30") };
    expect(parse("Trip", lateNight).draft).toMatchObject({ start: "2026-11-18", end: "2026-11-19", allDay: true });
    expect(parse("Call tomorrow 1pm", lateNight).draft?.start).toBe("2026-11-19T13:00:00-08:00");
  });

  it("crosses midnight with a duration", () => {
    expect(parse("Launch today 23:30 for 2 hours", wednesdayMorning).draft).toMatchObject({
      start: "2026-10-28T23:30:00-07:00",
      end: "2026-10-29T01:30:00-07:00",
    });
  });

  it("uses a parsed end time and rolls it past midnight", () => {
    expect(parse("Meet Friday 10am-11:30am", wednesdayMorning).draft).toMatchObject({
      start: "2026-10-30T10:00:00-07:00",
      end: "2026-10-30T11:30:00-07:00",
    });
    expect(parse("Party Friday 10pm-1am", wednesdayMorning).draft?.end).toBe("2026-10-31T01:00:00-07:00");
  });

  it("rolls a parsed end into the fall back night by wall clock", () => {
    expect(parse("Party Oct 31 11pm-2am", wednesdayMorning).draft).toMatchObject({
      start: "2026-10-31T23:00:00-07:00",
      end: "2026-11-01T02:00:00-08:00",
    });
  });

  it("keeps a parsed end on the repeat start date", () => {
    expect(parse("Standup every Tuesday 9:30-10am", wednesdayMorning).draft).toMatchObject({
      start: "2026-11-03T09:30:00-08:00",
      end: "2026-11-03T10:00:00-08:00",
    });
  });
});

describe("quick add hour cycle", () => {
  const twentyFour = { ...wednesdayMorning, settings: makeSettings({ hourCycle: HourCycle.TwentyFour }) };

  it("reads 15:00 and puts it on today", () => {
    const result = parse("15:00 review", twentyFour);
    expect(result.draft).toMatchObject({
      title: "review",
      start: "2026-10-28T15:00:00-07:00",
      end: "2026-10-28T16:00:00-07:00",
    });
    expect(result.missing).toEqual([QuickAddField.Day]);
    expect(result.chips.find((chip) => chip.field === QuickAddField.Time)?.label).toBe("15:00");
  });

  it("labels the time in 12 hour settings", () => {
    const time = parse("15:00 review", wednesdayMorning).chips.find((chip) => chip.field === QuickAddField.Time);
    expect(time?.label).toBe("3 PM");
  });
});
