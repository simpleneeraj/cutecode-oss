import { describe, expect, it } from "vitest";
import { occurrenceOf } from "../../event";
import { makeAllDayEvent, makeCalendar, makeEvent, makeSettings } from "../../testing";
import { monthWeeks } from "../../time";
import { Weekday, type CalendarEvent } from "../../types";
import { buildMonthModel, monthHeading, type MonthDay, type MonthModel } from "./model";

const settings = makeSettings();

const calendars = [makeCalendar(), makeCalendar({ id: "family", name: "Family", visible: false })];

function timed(id: string, day: string, hour: string, overrides: Partial<CalendarEvent> = {}) {
  return makeEvent({ id, title: id, start: `${day}T${hour}:00-08:00`, end: `${day}T${hour}:30-08:00`, ...overrides });
}

const events = [
  timed("one", "2026-11-18", "09"),
  timed("two", "2026-11-18", "10"),
  timed("three", "2026-11-18", "11"),
  timed("hidden", "2026-11-18", "12", { calendarId: "family" }),
  makeAllDayEvent("2026-11-20", "2026-11-24", { id: "trip" }),
];

function modelOf(weekStartsOn: Weekday, lines: number): MonthModel {
  return buildMonthModel({
    occurrences: events.map(occurrenceOf),
    weeks: monthWeeks("2026-11-01", weekStartsOn),
    calendars,
    settings: makeSettings({ weekStartsOn }),
    marks: { anchor: "2026-11-01", selected: "2026-11-18", today: "2026-11-22", lines },
  });
}

function dayOn(model: MonthModel, date: string): MonthDay | undefined {
  return model.weeks.flatMap((week) => week.days).find((day) => day.date === date);
}

describe("buildMonthModel", () => {
  it("has 5 rows from Sunday and 6 from Monday in November 2026", () => {
    expect(modelOf(Weekday.Sunday, 4).weeks).toHaveLength(5);
    expect(modelOf(Weekday.Monday, 4).weeks).toHaveLength(6);
  });

  it("fits chips under the week's bars and keeps a line for more", () => {
    const day = dayOn(modelOf(Weekday.Sunday, 3), "2026-11-18");
    expect(day?.chips.map((chip) => chip.event.id)).toEqual(["one"]);
    expect(day?.hiddenCount).toBe(2);
    expect(day?.eventCount).toBe(3);
    expect(day?.isSelected).toBe(true);
  });

  it("breaks a trip into one bar per week and keeps the lane", () => {
    const model = modelOf(Weekday.Sunday, 4);
    const friday = dayOn(model, "2026-11-20");
    const sunday = dayOn(model, "2026-11-22");
    expect(friday?.bars[0]?.continuesAfter).toBe(true);
    expect(sunday?.bars[0]?.continuesBefore).toBe(true);
    expect(sunday?.isToday).toBe(true);
    expect(model.weeks[3]?.laneCount).toBe(1);
  });

  it("leaves hidden calendars out of counts", () => {
    expect(dayOn(modelOf(Weekday.Sunday, 6), "2026-11-18")?.eventCount).toBe(3);
  });
});

describe("monthHeading", () => {
  it("names the month and year", () => {
    expect(monthHeading("2026-11-01", settings).title).toBe("November 2026");
  });
});
