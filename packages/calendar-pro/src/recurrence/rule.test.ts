import { describe, expect, it } from "vitest";
import { Frequency as RuleFrequency, RRule } from "rrule";
import { makeAllDayEvent, makeEvent, testZones } from "@cutecode/calendar/testing";
import { Frequency, Weekday } from "@cutecode/calendar/types";
import { canonicalStart, ruleOf, toRRuleOptions, wallClockOfFloating } from "./rule";

describe("toRRuleOptions", () => {
  it("maps the recurrence onto floating rrule options", () => {
    const event = makeEvent({
      recurrence: {
        frequency: Frequency.Monthly,
        interval: 2,
        byWeekday: [Weekday.Tuesday, Weekday.Thursday],
        byMonthDay: [1, -1],
        bySetPosition: 2,
        count: 6,
      },
    });
    expect(toRRuleOptions(event)).toEqual({
      freq: RuleFrequency.MONTHLY,
      dtstart: new Date(Date.UTC(2026, 10, 18, 10)),
      interval: 2,
      byweekday: [RRule.TU, RRule.TH],
      bymonthday: [1, -1],
      bysetpos: 2,
      count: 6,
      until: null,
      wkst: RRule.MO,
    });
  });

  it("keeps the wall clock of the event zone, not the host zone", () => {
    const event = makeEvent({
      start: "2026-11-18T09:00:00+05:45",
      end: "2026-11-18T10:00:00+05:45",
      timeZone: testZones.kathmandu,
      recurrence: { frequency: Frequency.Daily, interval: 1 },
    });
    expect(toRRuleOptions(event).dtstart).toEqual(new Date(Date.UTC(2026, 10, 18, 9)));
  });

  it("reads until in the event zone", () => {
    const event = makeEvent({ recurrence: { frequency: Frequency.Daily, interval: 1, until: "2026-11-20T18:30:00Z" } });
    expect(toRRuleOptions(event).until).toEqual(new Date(Date.UTC(2026, 10, 20, 10, 30)));
  });

  it("treats a plain until date as the whole day", () => {
    const event = makeAllDayEvent("2026-11-02", "2026-11-03", {
      recurrence: { frequency: Frequency.Weekly, interval: 1, until: "2026-11-30" },
    });
    expect(toRRuleOptions(event).until).toEqual(new Date(Date.UTC(2026, 10, 30, 23, 59, 59)));
  });

  it("pairs biweekly weekdays by the RFC Monday week start", () => {
    const event = makeEvent({
      start: "2026-11-01T09:00:00-08:00",
      end: "2026-11-01T09:30:00-08:00",
      recurrence: {
        frequency: Frequency.Weekly,
        interval: 2,
        byWeekday: [Weekday.Sunday, Weekday.Monday],
        count: 4,
      },
    });
    const dates = ruleOf(event)
      .all()
      .map((floating) => wallClockOfFloating(floating).date);
    expect(dates).toEqual(["2026-11-01", "2026-11-09", "2026-11-15", "2026-11-23"]);
  });

  it("pairs biweekly weekdays by a Sunday week start when the series asks for it", () => {
    const event = makeEvent({
      start: "2026-11-01T09:00:00-08:00",
      end: "2026-11-01T09:30:00-08:00",
      recurrence: {
        frequency: Frequency.Weekly,
        interval: 2,
        byWeekday: [Weekday.Sunday, Weekday.Monday],
        count: 4,
        weekStartsOn: Weekday.Sunday,
      },
    });
    const dates = ruleOf(event)
      .all()
      .map((floating) => wallClockOfFloating(floating).date);
    expect(dates).toEqual(["2026-11-01", "2026-11-02", "2026-11-15", "2026-11-16"]);
  });

  it("raises interval zero to one", () => {
    const event = makeEvent({ recurrence: { frequency: Frequency.Daily, interval: 0 } });
    expect(toRRuleOptions(event).interval).toBe(1);
  });

  it("refuses an event that does not repeat", () => {
    expect(() => toRRuleOptions(makeEvent())).toThrow(RangeError);
  });
});

describe("rule helpers", () => {
  it("reads floating dates by their UTC fields", () => {
    expect(wallClockOfFloating(new Date(Date.UTC(2026, 1, 28, 23, 45)))).toEqual({ date: "2026-02-28", minute: 1425 });
  });

  it("writes one spelling for the same occurrence start", () => {
    const series = makeEvent({ recurrence: { frequency: Frequency.Daily, interval: 1 } });
    expect(canonicalStart("2026-11-18T18:00:00Z", series)).toBe("2026-11-18T10:00:00-08:00");
    expect(canonicalStart("2026-11-18", makeAllDayEvent("2026-11-18", "2026-11-19"))).toBe("2026-11-18");
  });
});
