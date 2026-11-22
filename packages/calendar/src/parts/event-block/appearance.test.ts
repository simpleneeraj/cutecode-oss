import { describe, expect, it } from "vitest";
import { layoutTimedColumns } from "../../layout/timed";
import { makeCalendar, makeEvent, makeOccurrence, makeSettings, instantAt, testZones } from "../../testing";
import { daySpan } from "../../time";
import { Attendance, CalendarTone, EventStatus, type CalendarEvent, type PlainDate, type TimedBox } from "../../types";
import { blockAppearance, BlockCorners, BlockSize, BlockStatus, blockStatus, type BlockView } from "./appearance";

const settings = makeSettings();
const work = makeCalendar();
const view: BlockView = { settings, now: null, hourHeight: 64 };

function boxesOf(overrides: Partial<CalendarEvent>, date: PlainDate = "2026-11-18"): TimedBox[] {
  const options = { maxColumns: 3, minimumMinutes: 0, columnKey: date, timeZone: testZones.losAngeles };
  const columns = layoutTimedColumns([makeOccurrence(overrides)], [daySpan(date, testZones.losAngeles)], options);
  return columns.flatMap((column) => column.boxes);
}

function firstBox(overrides: Partial<CalendarEvent> = {}, date?: PlainDate): TimedBox {
  const [box] = boxesOf(overrides, date);
  if (!box) {
    throw new Error("No box laid out");
  }
  return box;
}

describe("blockStatus", () => {
  it("prefers cancelled over a declined viewer", () => {
    const event = makeEvent({
      status: EventStatus.Cancelled,
      attendees: [{ id: "me", name: "Me", attendance: Attendance.Declined }],
    });
    expect(blockStatus(event, "me")).toBe(BlockStatus.Cancelled);
  });

  it("reads declined from the viewer only", () => {
    const event = makeEvent({ attendees: [{ id: "someone", name: "Someone", attendance: Attendance.Declined }] });
    expect(blockStatus(event, "me")).toBe(BlockStatus.Confirmed);
    expect(blockStatus(event, "someone")).toBe(BlockStatus.Declined);
  });

  it("keeps tentative", () => {
    expect(blockStatus(makeEvent({ status: EventStatus.Tentative }), undefined)).toBe(BlockStatus.Tentative);
  });
});

describe("blockAppearance", () => {
  it("uses the calendar tone for a confirmed hour block", () => {
    const appearance = blockAppearance(firstBox(), work, view);
    expect(appearance).toMatchObject({
      tone: CalendarTone.Accent,
      status: BlockStatus.Confirmed,
      corners: BlockCorners.Round,
      size: BlockSize.Tall,
      isPast: false,
      isReadOnly: false,
      label: "Design crit, Wednesday, November 18, 10 AM to 11 AM",
    });
  });

  it("draws cancelled grey and declined as a line", () => {
    const cancelled = firstBox({ status: EventStatus.Cancelled });
    const declined = firstBox({ attendees: [{ id: "me", name: "Me", attendance: Attendance.Declined }] });
    expect(blockAppearance(cancelled, work, view).tone).toBe(CalendarTone.Grey);
    expect(blockAppearance(declined, work, { ...view, viewerId: "me" })).toMatchObject({
      tone: CalendarTone.Line,
      label: "Design crit, Wednesday, November 18, 10 AM to 11 AM, declined",
    });
  });

  it("clamps short blocks to one line by height", () => {
    const quarter = firstBox({ end: "2026-11-18T10:15:00-08:00" });
    expect(blockAppearance(quarter, work, view).size).toBe(BlockSize.Short);
    expect(blockAppearance(quarter, work, { ...view, hourHeight: 192 }).size).toBe(BlockSize.Tall);
  });

  it("squares the cut corners of a block crossing midnight", () => {
    const overnight = { start: "2026-11-18T22:00:00-08:00", end: "2026-11-19T02:00:00-08:00" };
    expect(blockAppearance(firstBox(overnight, "2026-11-18"), work, view).corners).toBe(BlockCorners.SquareBottom);
    expect(blockAppearance(firstBox(overnight, "2026-11-19"), work, view).corners).toBe(BlockCorners.SquareTop);
  });

  it("dims finished events and a passed deadline marker", () => {
    const now = instantAt("2026-11-18", "10:30");
    expect(blockAppearance(firstBox(), work, { ...view, now }).isPast).toBe(false);
    expect(blockAppearance(firstBox({ end: "2026-11-18T10:00:00-08:00" }), work, { ...view, now }).isPast).toBe(true);
    expect(blockAppearance(firstBox({ end: "2026-11-18T10:30:00-08:00" }), work, { ...view, now }).isPast).toBe(true);
  });

  it("treats an unknown calendar as read only", () => {
    expect(blockAppearance(firstBox(), undefined, view)).toMatchObject({ isReadOnly: true, tone: CalendarTone.Grey });
  });

  it("marks an edit waiting to sync in the state and the name", () => {
    const pending = { ...view, pendingEventIds: new Set(["design-crit"]) };
    expect(blockAppearance(firstBox(), work, pending)).toMatchObject({
      isPending: true,
      label: "Design crit, Wednesday, November 18, 10 AM to 11 AM, waiting to sync",
    });
    expect(blockAppearance(firstBox(), work, view).isPending).toBe(false);
  });
});
