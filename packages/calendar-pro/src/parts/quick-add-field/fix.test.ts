import { instantAt, makeSettings } from "@cutecode/calendar/testing";
import { QuickAddField, Weekday, type QuickAddContext, type QuickAddParser } from "@cutecode/calendar/types";
import { beforeAll, describe, expect, it } from "vitest";

import { loadQuickAddParser } from "../../quick-add";
import { RepeatPreset } from "../repeat-field/presets";
import { durationPhrase, editedChipsOf, replaceSpan, textPhrase, timePhrase, type EditedChip } from "./fix";
import { choiceOptions, currentKeyOf } from "./options";

let parse: QuickAddParser;

beforeAll(async () => {
  parse = await loadQuickAddParser();
});

const settings = makeSettings();

const context: QuickAddContext = { now: instantAt("2026-10-28", "10:00"), settings, calendarId: "work" };

const today = "2026-10-28";

function chipOf(text: string, field: QuickAddField): EditedChip {
  const chip = editedChipsOf(parse(text, context), text, settings).find((candidate) => candidate.field === field);
  if (chip === undefined) {
    throw new Error(`No ${field} chip in ${text}`);
  }
  return chip;
}

function choose(text: string, field: QuickAddField, key: string): string {
  const result = parse(text, context);
  if (result.draft === null) {
    throw new Error(`No draft for ${text}`);
  }
  const fixContext = { draft: result.draft, chips: result.chips, settings, today };
  const option = choiceOptions(field, fixContext).find((candidate) => candidate.key === key);
  return replaceSpan(text, chipOf(text, field).span, option?.phrase ?? "");
}

describe("replaceSpan", () => {
  it("swaps, appends and removes words with single spaces", () => {
    expect(replaceSpan("Lunch Fri 1pm", { start: 6, end: 9 }, "Nov 2")).toBe("Lunch Nov 2 1pm");
    expect(replaceSpan("Lunch Fri ", { start: 10, end: 10 }, "1pm")).toBe("Lunch Fri 1pm");
    expect(replaceSpan("Gym every day 7am", { start: 4, end: 13 }, "")).toBe("Gym 7am");
  });
});

describe("fix phrases", () => {
  it("writes times and lengths the parser reads back", () => {
    expect(timePhrase(0)).toBe("12am");
    expect(timePhrase(13 * 60 + 30)).toBe("1:30pm");
    expect(durationPhrase(45)).toBe("for 45 min");
    expect(durationPhrase(90)).toBe("for 90 min");
    expect(durationPhrase(60)).toBe("for 1 hour");
    expect(durationPhrase(120)).toBe("for 2 hours");
  });

  it("capitalizes names and places so they parse as chips", () => {
    expect(textPhrase(QuickAddField.With, "sam, ana lopez")).toBe("with Sam and Ana Lopez");
    expect(textPhrase(QuickAddField.Where, "blue bottle")).toBe("at Blue Bottle");
    expect(textPhrase(QuickAddField.Where, "  ")).toBe("");
    expect(textPhrase(QuickAddField.Title, " Team   lunch ")).toBe("Team lunch");
    expect(parse(`Coffee ${textPhrase(QuickAddField.With, "sam, ana lopez")} tomorrow`, context).draft?.attendees).toHaveLength(2);
  });
});

describe("chip fixes", () => {
  it("moves the day and keeps the time", () => {
    const text = choose("Lunch with Ana Fri 1pm", QuickAddField.Day, "2026-11-02");
    expect(parse(text, context).draft?.start).toBe("2026-11-02T13:00:00-08:00");
  });

  it("keeps the time when the day chip carries it", () => {
    const text = choose("Sync tomorrow 9am", QuickAddField.Day, "2026-10-30");
    expect(parse(text, context).draft?.start).toBe("2026-10-30T09:00:00-07:00");
  });

  it("adds a time to an all-day event and a day to a timed one", () => {
    const timed = choose("Lunch Fri", QuickAddField.Time, String(13 * 60));
    expect(parse(timed, context).draft).toMatchObject({ allDay: false, start: "2026-10-30T13:00:00-07:00" });
    const dated = choose("Lunch 1pm", QuickAddField.Day, "2026-11-02");
    expect(parse(dated, context).draft?.start).toBe("2026-11-02T13:00:00-08:00");
  });

  it("changes the length and the repeat", () => {
    const shorter = choose("Call for 1 hour tomorrow 9am", QuickAddField.Duration, "45");
    expect(parse(shorter, context).draft?.end).toBe("2026-10-29T09:45:00-07:00");
    const weekdays = choose("Gym every Mon 7am", QuickAddField.Repeat, RepeatPreset.Weekdays);
    const recurrence = parse(weekdays, context).draft?.recurrence;
    expect(recurrence?.byWeekday).toEqual([Weekday.Monday, Weekday.Tuesday, Weekday.Wednesday, Weekday.Thursday, Weekday.Friday]);
    expect(parse(choose("Gym every Mon 7am", QuickAddField.Repeat, RepeatPreset.Never), context).draft?.recurrence).toBeUndefined();
  });

  it("marks the current choice", () => {
    const draft = parse("Call for 45m Fri 9:30am every week", context).draft;
    if (draft === null) {
      throw new Error("No draft");
    }
    expect(currentKeyOf(QuickAddField.Day, draft)).toBe("2026-10-30");
    expect(currentKeyOf(QuickAddField.Time, draft)).toBe(String(9 * 60 + 30));
    expect(currentKeyOf(QuickAddField.Duration, draft)).toBe("45");
    expect(currentKeyOf(QuickAddField.Repeat, draft)).toBe(RepeatPreset.Weekly);
  });
});

describe("editedChipsOf", () => {
  it("keys repeated fields apart and adds ghost chips for a missing day and time", () => {
    const text = "Coffee then walk";
    const chips = editedChipsOf(parse(text, context), text, settings);
    expect(chips.map((chip) => [chip.key, chip.isMissing])).toEqual([
      ["title-0", false],
      ["missing-day", true],
      ["missing-time", true],
    ]);
    expect(chips[1]?.label).toBe("Wed, Oct 28");
    expect(chips[2]?.span).toEqual({ start: text.length, end: text.length });
  });
});
