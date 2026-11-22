import { describe, expect, it } from "vitest";

import { pickerMonth, SelectionMode, type SingleSelection } from "../../picker";
import { makeAllDayEvent, makeCalendar, makeEvent, makeSettings } from "../../testing";
import { CalendarTone } from "../../types";
import {
  allCalendars,
  filterChips,
  filteredOccurrences,
  listDays,
  monthOccurrences,
  TileKind,
  tileDays,
} from "./model";

const settings = makeSettings();
const { timeZone } = settings;

const calendars = [
  makeCalendar(),
  makeCalendar({ id: "personal", name: "Personal", tone: CalendarTone.Grey }),
  makeCalendar({ id: "family", name: "Family", tone: CalendarTone.Line }),
  makeCalendar({ id: "hidden", name: "Hidden", tone: CalendarTone.Ink, visible: false }),
];

function timed(id: string, day: string, hour: string, calendarId = "work") {
  return makeEvent({
    id,
    calendarId,
    start: `2026-11-${day}T${hour}:00:00-08:00`,
    end: `2026-11-${day}T${hour}:30:00-08:00`,
  });
}

const events = [
  timed("one", "18", "09"),
  timed("two", "18", "10", "personal"),
  timed("three", "18", "11", "personal"),
  timed("four", "18", "12"),
  timed("secret", "18", "13", "hidden"),
  timed("other", "05", "09", "personal"),
  makeAllDayEvent("2026-12-02", "2026-12-03", { id: "december", calendarId: "family" }),
];

const occurrences = monthOccurrences(events, calendars, "2026-11-10", timeZone);

describe("monthOccurrences", () => {
  it("keeps visible events inside the month", () => {
    expect(occurrences.map((occurrence) => occurrence.event.id).sort()).toEqual([
      "four",
      "one",
      "other",
      "three",
      "two",
    ]);
  });
});

describe("filterChips", () => {
  it("counts all, then each calendar that has events", () => {
    expect(filterChips(occurrences, calendars)).toEqual([
      { id: allCalendars, label: "All", count: 5 },
      { id: "work", label: "Work", count: 2 },
      { id: "personal", label: "Personal", count: 3 },
    ]);
  });

  it("keeps only All in an empty month", () => {
    expect(filterChips([], calendars)).toEqual([{ id: allCalendars, label: "All", count: 0 }]);
  });
});

describe("filteredOccurrences", () => {
  it("keeps every occurrence for All and one calendar otherwise", () => {
    expect(filteredOccurrences(occurrences, allCalendars)).toHaveLength(5);
    expect(filteredOccurrences(occurrences, "work").map((occurrence) => occurrence.event.id)).toEqual(["one", "four"]);
  });
});

describe("tileDays", () => {
  const selection: SingleSelection = { mode: SelectionMode.Single, date: "2026-11-05" };
  const weeks = pickerMonth("2026-11-10", settings, selection, {}, "2026-11-18");
  const days = tileDays(weeks, occurrences, calendars, timeZone).flat();
  const dayOf = (date: string) => days.find((tile) => tile.day.date === date);

  it("fills busy days with up to three lines and counts the rest", () => {
    const busy = dayOf("2026-11-18");
    expect(busy?.kind).toBe(TileKind.Busy);
    expect(busy?.lines.map((line) => line.isAccent)).toEqual([true, false, false]);
    expect(busy?.eventCount).toBe(4);
  });

  it("marks selected, free and outside days", () => {
    expect(dayOf("2026-11-05")?.kind).toBe(TileKind.Selected);
    expect(dayOf("2026-11-06")?.kind).toBe(TileKind.Free);
    expect(dayOf("2026-12-05")).toMatchObject({ kind: TileKind.Outside, lines: [] });
  });
});

describe("listDays", () => {
  it("lists every event of each busy day in order", () => {
    const dates = ["2026-11-05", "2026-11-06", "2026-11-18"];
    const days = listDays(occurrences, dates, timeZone);
    expect(days.map((day) => day.date)).toEqual(["2026-11-05", "2026-11-18"]);
    expect(days[1]?.occurrences.map((occurrence) => occurrence.event.id)).toEqual(["one", "two", "three", "four"]);
  });
});
