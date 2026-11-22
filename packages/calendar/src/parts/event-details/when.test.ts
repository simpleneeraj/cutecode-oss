import { describe, expect, it } from "vitest";
import { instantAt, makeOccurrence, makeSettings } from "../../testing";
import { durationText, occurrenceWhen, timedWhen } from "./when";

const settings = makeSettings();

describe("durationText", () => {
  it("reads minutes, hours and both", () => {
    expect(durationText(30)).toBe("30 min");
    expect(durationText(60)).toBe("1 hr");
    expect(durationText(90)).toBe("1 hr 30 min");
    expect(durationText(0)).toBe("0 min");
  });
});

describe("timedWhen", () => {
  it("names the day, the time range and the length", () => {
    const when = timedWhen(
      { start: instantAt("2026-11-19", "13:00"), end: instantAt("2026-11-19", "14:00") },
      settings,
    );
    expect(when.day).toBe("Thu, Nov 19");
    expect(when.time).toContain("1");
    expect(when.duration).toBe("1 hr");
  });
});

describe("occurrenceWhen", () => {
  it("reads a multi-day all-day event as a span", () => {
    const occurrence = makeOccurrence({ allDay: true, start: "2026-11-20", end: "2026-11-23" });
    expect(occurrenceWhen(occurrence, settings)).toEqual({
      day: "Fri, Nov 20 to Sun, Nov 22",
      time: "All day",
      duration: "3 days",
    });
  });

  it("reads a one-day all-day event as that day", () => {
    const occurrence = makeOccurrence({ allDay: true, start: "2026-11-20", end: "2026-11-21" });
    expect(occurrenceWhen(occurrence, settings).day).toBe("Fri, Nov 20");
  });
});
