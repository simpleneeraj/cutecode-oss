import { describe, expect, it } from "vitest";
import { occurrenceOf } from "../event";
import { makeAllDayEvent, makeOccurrence, testZones } from "../testing";
import { addDays, startOfDay } from "../time";
import {
  ViewKind,
  Weekday,
  type ColumnSource,
  type EventOccurrence,
  type PlainDate,
  type RangeLayoutOptions,
  type ViewRange,
} from "../types";
import { createLayoutRange } from ".";

const zone = testZones.losAngeles;

function rangeOf(kind: ViewKind, start: PlainDate, days: number, timeZone: string = zone): ViewRange {
  const end = addDays(start, days);
  return {
    kind,
    anchor: start,
    dates: { start, end },
    instants: { start: startOfDay(start, timeZone), end: startOfDay(end, timeZone) },
    timeZone,
    weekStartsOn: Weekday.Sunday,
  };
}

const week = rangeOf(ViewKind.Week, "2026-11-15", 7);
const day = rangeOf(ViewKind.Day, "2026-11-18", 1);
const month = rangeOf(ViewKind.Month, "2026-11-01", 35);

function optionsOf(overrides: Partial<RangeLayoutOptions> = {}): RangeLayoutOptions {
  return { maxColumns: 3, minimumMinutes: 15, hiddenCalendarIds: [], ...overrides };
}

function allDay(id: string, start: PlainDate, end: PlainDate, calendarId = "work"): EventOccurrence {
  return occurrenceOf(makeAllDayEvent(start, end, { id, calendarId }));
}

function meeting(id: string, hour: number, overrides: { calendarId?: string; resourceIds?: string[] } = {}) {
  const clock = String(hour).padStart(2, "0");
  return makeOccurrence({
    id,
    start: `2026-11-18T${clock}:00:00-08:00`,
    end: `2026-11-18T${clock}:45:00-08:00`,
    ...overrides,
  });
}

const resourceColumns: ColumnSource = (dates) =>
  dates.flatMap((date) =>
    ["room-a", "room-b"].map((resourceId) => ({ key: `${date}:${resourceId}`, date, resourceId })),
  );

describe("createLayoutRange", () => {
  it("makes one timed column per day", () => {
    const layout = createLayoutRange()([meeting("crit", 10)], week, optionsOf());
    expect(layout.range).toBe(week);
    expect(layout.columns.map((column) => column.columnKey)).toEqual([
      "2026-11-15",
      "2026-11-16",
      "2026-11-17",
      "2026-11-18",
      "2026-11-19",
      "2026-11-20",
      "2026-11-21",
    ]);
    expect(layout.columns[3]?.boxes.map((box) => box.key)).toEqual([meeting("crit", 10).key]);
    expect(layout.columns[3]?.day.minutes).toBe(1440);
  });

  it("gives an empty range empty columns", () => {
    const layout = createLayoutRange()([], week, optionsOf());
    expect(layout.columns.every((column) => column.boxes.length === 0)).toBe(true);
    expect(layout.bars).toEqual([]);
    expect(layout.laneCount).toBe(0);
  });

  it("lays out columns and bars in the range zone", () => {
    const tokyoDay = rangeOf(ViewKind.Day, "2026-11-19", 1, testZones.tokyo);
    const lateTrip = makeOccurrence({
      id: "late",
      start: "2026-11-18T08:00:00-08:00",
      end: "2026-11-19T08:00:00-08:00",
    });
    const layout = createLayoutRange()([meeting("crit", 10), lateTrip], tokyoDay, optionsOf());
    expect(layout.columns[0]?.day.start).toBe(startOfDay("2026-11-19", testZones.tokyo));
    expect(layout.columns[0]?.boxes.map((box) => box.occurrence.event.id)).toEqual(["crit"]);
    expect(layout.bars.map((bar) => [bar.key, bar.startIndex, bar.length])).toEqual([[lateTrip.key, 0, 1]]);
  });

  it("uses the 25 hour fall day in the column", () => {
    const fallWeek = rangeOf(ViewKind.Week, "2026-11-01", 7);
    const layout = createLayoutRange()([], fallWeek, optionsOf());
    expect(layout.columns[0]?.day.minutes).toBe(1500);
  });

  it("removes occurrences of hidden calendars from columns and bars", () => {
    const occurrences = [
      meeting("crit", 10),
      meeting("dentist", 12, { calendarId: "family" }),
      allDay("school", "2026-11-18", "2026-11-19", "family"),
    ];
    const layout = createLayoutRange()(occurrences, week, optionsOf({ hiddenCalendarIds: ["family"] }));
    expect(layout.columns.flatMap((column) => column.boxes.map((box) => box.occurrence.event.id))).toEqual(["crit"]);
    expect(layout.bars).toEqual([]);
    expect(layout.laneCount).toBe(0);
  });

  it("splits the week into a bar row and counts its lanes", () => {
    const occurrences = [allDay("trip", "2026-11-16", "2026-11-20"), allDay("offsite", "2026-11-17", "2026-11-19")];
    const layout = createLayoutRange()(occurrences, week, optionsOf());
    expect(layout.bars.map((bar) => [bar.key, bar.week, bar.lane])).toEqual([
      [occurrences[0]?.key, 0, 0],
      [occurrences[1]?.key, 0, 1],
    ]);
    expect(layout.laneCount).toBe(2);
  });

  it("takes the largest lane count over the weeks of a month", () => {
    const occurrences = [
      allDay("a", "2026-11-03", "2026-11-05"),
      allDay("b", "2026-11-17", "2026-11-19"),
      allDay("c", "2026-11-17", "2026-11-19"),
      allDay("d", "2026-11-18", "2026-11-19"),
    ];
    const layout = createLayoutRange()(occurrences, month, optionsOf());
    expect(layout.laneCount).toBe(3);
    expect(layout.bars.filter((bar) => bar.week === 2)).toHaveLength(3);
  });

  it("breaks a month bar at the week edge and keeps its lane", () => {
    const trip = allDay("trip", "2026-11-12", "2026-11-18");
    const layout = createLayoutRange()([trip], month, optionsOf());
    expect(layout.bars.map((bar) => [bar.week, bar.lane, bar.continuesBefore, bar.continuesAfter])).toEqual([
      [1, 0, false, true],
      [2, 0, true, false],
    ]);
  });

  it("keeps spanning events out of the timed columns", () => {
    const summit = makeOccurrence({
      id: "summit",
      start: "2026-11-17T10:00:00-08:00",
      end: "2026-11-19T10:00:00-08:00",
    });
    const layout = createLayoutRange()([summit], week, optionsOf());
    expect(layout.columns.every((column) => column.boxes.length === 0)).toBe(true);
    expect(layout.bars).toHaveLength(1);
  });

  it("caps side by side columns with maxColumns and folds the rest", () => {
    const crowd = ["a", "b", "c", "d", "e"].map((id) => meeting(id, 10));
    const layout = createLayoutRange()(crowd, day, optionsOf({ maxColumns: 4 }));
    const column = layout.columns[0];
    expect(column?.boxes).toHaveLength(4);
    expect(column?.overflow.flatMap((chip) => chip.keys)).toHaveLength(1);
  });

  it("makes one column per resource with that resource's events", () => {
    const occurrences = [
      meeting("standup", 9, { resourceIds: ["room-a"] }),
      meeting("review", 11, { resourceIds: ["room-b"] }),
      meeting("all-hands", 13, { resourceIds: ["room-a", "room-b"] }),
      meeting("unbooked", 15),
    ];
    const layout = createLayoutRange()(occurrences, day, optionsOf({ columns: resourceColumns }));
    const idsOf = (key: string) =>
      layout.columns.find((column) => column.columnKey === key)?.boxes.map((box) => box.occurrence.event.id);
    expect(layout.columns.map((column) => column.columnKey)).toEqual(["2026-11-18:room-a", "2026-11-18:room-b"]);
    expect(idsOf("2026-11-18:room-a")).toEqual(["standup", "all-hands"]);
    expect(idsOf("2026-11-18:room-b")).toEqual(["review", "all-hands"]);
  });

  it("makes resource columns for every day of a week", () => {
    const layout = createLayoutRange()([], week, optionsOf({ columns: resourceColumns }));
    expect(layout.columns).toHaveLength(14);
    expect(layout.columns[13]?.day.date).toBe("2026-11-21");
  });

  it("keeps a column without a resource id open to every event", () => {
    const columns: ColumnSource = (dates) => dates.map((date) => ({ key: `all:${date}`, date }));
    const layout = createLayoutRange()([meeting("crit", 10)], day, optionsOf({ columns }));
    expect(layout.columns[0]?.columnKey).toBe("all:2026-11-18");
    expect(layout.columns[0]?.boxes).toHaveLength(1);
  });
});

describe("createLayoutRange memo", () => {
  const occurrences = [meeting("crit", 10), allDay("trip", "2026-11-16", "2026-11-20")];

  it("returns the identical object for identical arguments", () => {
    const layoutRange = createLayoutRange();
    const options = optionsOf();
    expect(layoutRange(occurrences, week, options)).toBe(layoutRange(occurrences, week, options));
  });

  it("returns the identical object for equal options and range values", () => {
    const layoutRange = createLayoutRange();
    const first = layoutRange(occurrences, week, optionsOf({ hiddenCalendarIds: ["family"] }));
    const second = layoutRange(occurrences, { ...week }, optionsOf({ hiddenCalendarIds: ["family"] }));
    expect(second).toBe(first);
  });

  it("recomputes when the events array changes", () => {
    const layoutRange = createLayoutRange();
    const first = layoutRange(occurrences, week, optionsOf());
    const second = layoutRange([...occurrences], week, optionsOf());
    expect(second).not.toBe(first);
    expect(second).toEqual(first);
  });

  it("recomputes when the range, zone or hidden calendars change", () => {
    const layoutRange = createLayoutRange();
    const first = layoutRange(occurrences, week, optionsOf());
    expect(layoutRange(occurrences, rangeOf(ViewKind.Week, "2026-11-22", 7), optionsOf())).not.toBe(first);
    const second = layoutRange(occurrences, week, optionsOf());
    expect(layoutRange(occurrences, rangeOf(ViewKind.Week, "2026-11-15", 7, testZones.tokyo), optionsOf())).not.toBe(
      second,
    );
    const third = layoutRange(occurrences, week, optionsOf());
    expect(layoutRange(occurrences, week, optionsOf({ hiddenCalendarIds: ["work"] }))).not.toBe(third);
  });

  it("recomputes and returns the new range when the week start flips", () => {
    const layoutRange = createLayoutRange();
    const first = layoutRange(occurrences, day, optionsOf());
    const mondayDay = { ...day, weekStartsOn: Weekday.Monday };
    const second = layoutRange(occurrences, mondayDay, optionsOf());
    expect(second).not.toBe(first);
    expect(second.range.weekStartsOn).toBe(Weekday.Monday);
  });

  it("recomputes when only the range instants change", () => {
    const layoutRange = createLayoutRange();
    const first = layoutRange(occurrences, day, optionsOf());
    const shifted = { ...day, instants: { start: day.instants.start + 1, end: day.instants.end } };
    expect(layoutRange(occurrences, shifted, optionsOf())).toBe(layoutRange(occurrences, shifted, optionsOf()));
    expect(layoutRange(occurrences, shifted, optionsOf())).not.toBe(first);
  });

  it("keeps a separate memo per instance", () => {
    const options = optionsOf();
    expect(createLayoutRange()(occurrences, week, options)).not.toBe(createLayoutRange()(occurrences, week, options));
  });
});
