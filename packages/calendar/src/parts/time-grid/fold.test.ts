import { describe, expect, it } from "vitest";
import { instantAt, makeEvent, makeSettings, testZones } from "../../testing";
import { daySpan } from "../../time";
import { OccurrenceKind, type Instant, type TimedOccurrence } from "../../types";
import { FoldEdge, foldPills } from "./fold";

const zone = testZones.losAngeles;
const date = "2026-11-18";
const settings = makeSettings();
const shownHours = { start: "08:00", end: "20:00" };

function timed(start: Instant, end: Instant): TimedOccurrence {
  return { kind: OccurrenceKind.Timed, key: `slot-${start}`, event: makeEvent(), originalStart: "", start, end };
}

const occurrences = [
  timed(instantAt(date, "06:30"), instantAt(date, "07:00")),
  timed(instantAt(date, "07:00"), instantAt(date, "07:30")),
  timed(instantAt(date, "21:00"), instantAt(date, "22:00")),
];

function pillsWith(open = { earlier: false, later: false }) {
  return foldPills({ days: [daySpan(date, zone)], shownHours, occurrences, settings, open });
}

describe("foldPills", () => {
  it("counts the folded events with the outermost time", () => {
    expect(pillsWith()).toEqual([
      { edge: FoldEdge.Earlier, label: "2 earlier, from 6:30 AM", isOpen: false },
      { edge: FoldEdge.Later, label: "1 later, until 10 PM", isOpen: false },
    ]);
  });

  it("offers to hide an open edge", () => {
    const [earlier] = pillsWith({ earlier: true, later: false });
    expect(earlier?.label).toBe("Hide earlier hours");
  });

  it("still lets quiet edges open", () => {
    const pills = foldPills({
      days: [daySpan(date, zone)],
      shownHours,
      occurrences: [],
      settings,
      open: { earlier: false, later: false },
    });
    expect(pills.map((pill) => pill.label)).toEqual(["Earlier hours", "Later hours"]);
  });

  it("has no pills when every hour is shown", () => {
    expect(
      foldPills({
        days: [daySpan(date, zone)],
        shownHours: undefined,
        occurrences,
        settings,
        open: { earlier: false, later: false },
      }),
    ).toEqual([]);
  });
});
