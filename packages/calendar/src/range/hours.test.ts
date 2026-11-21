import { describe, expect, it } from "vitest";
import { dstTransitions2026, testZones, TransitionKind } from "../testing";
import { daySpan, toWallClock } from "../time";
import { hourMarks, workingMinutes } from "./hours";

function wallHours(date: string, timeZone: string): number[] {
  return hourMarks(daySpan(date, timeZone), timeZone).map((mark) => mark.wallMinute / 60);
}

const officeHours = { start: "09:00", end: "17:00" };

const lordHowe = "Australia/Lord_Howe";

const lordHoweTransitions = [
  { kind: TransitionKind.Fall, date: "2026-04-05", dayMinutes: 1470, wallHours: [0, 1, 2, 3], afterGapIndex: -1 },
  { kind: TransitionKind.Spring, date: "2026-10-04", dayMinutes: 1410, wallHours: [0, 1, 3, 4], afterGapIndex: 2 },
];

describe("hourMarks", () => {
  it("gives 24 plain marks on an ordinary day", () => {
    const marks = hourMarks(daySpan("2026-11-18", testZones.losAngeles), testZones.losAngeles);
    expect(marks).toHaveLength(24);
    expect(marks.map((mark) => mark.minute)).toEqual(Array.from({ length: 24 }, (_, index) => index * 60));
    expect(marks.every((mark) => !mark.repeated && !mark.afterGap)).toBe(true);
    expect(marks[0]?.offsetMinutes).toBe(-480);
  });

  it.each(dstTransitions2026)("gives $timeZone $kind on $date the right marks", (transition) => {
    const day = daySpan(transition.date, transition.timeZone);
    const marks = hourMarks(day, transition.timeZone);
    const isFall = transition.kind === TransitionKind.Fall;
    expect(marks).toHaveLength(transition.dayMinutes / 60);
    expect(marks.filter((mark) => mark.repeated)).toHaveLength(isFall ? 1 : 0);
    expect(marks.filter((mark) => mark.afterGap)).toHaveLength(isFall ? 0 : 1);
    marks.slice(1).forEach((mark, index) => expect(mark.minute - (marks[index]?.minute ?? 0)).toBe(60));
  });

  it("shows 1 AM twice on the LA fall day", () => {
    const marks = hourMarks(daySpan("2026-11-01", testZones.losAngeles), testZones.losAngeles);
    expect(marks.slice(0, 4).map((mark) => mark.wallMinute)).toEqual([0, 60, 60, 120]);
    expect(marks[1]?.repeated).toBe(false);
    expect(marks[2]?.repeated).toBe(true);
    expect(marks[1]?.offsetMinutes).toBe(-420);
    expect(marks[2]?.offsetMinutes).toBe(-480);
    expect(marks.at(-1)?.wallMinute).toBe(23 * 60);
  });

  it("skips 2 AM on the LA spring day", () => {
    const marks = hourMarks(daySpan("2026-03-08", testZones.losAngeles), testZones.losAngeles);
    expect(wallHours("2026-03-08", testZones.losAngeles).slice(0, 4)).toEqual([0, 1, 3, 4]);
    expect(marks[2]?.afterGap).toBe(true);
    expect(marks[2]?.minute).toBe(120);
    expect(marks[3]?.afterGap).toBe(false);
  });

  it("handles the Chatham 2:45 spring transition", () => {
    const marks = hourMarks(daySpan("2026-09-27", testZones.chatham), testZones.chatham);
    expect(wallHours("2026-09-27", testZones.chatham).slice(0, 5)).toEqual([0, 1, 2, 4, 5]);
    expect(marks[3]?.afterGap).toBe(true);
    expect(marks[2]?.offsetMinutes).toBe(765);
    expect(marks[3]?.offsetMinutes).toBe(825);
  });

  it("repeats 3 AM on the Chatham fall day after the 3:45 change", () => {
    const marks = hourMarks(daySpan("2026-04-05", testZones.chatham), testZones.chatham);
    expect(wallHours("2026-04-05", testZones.chatham).slice(0, 5)).toEqual([0, 1, 2, 3, 3]);
    expect(marks[4]?.repeated).toBe(true);
    expect(marks[3]?.repeated).toBe(false);
  });

  it("starts the Santiago midnight gap day at 1 AM", () => {
    const marks = hourMarks(daySpan("2026-09-06", testZones.santiago), testZones.santiago);
    expect(marks).toHaveLength(23);
    expect(marks[0]?.wallMinute).toBe(60);
    expect(marks[0]?.minute).toBe(0);
    expect(marks[0]?.afterGap).toBe(true);
  });

  it("repeats 11 PM on the Santiago midnight fall day", () => {
    const marks = hourMarks(daySpan("2026-04-04", testZones.santiago), testZones.santiago);
    expect(marks.slice(-2).map((mark) => mark.wallMinute)).toEqual([23 * 60, 23 * 60]);
    expect(marks.at(-1)?.repeated).toBe(true);
  });

  it.each(lordHoweTransitions)("keeps Lord Howe $kind marks on whole wall hours", (transition) => {
    const day = daySpan(transition.date, lordHowe);
    const marks = hourMarks(day, lordHowe);
    expect(day.minutes).toBe(transition.dayMinutes);
    expect(marks.every((mark) => mark.wallMinute % 60 === 0)).toBe(true);
    expect(marks.slice(0, 4).map((mark) => mark.wallMinute / 60)).toEqual(transition.wallHours);
    expect(marks.slice(0, 4).map((mark) => mark.minute)).toEqual([0, 60, 150, 210]);
    expect(marks.findIndex((mark) => mark.afterGap)).toBe(transition.afterGapIndex);
    expect(marks.filter((mark) => mark.repeated)).toHaveLength(0);
    expect(marks.at(-1)?.wallMinute).toBe(23 * 60);
  });

  it("matches the zone clock for every mark", () => {
    const marks = hourMarks(daySpan("2026-11-01", testZones.losAngeles), testZones.losAngeles);
    marks.forEach((mark) => expect(toWallClock(mark.instant, testZones.losAngeles).minute).toBe(mark.wallMinute));
  });

  it("keeps half and quarter hour zones on the hour", () => {
    expect(wallHours("2026-11-18", testZones.kathmandu).slice(0, 3)).toEqual([0, 1, 2]);
    expect(wallHours("2026-11-18", testZones.kolkata)).toHaveLength(24);
  });
});

describe("workingMinutes", () => {
  it("measures office hours on an ordinary day", () => {
    const day = daySpan("2026-11-18", testZones.losAngeles);
    expect(workingMinutes(day, officeHours, testZones.losAngeles)).toEqual({ startMinute: 540, endMinute: 1020 });
  });

  it("shifts by the lost hour on the spring day", () => {
    const day = daySpan("2026-03-08", testZones.losAngeles);
    expect(workingMinutes(day, officeHours, testZones.losAngeles)).toEqual({ startMinute: 480, endMinute: 960 });
  });

  it("shifts by the gained hour on the fall day", () => {
    const day = daySpan("2026-11-01", testZones.losAngeles);
    expect(workingMinutes(day, officeHours, testZones.losAngeles)).toEqual({ startMinute: 600, endMinute: 1080 });
  });

  it("reaches the end of the day for 24:00", () => {
    const day = daySpan("2026-11-01", testZones.losAngeles);
    expect(workingMinutes(day, { start: "00:00", end: "24:00" }, testZones.losAngeles)).toEqual({
      startMinute: 0,
      endMinute: 1500,
    });
  });

  it("starts at the first real minute on the Santiago gap day", () => {
    const day = daySpan("2026-09-06", testZones.santiago);
    expect(workingMinutes(day, { start: "00:00", end: "02:00" }, testZones.santiago)).toEqual({
      startMinute: 0,
      endMinute: 60,
    });
  });

  it("collapses an hour that the spring gap removes", () => {
    const day = daySpan("2026-03-08", testZones.losAngeles);
    expect(workingMinutes(day, { start: "02:00", end: "03:00" }, testZones.losAngeles)).toEqual({
      startMinute: 120,
      endMinute: 120,
    });
  });

  it("moves a clock inside the spring gap forward", () => {
    const day = daySpan("2026-03-08", testZones.losAngeles);
    expect(workingMinutes(day, { start: "02:30", end: "04:00" }, testZones.losAngeles)).toEqual({
      startMinute: 150,
      endMinute: 180,
    });
  });

  it("takes the earlier instant for an ambiguous fall clock", () => {
    const day = daySpan("2026-11-01", testZones.losAngeles);
    expect(workingMinutes(day, { start: "01:30", end: "03:00" }, testZones.losAngeles)).toEqual({
      startMinute: 90,
      endMinute: 240,
    });
  });

  it.each([
    { start: "22:00", end: "06:00" },
    { start: "09:00", end: "09:00" },
  ])("rejects a range from $start to $end", (hours) => {
    const day = daySpan("2026-11-18", testZones.losAngeles);
    expect(() => workingMinutes(day, hours, testZones.losAngeles)).toThrow(RangeError);
  });
});
