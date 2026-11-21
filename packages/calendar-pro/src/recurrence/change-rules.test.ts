import { describe, expect, it } from "vitest";
import { makeAllDayEvent } from "@cutecode/calendar/testing";
import { ChangeScope, Frequency, Weekday } from "@cutecode/calendar/types";
import { applyRecurringChange } from "./change";
import { allDayStarts, at, changeOf, expandBetween, now, occurrenceStarts, standupSeries } from "./change-fixtures";

describe("applyRecurringChange for All, rule edges", () => {
  it("returns the events unchanged for several month days moved across a month edge", () => {
    const events = [
      makeAllDayEvent("2026-01-01", "2026-01-02", {
        id: "rent",
        recurrence: { frequency: Frequency.Monthly, interval: 1, byMonthDay: [1, 15] },
      }),
    ];
    const change = changeOf({
      eventId: "rent",
      originalStart: "2026-02-01",
      start: "2026-01-31",
      end: "2026-02-01",
      allDay: true,
      scope: ChangeScope.All,
    });
    expect(applyRecurringChange(events, change, now)).toBe(events);
  });

  it.each([
    {
      name: "the day after the 2nd Tuesday in April is the 3rd Wednesday",
      byWeekday: [Weekday.Tuesday],
      bySetPosition: 2,
      originalStart: "2026-04-14",
      target: "2026-04-15",
      expectedWeekday: Weekday.Wednesday,
      expectedPosition: 3,
    },
    {
      name: "the day after the last Friday is the last Saturday",
      byWeekday: [Weekday.Friday],
      bySetPosition: -1,
      originalStart: "2026-04-24",
      target: "2026-04-25",
      expectedWeekday: Weekday.Saturday,
      expectedPosition: -1,
    },
    {
      name: "a move to a fifth weekday becomes the last one",
      byWeekday: [Weekday.Wednesday],
      bySetPosition: 4,
      originalStart: "2026-04-22",
      target: "2026-04-29",
      expectedWeekday: Weekday.Wednesday,
      expectedPosition: -1,
    },
  ])("recomputes bySetPosition from the target date for All: $name", (row) => {
    const series = standupSeries({
      start: at("2026-02-10", "09:00"),
      end: at("2026-02-10", "09:30"),
      recurrence: {
        frequency: Frequency.Monthly,
        interval: 1,
        byWeekday: row.byWeekday,
        bySetPosition: row.bySetPosition,
      },
    });
    const change = changeOf({
      scope: ChangeScope.All,
      originalStart: at(row.originalStart, "09:00"),
      start: at(row.target, "09:00"),
      end: at(row.target, "09:30"),
    });
    const events = applyRecurringChange([series], change, now);
    expect(events[0]?.recurrence).toMatchObject({
      byWeekday: [row.expectedWeekday],
      bySetPosition: row.expectedPosition,
    });
    const april = expandBetween(events, "2026-04-01", "2026-05-01").map((occurrence) => occurrence.originalStart);
    expect(april).toEqual([at(row.target, "09:00")]);
  });

  it("returns the events unchanged for a set position over several weekdays", () => {
    const events = [
      standupSeries({
        recurrence: {
          frequency: Frequency.Monthly,
          interval: 1,
          byWeekday: [Weekday.Monday, Weekday.Friday],
          bySetPosition: -1,
        },
      }),
    ];
    const change = changeOf({ scope: ChangeScope.All, start: at("2026-11-17", "09:00") });
    expect(applyRecurringChange(events, change, now)).toBe(events);
  });

  it("moves the weekday forward across midnight for All", () => {
    const series = standupSeries({
      start: at("2026-11-02", "23:30"),
      end: at("2026-11-03", "00:00"),
      recurrence: { frequency: Frequency.Weekly, interval: 1, byWeekday: [Weekday.Monday], count: 3 },
    });
    const change = changeOf({
      scope: ChangeScope.All,
      originalStart: at("2026-11-16", "23:30"),
      start: at("2026-11-17", "00:30"),
      end: at("2026-11-17", "01:00"),
    });
    const events = applyRecurringChange([series], change, now);
    expect(events[0]).toMatchObject({
      start: at("2026-11-03", "00:30"),
      end: at("2026-11-03", "01:00"),
      recurrence: { byWeekday: [Weekday.Tuesday] },
    });
    expect(occurrenceStarts(events)).toEqual([
      at("2026-11-03", "00:30"),
      at("2026-11-10", "00:30"),
      at("2026-11-17", "00:30"),
    ]);
  });

  it("turns a timed series all-day and back for All", () => {
    const series = standupSeries({
      recurrence: {
        frequency: Frequency.Weekly,
        interval: 1,
        byWeekday: [Weekday.Monday],
        count: 3,
        exceptionDates: [at("2026-11-09", "09:00")],
      },
    });
    const allDay = applyRecurringChange(
      [series],
      changeOf({ scope: ChangeScope.All, start: "2026-11-16", end: "2026-11-17", allDay: true }),
      now,
    );
    expect(allDay[0]).toMatchObject({
      start: "2026-11-02",
      end: "2026-11-03",
      allDay: true,
      recurrence: { exceptionDates: ["2026-11-09"] },
    });
    expect(allDayStarts(allDay, "2026-11-01", "2026-12-01")).toEqual(["2026-11-02", "2026-11-16"]);
    const timed = applyRecurringChange(
      allDay,
      changeOf({
        scope: ChangeScope.All,
        originalStart: "2026-11-16",
        start: at("2026-11-16", "14:00"),
        end: at("2026-11-16", "15:00"),
      }),
      now,
    );
    expect(timed[0]).toMatchObject({ start: at("2026-11-02", "14:00"), end: at("2026-11-02", "15:00"), allDay: false });
    expect(occurrenceStarts(timed)).toEqual([at("2026-11-02", "14:00"), at("2026-11-16", "14:00")]);
  });
});
