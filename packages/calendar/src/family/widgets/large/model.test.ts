import { describe, expect, it } from "vitest";
import { makeCalendar, makeEvent, makeSettings } from "../../../testing";
import { Weekday } from "../../../types";
import { monthGlance } from "./model";

function at(id: string, date: string, hour: string) {
  return makeEvent({ id, start: `${date}T${hour}:00:00-08:00`, end: `${date}T${hour}:30:00-08:00` });
}

const busyDay = [at("a", "2026-11-10", "09"), at("b", "2026-11-10", "11"), at("c", "2026-11-10", "15")];
const quietDay = [at("d", "2026-11-12", "09")];
const data = { events: [...busyDay, ...quietDay], calendars: [makeCalendar()] };

describe("monthGlance", () => {
  it("lays out whole weeks from the week start", () => {
    const weeks = monthGlance(data, "2026-11-18", makeSettings());
    expect(weeks[0]?.[0]?.date).toBe("2026-11-01");
    expect(weeks.every((week) => week.length === 7)).toBe(true);
    const monday = monthGlance(data, "2026-11-18", makeSettings({ weekStartsOn: Weekday.Monday }));
    expect(monday[0]?.[0]?.date).toBe("2026-10-26");
    expect(monday[0]?.[0]?.inMonth).toBe(false);
  });

  it("marks today and busy days only", () => {
    const days = monthGlance(data, "2026-11-18", makeSettings()).flat();
    expect(days.find((day) => day.today)?.date).toBe("2026-11-18");
    expect(days.filter((day) => day.busy).map((day) => day.date)).toEqual(["2026-11-10"]);
  });
});
