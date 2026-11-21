import { describe, expect, it } from "vitest";
import { formatDateTime } from "@cutecode/calendar/time";
import { makeAllDayEvent, makeEvent, testZones } from "@cutecode/calendar/testing";
import { ChangeScope, Frequency, OccurrenceKind, Weekday } from "@cutecode/calendar/types";
import { applyRecurringChange } from "./change";
import {
  allDayStarts,
  at,
  byId,
  expandBetween,
  changeOf,
  now,
  occurrenceStarts,
  stampedAt,
  standupSeries,
} from "./change-fixtures";

describe("applyRecurringChange for Following", () => {
  it("splits the series for Following", () => {
    const series = standupSeries({
      recurrence: {
        frequency: Frequency.Weekly,
        interval: 1,
        byWeekday: [Weekday.Monday],
        count: 10,
        exceptionDates: [at("2026-11-09", "09:00"), at("2026-11-30", "09:00")],
      },
    });
    const earlier = makeEvent({
      id: "early",
      seriesId: "standup",
      originalStart: at("2026-11-02", "09:00"),
      start: at("2026-11-02", "08:00"),
      end: at("2026-11-02", "08:30"),
    });
    const later = makeEvent({
      id: "late",
      seriesId: "standup",
      originalStart: at("2026-11-23", "09:00"),
      start: at("2026-11-23", "12:00"),
      end: at("2026-11-23", "12:30"),
    });
    const events = applyRecurringChange([series, earlier, later], changeOf({ scope: ChangeScope.Following }), now);
    const followingId = `standup/${at("2026-11-16", "09:00")}`;
    expect(events.map((event) => event.id)).toEqual(["standup", followingId, "early", "late"]);
    expect(byId(events, "standup")).toMatchObject({
      version: 2,
      updatedAt: stampedAt,
      recurrence: { count: undefined, until: at("2026-11-09", "09:00"), exceptionDates: [at("2026-11-09", "09:00")] },
    });
    expect(byId(events, followingId)).toMatchObject({
      start: at("2026-11-16", "10:00"),
      end: at("2026-11-16", "10:30"),
      version: 1,
      recurrence: { count: 8, exceptionDates: [at("2026-11-30", "10:00")] },
    });
    expect(byId(events, "early")).toBe(earlier);
    expect(byId(events, "late")).toMatchObject({
      seriesId: followingId,
      originalStart: at("2026-11-23", "10:00"),
      version: 2,
    });
    expect(occurrenceStarts(events)).toEqual([
      at("2026-11-02", "08:00"),
      at("2026-11-16", "10:00"),
      at("2026-11-23", "12:00"),
      at("2026-12-07", "10:00"),
      at("2026-12-14", "10:00"),
      at("2026-12-21", "10:00"),
      at("2026-12-28", "10:00"),
      at("2027-01-04", "10:00"),
    ]);
  });

  it("drops the exception at the split occurrence for Following", () => {
    const series = standupSeries();
    const atSplit = makeEvent({
      id: "split",
      seriesId: "standup",
      originalStart: at("2026-11-16", "09:00"),
      start: at("2026-11-16", "12:00"),
      end: at("2026-11-16", "12:30"),
    });
    const events = applyRecurringChange([series, atSplit], changeOf({ scope: ChangeScope.Following }), now);
    expect(byId(events, "split")).toBeUndefined();
  });

  it("behaves as All for Following on the first occurrence", () => {
    const events = applyRecurringChange(
      [standupSeries()],
      changeOf({
        scope: ChangeScope.Following,
        originalStart: at("2026-11-02", "09:00"),
        start: at("2026-11-02", "10:00"),
        end: at("2026-11-02", "10:30"),
      }),
      now,
    );
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      id: "standup",
      start: at("2026-11-02", "10:00"),
      version: 2,
      recurrence: { count: 10 },
    });
  });

  it("ends an all-day series the day before for Following", () => {
    const trash = makeAllDayEvent("2026-11-02", "2026-11-03", {
      id: "trash",
      recurrence: { frequency: Frequency.Weekly, interval: 1, byWeekday: [Weekday.Monday] },
    });
    const events = applyRecurringChange(
      [trash],
      changeOf({
        eventId: "trash",
        originalStart: "2026-11-16",
        start: "2026-11-16",
        end: "2026-11-18",
        allDay: true,
        scope: ChangeScope.Following,
      }),
      now,
    );
    expect(events[0]?.recurrence?.until).toBe("2026-11-15");
    expect(events[1]).toMatchObject({ id: "trash/2026-11-16", start: "2026-11-16", end: "2026-11-18", allDay: true });
  });

  it.each([
    {
      name: "moving later keeps the last occurrence",
      start: at("2026-11-17", "09:00"),
      end: at("2026-11-17", "09:30"),
      expected: [
        at("2026-11-02", "09:00"),
        at("2026-11-09", "09:00"),
        at("2026-11-17", "09:00"),
        at("2026-11-24", "09:00"),
        at("2026-12-01", "09:00"),
      ],
    },
    {
      name: "moving earlier adds none past the end",
      start: at("2026-11-15", "09:00"),
      end: at("2026-11-15", "09:30"),
      expected: [
        at("2026-11-02", "09:00"),
        at("2026-11-09", "09:00"),
        at("2026-11-15", "09:00"),
        at("2026-11-22", "09:00"),
        at("2026-11-29", "09:00"),
      ],
    },
  ])("shifts until with the series for Following: $name", ({ start, end, expected }) => {
    const series = standupSeries({
      recurrence: { frequency: Frequency.Weekly, interval: 1, byWeekday: [Weekday.Monday], until: "2026-11-30" },
    });
    const events = applyRecurringChange([series], changeOf({ scope: ChangeScope.Following, start, end }), now);
    expect(occurrenceStarts(events)).toEqual(expected);
  });

  it("returns the events unchanged when the edit is past the count", () => {
    const events = [standupSeries({ recurrence: { frequency: Frequency.Weekly, interval: 1, count: 2 } })];
    const change = changeOf({ scope: ChangeScope.Following, start: at("2026-11-16", "10:00") });
    expect(applyRecurringChange(events, change, now)).toBe(events);
  });

  it("keeps one occurrence when Following edits the last one of the count", () => {
    const events = [standupSeries({ recurrence: { frequency: Frequency.Weekly, interval: 1, count: 3 } })];
    const result = applyRecurringChange(events, changeOf({ scope: ChangeScope.Following }), now);
    expect(result[1]?.recurrence?.count).toBe(1);
    expect(occurrenceStarts(result)).toEqual([
      at("2026-11-02", "09:00"),
      at("2026-11-09", "09:00"),
      at("2026-11-16", "10:00"),
    ]);
  });

  it("moves the weekday back across midnight for Following", () => {
    const events = applyRecurringChange(
      [
        standupSeries({
          recurrence: { frequency: Frequency.Weekly, interval: 1, byWeekday: [Weekday.Monday], count: 4 },
        }),
      ],
      changeOf({ scope: ChangeScope.Following, start: at("2026-11-15", "23:00"), end: at("2026-11-15", "23:30") }),
      now,
    );
    expect(events[1]?.recurrence?.byWeekday).toEqual([Weekday.Sunday]);
    expect(occurrenceStarts(events)).toEqual([
      at("2026-11-02", "09:00"),
      at("2026-11-09", "09:00"),
      at("2026-11-15", "23:00"),
      at("2026-11-22", "23:00"),
    ]);
  });

  it("turns the following occurrences all-day", () => {
    const series = standupSeries({
      recurrence: { frequency: Frequency.Weekly, interval: 1, byWeekday: [Weekday.Monday], count: 4 },
    });
    const change = changeOf({ scope: ChangeScope.Following, start: "2026-11-16", end: "2026-11-17", allDay: true });
    const events = applyRecurringChange([series], change, now);
    expect(events[1]).toMatchObject({ start: "2026-11-16", end: "2026-11-17", allDay: true, recurrence: { count: 2 } });
    expect(allDayStarts(events, "2026-11-01", "2026-12-01")).toEqual(["2026-11-16", "2026-11-23"]);
    expect(occurrenceStarts(events)).toEqual([at("2026-11-02", "09:00"), at("2026-11-09", "09:00")]);
  });

  it("splits on the series slot when the occurrence falls in the spring gap", () => {
    const early = makeEvent({
      id: "early",
      start: at("2026-03-07", "02:30"),
      end: at("2026-03-07", "03:00"),
      recurrence: { frequency: Frequency.Daily, interval: 1, count: 4 },
    });
    const change = changeOf({
      eventId: "early",
      scope: ChangeScope.Following,
      originalStart: "2026-03-08T03:30:00-07:00",
      start: at("2026-03-08", "04:00"),
      end: at("2026-03-08", "04:30"),
    });
    const events = applyRecurringChange([early], change, now);
    expect(events[1]?.recurrence?.count).toBe(3);
    const starts = expandBetween(events, "2026-03-01", "2026-03-15").flatMap((occurrence) =>
      occurrence.kind === OccurrenceKind.Timed ? [formatDateTime(occurrence.start, testZones.losAngeles)] : [],
    );
    expect(starts.toSorted()).toEqual([
      "2026-03-07T02:30:00-08:00",
      "2026-03-08T04:00:00-07:00",
      "2026-03-09T04:00:00-07:00",
      "2026-03-10T04:00:00-07:00",
    ]);
  });
});
