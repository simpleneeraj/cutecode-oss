import { makeCalendar, makeEvent, makeSettings } from "@cutecode/calendar/testing";
import { pickerMonth, SelectionMode } from "@cutecode/calendar/picker";
import { describe, expect, it } from "vitest";

import { HeatLevel } from "../../heat/aggregate";
import { countShown, HeatLook, heatMonthModel, showsBadge, tileLevel } from "./model";

const settings = makeSettings();

function at(id: string, date: string, hour: string, calendarId = "work") {
  return makeEvent({ id, calendarId, start: `${date}T${hour}:00:00-08:00`, end: `${date}T${hour}:30:00-08:00` });
}

const events = [
  at("a", "2026-11-18", "09"),
  at("b", "2026-11-18", "11"),
  at("c", "2026-11-18", "15"),
  at("d", "2026-11-03", "09"),
  at("e", "2026-12-01", "09"),
  at("f", "2026-11-20", "09", "hidden"),
];
const calendars = [makeCalendar(), makeCalendar({ id: "hidden", visible: false })];
const weeks = pickerMonth("2026-11-01", settings, { mode: SelectionMode.Single, date: "2026-11-03" }, {}, "2026-11-18");

function tileOn(model: ReturnType<typeof heatMonthModel>, date: string) {
  return model.weeks.flat().find((tile) => tile.date === date);
}

describe("heatMonthModel", () => {
  const model = heatMonthModel(weeks, countShown({ events, calendars }, weeks, settings.timeZone), settings);

  it("counts the month only and skips hidden calendars", () => {
    expect(model.total).toBe(4);
    expect(tileOn(model, "2026-11-20")?.count).toBe(0);
    expect(tileOn(model, "2026-12-01")?.count).toBe(0);
  });

  it("finds the busiest day and scales heat to it", () => {
    expect(model.busiest).toBe("2026-11-18");
    expect(tileOn(model, "2026-11-18")?.level).toBe(HeatLevel.Peak);
    expect(tileOn(model, "2026-11-03")?.level).toBe(HeatLevel.Medium);
  });

  it("labels each day with its count", () => {
    expect(tileOn(model, "2026-11-18")?.label).toBe("Wednesday, November 18, 3 events");
  });

  it("is quiet with no events", () => {
    const quiet = heatMonthModel(weeks, countShown({ events: [], calendars }, weeks, settings.timeZone), settings);
    expect(quiet.total).toBe(0);
    expect(quiet.busiest).toBeNull();
  });
});

describe("tile look", () => {
  const model = heatMonthModel(weeks, countShown({ events, calendars }, weeks, settings.timeZone), settings);
  const busy = tileOn(model, "2026-11-18");
  const selected = tileOn(model, "2026-11-03");

  it("fills by heat only in the heat look and never on the selected tile", () => {
    expect(busy && tileLevel(busy, HeatLook.Heat)).toBe(HeatLevel.Peak);
    expect(busy && tileLevel(busy, HeatLook.Count)).toBe(HeatLevel.None);
    expect(selected && tileLevel(selected, HeatLook.Heat)).toBeUndefined();
  });

  it("badges busy days in the count look", () => {
    expect(busy && showsBadge(busy, HeatLook.Count)).toBe(true);
    expect(busy && showsBadge(busy, HeatLook.Heat)).toBe(false);
  });
});
