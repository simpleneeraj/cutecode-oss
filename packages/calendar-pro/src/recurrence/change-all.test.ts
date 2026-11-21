import { describe, expect, it } from "vitest";
import { addDays } from "@cutecode/calendar/time";
import { makeAllDayEvent, makeEvent } from "@cutecode/calendar/testing";
import { ChangeScope, Frequency, Weekday } from "@cutecode/calendar/types";
import { applyRecurringChange } from "./change";
import { allDayStarts, at, changeOf, now, occurrenceStarts, standupSeries } from "./change-fixtures";

describe("applyRecurringChange for All", () => {
  it("shifts the whole series by the wall-clock delta for All, across the fall DST change", () => {
    const series = standupSeries({
      start: at("2026-10-19", "09:00"),
      end: at("2026-10-19", "09:30"),
      recurrence: {
        frequency: Frequency.Weekly,
        interval: 1,
        byWeekday: [Weekday.Monday],
        exceptionDates: [at("2026-11-23", "09:00")],
      },
    });
    const exception = makeEvent({
      id: "late",
      seriesId: "standup",
      originalStart: at("2026-11-30", "09:00"),
      start: at("2026-11-30", "12:00"),
      end: at("2026-11-30", "12:30"),
    });
    const events = applyRecurringChange([series, exception], changeOf({ scope: ChangeScope.All }), now);
    expect(events[0]).toMatchObject({
      start: at("2026-10-19", "10:00"),
      end: at("2026-10-19", "10:30"),
      version: 2,
      recurrence: { exceptionDates: [at("2026-11-23", "10:00")] },
    });
    expect(events[1]).toMatchObject({
      originalStart: at("2026-11-30", "10:00"),
      start: at("2026-11-30", "12:00"),
      version: 2,
    });
    expect(occurrenceStarts(events).slice(0, 5)).toEqual([
      at("2026-10-19", "10:00"),
      at("2026-10-26", "10:00"),
      at("2026-11-02", "10:00"),
      at("2026-11-09", "10:00"),
      at("2026-11-16", "10:00"),
    ]);
  });

  it("moves the weekday of a weekly series dragged to another day for All", () => {
    const events = applyRecurringChange(
      [standupSeries()],
      changeOf({ scope: ChangeScope.All, start: at("2026-11-17", "09:00"), end: at("2026-11-17", "09:30") }),
      now,
    );
    expect(events[0]).toMatchObject({ start: at("2026-11-03", "09:00"), recurrence: { byWeekday: [Weekday.Tuesday] } });
  });

  it("shifts an all-day series for All", () => {
    const trash = makeAllDayEvent("2026-11-02", "2026-11-03", {
      id: "trash",
      recurrence: { frequency: Frequency.Monthly, interval: 1, byMonthDay: [2], exceptionDates: ["2026-12-02"] },
    });
    const events = applyRecurringChange(
      [trash],
      changeOf({
        eventId: "trash",
        originalStart: "2026-11-02",
        start: "2026-11-04",
        end: "2026-11-05",
        allDay: true,
        scope: ChangeScope.All,
      }),
      now,
    );
    expect(events[0]).toMatchObject({
      start: "2026-11-04",
      end: "2026-11-05",
      recurrence: { byMonthDay: [4], exceptionDates: ["2026-12-04"] },
    });
  });

  it.each([
    {
      name: "a weekly series moved a day later keeps its last occurrence",
      recurrence: { frequency: Frequency.Weekly, interval: 1, byWeekday: [Weekday.Monday], until: "2026-11-30" },
      start: at("2026-11-17", "09:00"),
      expected: ["2026-11-03", "2026-11-10", "2026-11-17", "2026-11-24", "2026-12-01"],
    },
    {
      name: "a timed until moves with the series",
      recurrence: {
        frequency: Frequency.Weekly,
        interval: 1,
        byWeekday: [Weekday.Monday],
        until: at("2026-11-30", "09:00"),
      },
      start: at("2026-11-16", "10:00"),
      expected: ["2026-11-02", "2026-11-09", "2026-11-16", "2026-11-23", "2026-11-30"],
    },
    {
      name: "a daily series moved a day earlier gains none past the end",
      recurrence: { frequency: Frequency.Daily, interval: 1, until: "2026-11-05" },
      start: at("2026-11-15", "09:00"),
      expected: ["2026-11-01", "2026-11-02", "2026-11-03", "2026-11-04"],
    },
  ])("shifts until for All: $name", ({ recurrence, start, expected }) => {
    const events = applyRecurringChange(
      [standupSeries({ recurrence })],
      changeOf({ scope: ChangeScope.All, start }),
      now,
    );
    expect(occurrenceStarts(events).map((value) => value.slice(0, 10))).toEqual(expected);
  });

  it("keeps a plain until date a plain date", () => {
    const recurrence = { frequency: Frequency.Weekly, interval: 1, byWeekday: [Weekday.Monday], until: "2026-11-30" };
    const events = applyRecurringChange(
      [standupSeries({ recurrence })],
      changeOf({ scope: ChangeScope.All, start: at("2026-11-17", "09:00") }),
      now,
    );
    expect(events[0]?.recurrence?.until).toBe("2026-12-01");
  });

  it.each([
    {
      name: "the 31st moved to the 1st",
      start: "2026-01-31",
      byMonthDay: [31],
      originalStart: "2026-03-31",
      target: "2026-04-01",
      expectedDays: [1],
      expected: ["2026-02-01", "2026-03-01", "2026-04-01", "2026-05-01"],
    },
    {
      name: "the 1st moved to the last day",
      start: "2026-01-01",
      byMonthDay: [1],
      originalStart: "2026-02-01",
      target: "2026-01-31",
      expectedDays: [-1],
      expected: ["2025-12-31", "2026-01-31", "2026-02-28", "2026-03-31"],
    },
    {
      name: "the last day moved a day earlier",
      start: "2026-01-31",
      byMonthDay: [-1],
      originalStart: "2026-03-31",
      target: "2026-03-30",
      expectedDays: [-2],
      expected: ["2026-01-30", "2026-02-27", "2026-03-30", "2026-04-29"],
    },
    {
      name: "two month days inside one month",
      start: "2026-01-01",
      byMonthDay: [1, 15],
      originalStart: "2026-01-15",
      target: "2026-01-16",
      expectedDays: [2, 16],
      expected: ["2026-01-02", "2026-01-16", "2026-02-02", "2026-02-16"],
    },
  ])("rewrites byMonthDay across month edges for All: $name", (row) => {
    const series = makeAllDayEvent(row.start, addDays(row.start, 1), {
      id: "rent",
      recurrence: { frequency: Frequency.Monthly, interval: 1, byMonthDay: row.byMonthDay, count: 4 },
    });
    const change = changeOf({
      eventId: "rent",
      originalStart: row.originalStart,
      start: row.target,
      end: addDays(row.target, 1),
      allDay: true,
      scope: ChangeScope.All,
    });
    const events = applyRecurringChange([series], change, now);
    expect(events[0]?.recurrence?.byMonthDay).toEqual(row.expectedDays);
    expect(allDayStarts(events, "2025-12-01", "2026-06-01")).toEqual(row.expected);
  });
});
