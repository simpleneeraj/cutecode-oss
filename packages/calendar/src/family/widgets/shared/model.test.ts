import { describe, expect, it } from "vitest";
import { occurrenceOf } from "../../../event";
import { instantAt, makeCalendar, makeEvent, makeSettings, testZones } from "../../../testing";
import { CalendarTone, EventStatus } from "../../../types";
import { DayStatus } from "../../../widgets";
import { initialsOf, placeWithRange, startsIn, startWithPlace, tomorrowLine, toneOf, widgetDay } from "./model";

const zone = testZones.losAngeles;
const settings = makeSettings();
const crit = makeEvent({ id: "crit", location: "Atlas" });
const lunch = makeEvent({ id: "lunch", start: "2026-11-18T12:00:00-08:00", end: "2026-11-18T13:00:00-08:00" });
const standup = makeEvent({
  id: "standup",
  title: "Standup",
  start: "2026-11-19T09:00:00-08:00",
  end: "2026-11-19T09:15:00-08:00",
});
const dropped = makeEvent({
  id: "dropped",
  status: EventStatus.Cancelled,
  start: "2026-11-18T15:00:00-08:00",
  end: "2026-11-18T16:00:00-08:00",
});
const calendars = [makeCalendar(), makeCalendar({ id: "home", tone: CalendarTone.Ink, visible: false })];
const hidden = makeEvent({ id: "hidden", calendarId: "home" });
const data = { events: [lunch, crit, standup, dropped, hidden], calendars };

function idsOf(occurrences: { event: { id: string } }[]): string[] {
  return occurrences.map((occurrence) => occurrence.event.id);
}

describe("widgetDay", () => {
  it("lists what is left today and skips hidden and cancelled events", () => {
    const day = widgetDay(data, instantAt("2026-11-18", "09:30"), zone);
    expect(day.today).toBe("2026-11-18");
    expect(idsOf(day.upcoming)).toEqual(["crit", "lunch"]);
    expect(day.plannedCount).toBe(2);
    expect(day.status).toBe(DayStatus.Busy);
  });

  it("is done after the last event and still offers tomorrow", () => {
    const day = widgetDay(data, instantAt("2026-11-18", "19:00"), zone);
    expect(day.status).toBe(DayStatus.Done);
    expect(day.upcoming).toEqual([]);
    expect(day.tomorrow?.event.id).toBe("standup");
  });

  it("is free on an empty day", () => {
    const day = widgetDay({ events: [], calendars }, instantAt("2026-11-18", "08:00"), zone);
    expect(day.status).toBe(DayStatus.Free);
    expect(day.tomorrow).toBeUndefined();
  });
});

describe("widget text", () => {
  const occurrence = occurrenceOf(crit);

  it("counts down to the next start", () => {
    expect(startsIn(occurrence, instantAt("2026-11-18", "09:40"), settings)).toBe("In 20 minutes");
    expect(startsIn(occurrence, instantAt("2026-11-18", "08:00"), settings)).toBe("In 2 hours");
    expect(startsIn(occurrence, instantAt("2026-11-18", "10:10"), settings)).toBe("Now");
  });

  it("joins the start time and place", () => {
    expect(startWithPlace(occurrence, settings)).toBe("10 AM, Atlas");
  });

  it("leads with the place before the time range", () => {
    expect(placeWithRange(occurrence, settings)).toBe("Atlas, 10 – 11 AM");
    expect(placeWithRange(occurrenceOf(lunch), settings)).toBe("12 – 1 PM");
  });

  it("falls back to grey for an unknown calendar", () => {
    expect(toneOf(occurrence, { events: [], calendars: [] })).toBe(CalendarTone.Grey);
    expect(toneOf(occurrence, { events: [], calendars })).toBe(CalendarTone.Accent);
  });

  it("names tomorrow's first event", () => {
    const standupOccurrence = occurrenceOf(standup);
    expect(tomorrowLine(standupOccurrence, data, settings)).toMatchObject({
      title: "Tomorrow",
      detail: "Standup, 9 AM",
    });
  });

  it("takes two initials", () => {
    expect(initialsOf("Ana  Novak")).toBe("AN");
    expect(initialsOf("sam")).toBe("S");
    expect(initialsOf("Mia Rose Lee")).toBe("MR");
  });
});
