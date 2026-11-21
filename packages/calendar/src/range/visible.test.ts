import { describe, expect, it } from "vitest";
import { instantAt, makeSettings, testZones } from "../testing";
import { daySpan, eachDate } from "../time";
import { ViewKind, Weekday } from "../types";
import { daySpans, isWeekend, rangeDays, viewRange } from "./visible";

const sundayStart = makeSettings();
const mondayStart = makeSettings({ weekStartsOn: Weekday.Monday });
const hour = 60 * 60 * 1000;

function rowCount(anchor: string, settings = sundayStart): number {
  return daySpans(viewRange(ViewKind.Month, anchor, settings)).length / rangeDays.week;
}

describe("viewRange", () => {
  it("covers one date for the day view", () => {
    const range = viewRange(ViewKind.Day, "2026-11-18", sundayStart);
    expect(range.dates).toEqual({ start: "2026-11-18", end: "2026-11-19" });
    expect(range.instants).toEqual({
      start: instantAt("2026-11-18", "00:00"),
      end: instantAt("2026-11-19", "00:00"),
    });
  });

  it("starts the week on Sunday or Monday", () => {
    expect(viewRange(ViewKind.Week, "2026-11-18", sundayStart).dates).toEqual({
      start: "2026-11-15",
      end: "2026-11-22",
    });
    expect(viewRange(ViewKind.Week, "2026-11-18", mondayStart).dates).toEqual({
      start: "2026-11-16",
      end: "2026-11-23",
    });
  });

  it("keeps a Sunday anchor in its own week for both starts", () => {
    expect(viewRange(ViewKind.Week, "2026-11-22", sundayStart).dates.start).toBe("2026-11-22");
    expect(viewRange(ViewKind.Week, "2026-11-22", mondayStart).dates.start).toBe("2026-11-16");
  });

  it("crosses the year boundary for a week", () => {
    expect(viewRange(ViewKind.Week, "2026-12-31", mondayStart).dates).toEqual({
      start: "2026-12-28",
      end: "2027-01-04",
    });
  });

  it("gives November 2026 five rows from Sunday and six from Monday", () => {
    expect(rowCount("2026-11-18")).toBe(5);
    expect(rowCount("2026-11-18", mondayStart)).toBe(6);
    expect(viewRange(ViewKind.Month, "2026-11-18", sundayStart).dates).toEqual({
      start: "2026-11-01",
      end: "2026-12-06",
    });
    expect(viewRange(ViewKind.Month, "2026-11-18", mondayStart).dates).toEqual({
      start: "2026-10-26",
      end: "2026-12-07",
    });
  });

  it("gives February 2026 four rows from Sunday", () => {
    expect(rowCount("2026-02-10")).toBe(4);
    expect(viewRange(ViewKind.Month, "2026-02-10", sundayStart).dates).toEqual({
      start: "2026-02-01",
      end: "2026-03-01",
    });
    expect(rowCount("2026-02-10", mondayStart)).toBe(5);
  });

  it("spans the whole year from January 1", () => {
    expect(viewRange(ViewKind.Year, "2028-02-29", sundayStart).dates).toEqual({
      start: "2028-01-01",
      end: "2029-01-01",
    });
    expect(daySpans(viewRange(ViewKind.Year, "2028-06-01", sundayStart))).toHaveLength(366);
    expect(daySpans(viewRange(ViewKind.Year, "2026-06-01", sundayStart))).toHaveLength(365);
  });

  it("runs the agenda thirty days from the anchor", () => {
    const range = viewRange(ViewKind.Agenda, "2026-12-15", sundayStart);
    expect(range.dates).toEqual({ start: "2026-12-15", end: "2027-01-14" });
    expect(daySpans(range)).toHaveLength(rangeDays.agenda);
  });

  it("keeps the kind, anchor, zone and week start", () => {
    const range = viewRange(ViewKind.Week, "2026-11-18", mondayStart);
    expect(range.kind).toBe(ViewKind.Week);
    expect(range.anchor).toBe("2026-11-18");
    expect(range.timeZone).toBe(testZones.losAngeles);
    expect(range.weekStartsOn).toBe(Weekday.Monday);
  });

  it("measures instants in the settings zone, not the host zone", () => {
    const settings = makeSettings({ timeZone: testZones.tokyo });
    const range = viewRange(ViewKind.Day, "2026-11-18", settings);
    expect(range.instants.start).toBe(Date.UTC(2026, 10, 17, 15));
    expect(range.instants.end - range.instants.start).toBe(24 * 60 * 60 * 1000);
  });

  it("gives a 25 hour instant range across the LA fall week", () => {
    const range = viewRange(ViewKind.Week, "2026-11-01", sundayStart);
    expect(range.instants.end - range.instants.start).toBe((7 * 24 + 1) * 60 * 60 * 1000);
  });

  it.each([
    { kind: ViewKind.Day, anchor: "2026-03-08", start: "2026-03-08", end: "2026-03-09", hours: 23 },
    { kind: ViewKind.Day, anchor: "2026-11-01", start: "2026-11-01", end: "2026-11-02", hours: 25 },
    { kind: ViewKind.Month, anchor: "2026-03-18", start: "2026-03-01", end: "2026-04-05", hours: 35 * 24 - 1 },
    { kind: ViewKind.Month, anchor: "2026-11-18", start: "2026-11-01", end: "2026-12-06", hours: 35 * 24 + 1 },
    { kind: ViewKind.Agenda, anchor: "2026-10-20", start: "2026-10-20", end: "2026-11-19", hours: 30 * 24 + 1 },
    { kind: ViewKind.Agenda, anchor: "2026-03-01", start: "2026-03-01", end: "2026-03-31", hours: 30 * 24 - 1 },
    { kind: ViewKind.Year, anchor: "2026-06-01", start: "2026-01-01", end: "2027-01-01", hours: 365 * 24 },
  ])("measures $kind instants across DST from $anchor", (row) => {
    const range = viewRange(row.kind, row.anchor, sundayStart);
    expect(range.dates).toEqual({ start: row.start, end: row.end });
    expect(range.instants).toEqual({ start: instantAt(row.start, "00:00"), end: instantAt(row.end, "00:00") });
    expect(range.instants.end - range.instants.start).toBe(row.hours * hour);
  });

  it.each([
    { anchor: "2026-03-08", settings: sundayStart, start: "2026-03-08", hours: 7 * 24 - 1 },
    { anchor: "2026-03-08", settings: mondayStart, start: "2026-03-02", hours: 7 * 24 - 1 },
    { anchor: "2026-03-09", settings: mondayStart, start: "2026-03-09", hours: 7 * 24 },
    { anchor: "2026-11-01", settings: mondayStart, start: "2026-10-26", hours: 7 * 24 + 1 },
    { anchor: "2026-11-02", settings: mondayStart, start: "2026-11-02", hours: 7 * 24 },
  ])("measures the $settings.weekStartsOn start week of $anchor across DST", (row) => {
    const range = viewRange(ViewKind.Week, row.anchor, row.settings);
    expect(range.dates.start).toBe(row.start);
    expect(range.instants.start).toBe(instantAt(row.start, "00:00"));
    expect(range.instants.end - range.instants.start).toBe(row.hours * hour);
  });

  it("starts a Santiago midnight gap day at 1 AM", () => {
    const settings = makeSettings({ timeZone: testZones.santiago });
    const range = viewRange(ViewKind.Day, "2026-09-06", settings);
    expect(range.instants.start).toBe(Date.UTC(2026, 8, 6, 4));
  });
});

describe("daySpans", () => {
  it("returns one span per date in the range zone", () => {
    const range = viewRange(ViewKind.Week, "2026-03-08", sundayStart);
    const spans = daySpans(range);
    expect(spans.map((span) => span.date)).toEqual([
      "2026-03-08",
      "2026-03-09",
      "2026-03-10",
      "2026-03-11",
      "2026-03-12",
      "2026-03-13",
      "2026-03-14",
    ]);
    expect(spans[0]?.minutes).toBe(1380);
    expect(spans[1]?.minutes).toBe(1440);
    expect(spans[0]).toEqual(daySpan("2026-03-08", testZones.losAngeles));
  });

  it("chains spans without gaps", () => {
    const spans = daySpans(viewRange(ViewKind.Month, "2026-04-05", makeSettings({ timeZone: testZones.chatham })));
    spans.slice(1).forEach((span, index) => expect(span.start).toBe(spans[index]?.end));
  });

  it.each([testZones.losAngeles, testZones.santiago, testZones.chatham, "Australia/Lord_Howe"])(
    "chains a whole year of spans in %s",
    (timeZone) => {
      const range = viewRange(ViewKind.Year, "2026-06-01", makeSettings({ timeZone }));
      const spans = daySpans(range);
      expect(spans).toHaveLength(365);
      expect(spans[0]?.start).toBe(range.instants.start);
      expect(spans.at(-1)?.end).toBe(range.instants.end);
      spans.slice(1).forEach((span, index) => expect(span.start).toBe(spans[index]?.end));
      expect(spans.map((span) => span.date)).toEqual(eachDate(range.dates));
      expect(spans.every((span) => span.minutes === (span.end - span.start) / 60000)).toBe(true);
      spans
        .filter((_, index) => index % 30 === 0)
        .forEach((span) => expect(span).toEqual(daySpan(span.date, timeZone)));
    },
  );

  it("returns no spans for an empty date range", () => {
    const range = {
      ...viewRange(ViewKind.Day, "2026-11-18", sundayStart),
      dates: { start: "2026-11-18", end: "2026-11-18" },
    };
    expect(daySpans(range)).toEqual([]);
  });
});

describe("isWeekend", () => {
  const weekend = [Weekday.Saturday, Weekday.Sunday];

  it("matches the given weekend days", () => {
    expect(isWeekend("2026-11-21", weekend)).toBe(true);
    expect(isWeekend("2026-11-22", weekend)).toBe(true);
    expect(isWeekend("2026-11-20", weekend)).toBe(false);
  });

  it("supports a Friday and Saturday weekend", () => {
    const fridaySaturday = [Weekday.Friday, Weekday.Saturday];
    expect(isWeekend("2026-11-20", fridaySaturday)).toBe(true);
    expect(isWeekend("2026-11-22", fridaySaturday)).toBe(false);
  });

  it("is never true for an empty weekend", () => {
    expect(isWeekend("2026-11-22", [])).toBe(false);
  });
});
