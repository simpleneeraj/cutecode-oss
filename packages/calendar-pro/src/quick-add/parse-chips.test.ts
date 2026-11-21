import { beforeAll, describe, expect, it } from "vitest";
import { instantAt, makeSettings, testZones } from "@cutecode/calendar/testing";
import { Attendance, QuickAddField, type QuickAddContext, type QuickAddParser } from "@cutecode/calendar/types";
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

function chipText(text: string, field: QuickAddField, context = wednesdayMorning): string | undefined {
  const chip = parse(text, context).chips.find((candidate) => candidate.field === field);
  return chip === undefined ? undefined : text.slice(chip.span.start, chip.span.end);
}

describe("quick add with and where", () => {
  it("reads several attendees", () => {
    expect(parse("Sync with Sam and Ana Lopez", wednesdayMorning).draft?.attendees).toEqual([
      { id: "sam", name: "Sam", attendance: Attendance.Pending },
      { id: "ana-lopez", name: "Ana Lopez", attendance: Attendance.Pending },
    ]);
  });

  it.each([
    ["Review at Room A", "Room A"],
    ["Coffee in Cafe", "Cafe"],
    ["Standup at Room 4 9am", "Room 4"],
  ])("reads the place in %j", (text, location) => {
    expect(parse(text, wednesdayMorning).draft?.location).toBe(location);
  });

  it("leaves lowercase words after with or at in the title", () => {
    const result = parse("Play with fire", wednesdayMorning);
    expect(result.draft?.title).toBe("Play with fire");
    expect(result.draft?.attendees).toBeUndefined();
  });

  it.each([
    ["Call for 1 hour", 60],
    ["Call for an hour", 60],
    ["Call for 1.5 hours", 90],
    ["Call 1.5 hours", 90],
    ["Call for 30m", 30],
    ["Call 30m", 30],
    ["Call for 2h", 120],
    ["Call 2h", 120],
    ["Call 45 min", 45],
  ])("reads the duration in %j", (text, minutes) => {
    const result = parse(`${text} tomorrow 9am`, wednesdayMorning);
    const start = Date.parse(result.draft?.start ?? "");
    const end = Date.parse(result.draft?.end ?? "");
    expect(result.draft?.title).toBe("Call");
    expect(result.draft?.start).toBe("2026-10-29T09:00:00-07:00");
    expect((end - start) / 60000).toBe(minutes);
  });

  it("reads a bare duration before or after the moment", () => {
    const before = parse("Standup 1.5 hours tomorrow 9am", wednesdayMorning);
    expect(before.draft).toMatchObject({
      title: "Standup",
      start: "2026-10-29T09:00:00-07:00",
      end: "2026-10-29T10:30:00-07:00",
    });
    expect(chipText("Standup 1.5 hours tomorrow 9am", QuickAddField.Duration)).toBe("1.5 hours");
    expect(chipText("Standup 1.5 hours tomorrow 9am", QuickAddField.Day)).toBe("tomorrow");
    const after = parse("Sync tomorrow 9am 30m", wednesdayMorning);
    expect(after.draft).toMatchObject({ title: "Sync", end: "2026-10-29T09:30:00-07:00" });
  });

  it("leaves numbers without a unit and clock times out of the duration", () => {
    expect(parse("Room 4 sync 9:30", wednesdayMorning).chips.map((chip) => chip.field)).not.toContain(
      QuickAddField.Duration,
    );
    expect(parse("Meet a mate tomorrow 9am", wednesdayMorning).draft?.title).toBe("Meet a mate");
  });
});

describe("quick add multi-day ranges", () => {
  it("ends a timed range on its stated day", () => {
    expect(parse("Trip Fri 10am to Sun 6pm", wednesdayMorning).draft).toMatchObject({
      title: "Trip",
      start: "2026-10-30T10:00:00-07:00",
      end: "2026-11-01T18:00:00-08:00",
      allDay: false,
    });
  });

  it("ends an all-day range the day after its stated last day", () => {
    expect(parse("Offsite Mar 3 to Mar 5", wednesdayMorning).draft).toMatchObject({
      title: "Offsite",
      start: "2027-03-03",
      end: "2027-03-06",
      allDay: true,
    });
  });

  it("keeps a same-day range on one day and rolls an overnight one", () => {
    expect(parse("Sync tomorrow 10am to 2pm", wednesdayMorning).draft).toMatchObject({
      start: "2026-10-29T10:00:00-07:00",
      end: "2026-10-29T14:00:00-07:00",
    });
    expect(parse("Shift tomorrow 10pm to 2am", wednesdayMorning).draft).toMatchObject({
      start: "2026-10-29T22:00:00-07:00",
      end: "2026-10-30T02:00:00-07:00",
    });
  });
});

describe("quick add typed zone", () => {
  it("reads the wall clock in the typed zone and writes it in the settings zone", () => {
    expect(parse("Dinner tomorrow at 8pm EST", wednesdayMorning).draft).toMatchObject({
      title: "Dinner",
      start: "2026-10-29T18:00:00-07:00",
      end: "2026-10-29T19:00:00-07:00",
      timeZone: testZones.losAngeles,
    });
  });
});

describe("quick add chip spans", () => {
  function overlapping(text: string): boolean {
    const spans = parse(text, wednesdayMorning)
      .chips.map((chip) => chip.span)
      .sort((first, second) => first.start - second.start);
    return spans.some((span, index) => index > 0 && span.start < (spans[index - 1]?.end ?? 0));
  }

  it.each([
    "Lunch with Sam tomorrow 1pm for 45 min at Cafe",
    "Design tomorrow 2pm crit",
    "tomorrow 1pm",
    "Dentist Nov 1 1:30am",
    "Trip Fri 10am to Sun 6pm",
    "Standup every Tuesday 9:30 with Ana",
  ])("never overlap in %j", (text) => {
    expect(overlapping(text)).toBe(false);
  });

  it("gives one title chip per run of title text", () => {
    const text = "Design tomorrow 2pm crit";
    const titles = parse(text, wednesdayMorning).chips.filter((chip) => chip.field === QuickAddField.Title);
    expect(titles.map((chip) => text.slice(chip.span.start, chip.span.end))).toEqual(["Design", "crit"]);
    expect(titles.map((chip) => chip.label)).toEqual(["Design", "crit"]);
  });

  it("splits day and time into their own spans", () => {
    expect(chipText("Dentist Nov 1 1:30am", QuickAddField.Day)).toBe("Nov 1");
    expect(chipText("Dentist Nov 1 1:30am", QuickAddField.Time)).toBe("1:30am");
    expect(chipText("Call tomorrow at 1pm", QuickAddField.Day)).toBe("tomorrow");
    expect(chipText("Call tomorrow at 1pm", QuickAddField.Time)).toBe("at 1pm");
  });

  it("keeps a range that cannot be split as one day chip with the time in its label", () => {
    const chips = parse("Trip Fri 10am to Sun 6pm", wednesdayMorning).chips;
    expect(chips.filter((chip) => chip.field === QuickAddField.Time)).toEqual([]);
    expect(chips.find((chip) => chip.field === QuickAddField.Day)?.label).toBe("Fri, Oct 30, 10 AM");
  });
});
