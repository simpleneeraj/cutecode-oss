import { beforeAll, describe, expect, it } from "vitest";
import { instantAt, makeSettings, testZones } from "@cutecode/calendar/testing";
import {
  Attendance,
  ChangeSource,
  Frequency,
  QuickAddField,
  Weekday,
  type QuickAddContext,
  type QuickAddParser,
} from "@cutecode/calendar/types";
import { loadQuickAddParser } from "./parse";

let parse: QuickAddParser;

beforeAll(async () => {
  parse = await loadQuickAddParser();
});

const wednesdayMorning: QuickAddContext = {
  now: instantAt("2026-10-28", "10:00"),
  settings: makeSettings(),
  calendarId: "work",
};

function fieldsOf(text: string, context = wednesdayMorning): QuickAddField[] {
  return parse(text, context).chips.map((chip) => chip.field);
}

function chipText(text: string, field: QuickAddField, context = wednesdayMorning): string | undefined {
  const chip = parse(text, context).chips.find((candidate) => candidate.field === field);
  return chip === undefined ? undefined : text.slice(chip.span.start, chip.span.end);
}

describe("quick add empty states", () => {
  it.each(["", "   "])("gives no draft for %j", (text) => {
    expect(parse(text, wednesdayMorning)).toEqual({
      draft: null,
      chips: [],
      missing: [QuickAddField.Day, QuickAddField.Time],
    });
  });
});

describe("quick add full sentence", () => {
  const text = "Lunch with Sam tomorrow 1pm for 45 min at Cafe";

  it("builds the draft", () => {
    expect(parse(text, wednesdayMorning)).toMatchObject({
      draft: {
        calendarId: "work",
        title: "Lunch",
        start: "2026-10-29T13:00:00-07:00",
        end: "2026-10-29T13:45:00-07:00",
        allDay: false,
        timeZone: testZones.losAngeles,
        location: "Cafe",
        attendees: [{ id: "sam", name: "Sam", attendance: Attendance.Pending }],
        source: ChangeSource.QuickAdd,
      },
      missing: [],
    });
  });

  it("orders chips by position with spans over the source text", () => {
    expect(fieldsOf(text)).toEqual([
      QuickAddField.Title,
      QuickAddField.With,
      QuickAddField.Day,
      QuickAddField.Time,
      QuickAddField.Duration,
      QuickAddField.Where,
    ]);
    expect(chipText(text, QuickAddField.Title)).toBe("Lunch");
    expect(chipText(text, QuickAddField.With)).toBe("with Sam");
    expect(chipText(text, QuickAddField.Day)).toBe("tomorrow");
    expect(chipText(text, QuickAddField.Time)).toBe("1pm");
    expect(chipText(text, QuickAddField.Duration)).toBe("for 45 min");
    expect(chipText(text, QuickAddField.Where)).toBe("at Cafe");
  });

  it("labels chips in the locale", () => {
    const labels = parse(text, wednesdayMorning).chips.map((chip) => chip.label);
    expect(labels).toEqual(["Lunch", "Sam", "Thu, Oct 29", "1 PM", "45 min", "Cafe"]);
  });
});

describe("quick add repeat", () => {
  it("turns every Tuesday into a weekly recurrence on the next Tuesday", () => {
    const result = parse("Standup every Tuesday 9:30", wednesdayMorning);
    expect(result.draft).toMatchObject({
      title: "Standup",
      start: "2026-11-03T09:30:00-08:00",
      end: "2026-11-03T10:30:00-08:00",
      recurrence: {
        frequency: Frequency.Weekly,
        interval: 1,
        byWeekday: [Weekday.Tuesday],
        weekStartsOn: Weekday.Sunday,
      },
    });
    expect(result.missing).toEqual([]);
    expect(chipText("Standup every Tuesday 9:30", QuickAddField.Repeat)).toBe("every Tuesday");
    expect(fieldsOf("Standup every Tuesday 9:30")).toEqual([
      QuickAddField.Title,
      QuickAddField.Repeat,
      QuickAddField.Time,
    ]);
  });

  it.each([
    ["Gym every day 7am", { frequency: Frequency.Daily, interval: 1 }],
    ["Sync every other week 3pm", { frequency: Frequency.Weekly, interval: 2 }],
    ["Rent every 2 months", { frequency: Frequency.Monthly, interval: 2 }],
    ["Review weekly", { frequency: Frequency.Weekly, interval: 1 }],
    ["Birthday yearly", { frequency: Frequency.Yearly, interval: 1 }],
    [
      "Focus every weekday 9am",
      {
        frequency: Frequency.Weekly,
        interval: 1,
        byWeekday: [Weekday.Monday, Weekday.Tuesday, Weekday.Wednesday, Weekday.Thursday, Weekday.Friday],
      },
    ],
    [
      "Run every Mon and Thu 6am",
      { frequency: Frequency.Weekly, interval: 1, byWeekday: [Weekday.Monday, Weekday.Thursday] },
    ],
  ])("reads %j", (text, recurrence) => {
    expect(parse(text, wednesdayMorning).draft?.recurrence).toEqual({ ...recurrence, weekStartsOn: Weekday.Sunday });
  });

  it("sets the repeat week start from the view settings", () => {
    const mondayWeeks = { ...wednesdayMorning, settings: makeSettings({ weekStartsOn: Weekday.Monday }) };
    expect(parse("Sync every other week 3pm", mondayWeeks).draft?.recurrence?.weekStartsOn).toBe(Weekday.Monday);
  });

  it("starts a repeat on today when today matches", () => {
    expect(parse("Retro every Wednesday 4pm", wednesdayMorning).draft?.start).toBe("2026-10-28T16:00:00-07:00");
  });
});

describe("quick add missing parts", () => {
  it("makes an all-day draft on today without a time", () => {
    const result = parse("Trip", wednesdayMorning);
    expect(result.draft).toMatchObject({ title: "Trip", start: "2026-10-28", end: "2026-10-29", allDay: true });
    expect(result.missing).toEqual([QuickAddField.Day, QuickAddField.Time]);
    expect(result.chips).toEqual([{ field: QuickAddField.Title, label: "Trip", span: { start: 0, end: 4 } }]);
  });

  it("makes an all-day draft on a parsed day without a time", () => {
    const result = parse("Holiday Friday", wednesdayMorning);
    expect(result.draft).toMatchObject({ start: "2026-10-30", end: "2026-10-31", allDay: true });
    expect(result.missing).toEqual([QuickAddField.Time]);
  });

  it("keeps garbage text in the title", () => {
    const result = parse("zxq vrmp blorf", wednesdayMorning);
    expect(result.draft).toMatchObject({ title: "zxq vrmp blorf", start: "2026-10-28", allDay: true });
    expect(result.missing).toEqual([QuickAddField.Day, QuickAddField.Time]);
    expect(result.draft?.location).toBeUndefined();
    expect(result.draft?.attendees).toBeUndefined();
  });

  it("reports a missing title when only a time is typed", () => {
    const result = parse("tomorrow 1pm", wednesdayMorning);
    expect(result.draft?.title).toBe("");
    expect(result.missing).toEqual([QuickAddField.Title]);
    expect(fieldsOf("tomorrow 1pm")).toEqual([QuickAddField.Day, QuickAddField.Time]);
  });

  it("joins title words around other chips", () => {
    expect(parse("Design tomorrow 2pm crit", wednesdayMorning).draft?.title).toBe("Design crit");
  });

  it("moves a time-only draft to tomorrow when the time has passed", () => {
    const afternoon = { ...wednesdayMorning, now: instantAt("2026-10-28", "15:00") };
    const result = parse("Lunch 1pm", afternoon);
    expect(result.draft).toMatchObject({ start: "2026-10-29T13:00:00-07:00", end: "2026-10-29T14:00:00-07:00" });
    expect(result.missing).toEqual([QuickAddField.Day]);
  });

  it("keeps a time-only draft on today when the time is still ahead", () => {
    expect(parse("Lunch 1pm", wednesdayMorning).draft?.start).toBe("2026-10-28T13:00:00-07:00");
  });
});
