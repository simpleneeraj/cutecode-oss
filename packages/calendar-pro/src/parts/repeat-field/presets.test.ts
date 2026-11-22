import { makeSettings, testZones } from "@cutecode/calendar/testing";
import { Frequency, Weekday } from "@cutecode/calendar/types";
import { describe, expect, it } from "vitest";

import {
  RepeatPreset,
  choosablePresets,
  mergedRecurrence,
  presetLabels,
  presetOf,
  presetRecurrence,
  startDateOf,
} from "./presets";

const wednesday = "2026-11-18";

describe("repeat presets", () => {
  it("turns each preset into a rule and back", () => {
    for (const preset of choosablePresets) {
      expect(presetOf(presetRecurrence(preset, wednesday, Weekday.Sunday), wednesday)).toBe(preset);
    }
  });

  it("repeats weekly on the start weekday and monthly on its day", () => {
    expect(presetRecurrence(RepeatPreset.Weekly, wednesday, Weekday.Monday)).toEqual({
      frequency: Frequency.Weekly,
      interval: 1,
      byWeekday: [Weekday.Wednesday],
      weekStartsOn: Weekday.Monday,
    });
    expect(presetRecurrence(RepeatPreset.Monthly, wednesday, Weekday.Sunday)?.byMonthDay).toEqual([18]);
  });

  it("reads parsed rules without weekdays as plain presets", () => {
    expect(presetOf({ frequency: Frequency.Weekly, interval: 1 }, wednesday)).toBe(RepeatPreset.Weekly);
    expect(presetOf({ frequency: Frequency.Monthly, interval: 1 }, wednesday)).toBe(RepeatPreset.Monthly);
  });

  it("keeps anything else as a custom rule", () => {
    expect(presetOf({ frequency: Frequency.Weekly, interval: 2 }, wednesday)).toBe(RepeatPreset.Custom);
    expect(presetOf({ frequency: Frequency.Daily, interval: 1, count: 5 }, wednesday)).toBe(RepeatPreset.Custom);
    expect(presetOf({ frequency: Frequency.Weekly, interval: 1, byWeekday: [Weekday.Monday] }, wednesday)).toBe(
      RepeatPreset.Custom,
    );
  });

  it("labels presets from the start day", () => {
    const labels = presetLabels(wednesday, makeSettings());
    expect(labels[RepeatPreset.Weekly]).toBe("Every week on Wednesday");
    expect(labels[RepeatPreset.Monthly]).toBe("Every month on day 18");
    expect(labels[RepeatPreset.Yearly]).toBe("Every year on November 18");
  });

  it("reads the start day of timed and all-day values in the event zone", () => {
    expect(startDateOf("2026-11-18", testZones.losAngeles)).toBe(wednesday);
    expect(startDateOf("2026-11-18T23:30:00-08:00", testZones.losAngeles)).toBe(wednesday);
  });

  it("keeps deleted dates and the end when a preset replaces the rule", () => {
    const current = {
      frequency: Frequency.Daily,
      interval: 1,
      until: "2026-11-30",
      count: 4,
      exceptionDates: ["2026-11-20"],
    };
    const daily = presetRecurrence(RepeatPreset.Daily, wednesday, Weekday.Monday);
    expect(mergedRecurrence(daily, current)).toMatchObject({ until: "2026-11-30", count: 4, exceptionDates: ["2026-11-20"] });
    const weekly = mergedRecurrence(presetRecurrence(RepeatPreset.Weekly, wednesday, Weekday.Monday), current);
    expect(weekly).toMatchObject({ frequency: Frequency.Weekly, until: "2026-11-30", exceptionDates: ["2026-11-20"] });
    expect(weekly?.count).toBeUndefined();
  });

  it("passes the preset through when there is no rule or the preset is Never", () => {
    const daily = presetRecurrence(RepeatPreset.Daily, wednesday, Weekday.Monday);
    expect(mergedRecurrence(daily, null)).toBe(daily);
    expect(mergedRecurrence(null, { frequency: Frequency.Daily, interval: 1 })).toBeNull();
  });
});
