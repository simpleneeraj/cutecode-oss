import { describe, expect, it } from "vitest";
import { testZones } from "../testing";
import { HourCycle, TextDirection, Weekday } from "../types";
import {
  fallbackTextDirection,
  fallbackWeekInfo,
  hourCycleOf,
  resolveSettings,
  textDirectionOf,
  weekInfo,
} from "./week-info";

describe("weekInfo", () => {
  it("starts en-US weeks on Sunday", () => {
    expect(weekInfo("en-US")).toEqual({ firstDay: Weekday.Sunday, weekend: [Weekday.Saturday, Weekday.Sunday] });
  });

  it("starts en-GB and de-DE weeks on Monday", () => {
    expect(weekInfo("en-GB").firstDay).toBe(Weekday.Monday);
    expect(weekInfo("de-DE").firstDay).toBe(Weekday.Monday);
  });

  it("reads a Friday and Saturday weekend", () => {
    expect(weekInfo("ar-SA").weekend).toEqual([Weekday.Friday, Weekday.Saturday]);
  });
});

describe("fallbackWeekInfo", () => {
  it("knows Sunday, Saturday and Monday regions", () => {
    expect(fallbackWeekInfo("US").firstDay).toBe(Weekday.Sunday);
    expect(fallbackWeekInfo("EG").firstDay).toBe(Weekday.Saturday);
    expect(fallbackWeekInfo("DE").firstDay).toBe(Weekday.Monday);
  });

  it("defaults unknown regions to Monday with a Saturday and Sunday weekend", () => {
    expect(fallbackWeekInfo("")).toEqual({ firstDay: Weekday.Monday, weekend: [Weekday.Saturday, Weekday.Sunday] });
  });

  it("gives Friday and Saturday weekends where they apply", () => {
    expect(fallbackWeekInfo("AE").weekend).toEqual([Weekday.Friday, Weekday.Saturday]);
  });
});

describe("hourCycleOf", () => {
  it("is 12 hour for en-US and 24 hour for en-GB and de-DE", () => {
    expect(hourCycleOf("en-US")).toBe(HourCycle.Twelve);
    expect(hourCycleOf("en-GB")).toBe(HourCycle.TwentyFour);
    expect(hourCycleOf("de-DE")).toBe(HourCycle.TwentyFour);
  });
});

describe("textDirectionOf", () => {
  it("is right to left for ar-EG and he-IL", () => {
    expect(textDirectionOf("ar-EG")).toBe(TextDirection.RightToLeft);
    expect(textDirectionOf("he-IL")).toBe(TextDirection.RightToLeft);
  });

  it("is left to right for en-US", () => {
    expect(textDirectionOf("en-US")).toBe(TextDirection.LeftToRight);
  });

  it("falls back by language", () => {
    expect(fallbackTextDirection("fa")).toBe(TextDirection.RightToLeft);
    expect(fallbackTextDirection("ur")).toBe(TextDirection.RightToLeft);
    expect(fallbackTextDirection("de")).toBe(TextDirection.LeftToRight);
  });
});

describe("resolveSettings", () => {
  it("takes week start and hour cycle from the locale", () => {
    expect(resolveSettings({ locale: "en-US", timeZone: testZones.losAngeles })).toEqual({
      locale: "en-US",
      timeZone: testZones.losAngeles,
      weekStartsOn: Weekday.Sunday,
      hourCycle: HourCycle.Twelve,
    });
    expect(resolveSettings({ locale: "de-DE", timeZone: testZones.berlin })).toMatchObject({
      weekStartsOn: Weekday.Monday,
      hourCycle: HourCycle.TwentyFour,
    });
  });

  it("lets overrides win", () => {
    const settings = resolveSettings({
      locale: "en-US",
      timeZone: testZones.losAngeles,
      weekStartsOn: Weekday.Monday,
      hourCycle: HourCycle.TwentyFour,
      workingHours: { start: "09:00", end: "17:00" },
    });
    expect(settings).toMatchObject({
      weekStartsOn: Weekday.Monday,
      hourCycle: HourCycle.TwentyFour,
      workingHours: { start: "09:00", end: "17:00" },
    });
  });

  it("leaves working hours out when not given", () => {
    expect(resolveSettings({ locale: "en-GB", timeZone: testZones.london })).not.toHaveProperty("workingHours");
  });
});
