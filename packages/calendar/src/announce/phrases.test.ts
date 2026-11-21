import { describe, expect, it } from "vitest";
import { instantAt, makeSettings, testZones } from "../testing";
import { AnnouncementKind, HourCycle, RefusalReason, ViewKind, Weekday } from "../types";
import { announce } from "./phrases";

const settings = makeSettings();

describe("announce, spec phrases", () => {
  it("names the view", () => {
    expect(announce({ kind: AnnouncementKind.ViewChanged, view: ViewKind.Week }, settings)).toBe("Week view.");
  });

  it("names the week on navigation", () => {
    const navigated = { kind: AnnouncementKind.Navigated, view: ViewKind.Week, anchor: "2026-11-15" } as const;
    expect(announce(navigated, settings)).toBe("Week of November 15.");
  });

  it("names the focused slot and its event count", () => {
    const focus = {
      kind: AnnouncementKind.FocusMoved,
      instant: instantAt("2026-11-18", "10:00"),
      allDay: false,
      eventCount: 2,
    } as const;
    expect(announce(focus, settings)).toBe("Wednesday, November 18, 10 AM. 2 events.");
  });

  it("says where an event moved", () => {
    const moved = {
      kind: AnnouncementKind.Moved,
      title: "Design crit",
      start: instantAt("2026-11-19", "11:00"),
      end: instantAt("2026-11-19", "12:00"),
      allDay: false,
    } as const;
    expect(announce(moved, settings)).toBe("Moved Design crit to Thursday, 11 AM to 12 PM.");
  });

  it("says the new end after a resize", () => {
    const resized = {
      kind: AnnouncementKind.Resized,
      title: "Roadmap sync",
      end: instantAt("2026-11-18", "12:45"),
    } as const;
    expect(announce(resized, settings)).toBe("Roadmap sync now ends at 12:45 PM.");
  });

  it("explains a refused drop with the allowed hours", () => {
    const refused = {
      kind: AnnouncementKind.Refused,
      reason: RefusalReason.OutsideAllowedHours,
      allowedHours: { start: "07:00", end: "19:00" },
    } as const;
    expect(announce(refused, settings)).toBe("Can't move there. Hours are 7 AM to 7 PM. It went back.");
  });

  it("names a read-only calendar", () => {
    const readOnly = { kind: AnnouncementKind.ReadOnly, title: "Thanksgiving", calendarName: "US holidays" } as const;
    expect(announce(readOnly, settings)).toBe("Thanksgiving is on US holidays, which is read only.");
  });

  it("offers undo after a delete", () => {
    const deleted = { kind: AnnouncementKind.Deleted, title: "Design crit" } as const;
    expect(announce(deleted, settings)).toBe("Deleted Design crit. Press Command Z to undo.");
  });

  it("says a calendar was hidden or shown", () => {
    const hidden = { kind: AnnouncementKind.CalendarToggled, calendarName: "Family", visible: false } as const;
    expect(announce(hidden, settings)).toBe("Family hidden.");
    expect(announce({ ...hidden, visible: true }, settings)).toBe("Family shown.");
  });
});

describe("announce, moves across midnight", () => {
  const moved = { kind: AnnouncementKind.Moved, title: "Late deploy", allDay: false } as const;

  it("names the end day when a move crosses midnight", () => {
    const crossing = { ...moved, start: instantAt("2026-11-18", "22:00"), end: instantAt("2026-11-19", "01:00") };
    expect(announce(crossing, settings)).toBe("Moved Late deploy to Wednesday, 10 PM to Thursday, 1 AM.");
  });

  it("keeps one day when a move ends at midnight", () => {
    const toMidnight = { ...moved, start: instantAt("2026-11-18", "22:00"), end: instantAt("2026-11-19", "00:00") };
    expect(announce(toMidnight, settings)).toBe("Moved Late deploy to Wednesday, 10 PM to 12 AM.");
  });
});

describe("announce, other cases", () => {
  it("names every view", () => {
    const names = [ViewKind.Day, ViewKind.Month, ViewKind.Year, ViewKind.Agenda].map((view) =>
      announce({ kind: AnnouncementKind.ViewChanged, view }, settings),
    );
    expect(names).toEqual(["Day view.", "Month view.", "Year view.", "Agenda view."]);
  });

  it("names day, month, year and agenda navigation", () => {
    const navigate = (view: ViewKind) =>
      announce({ kind: AnnouncementKind.Navigated, view, anchor: "2026-11-18" }, settings);
    expect(navigate(ViewKind.Day)).toBe("Wednesday, November 18.");
    expect(navigate(ViewKind.Month)).toBe("November 2026.");
    expect(navigate(ViewKind.Year)).toBe("2026.");
    expect(navigate(ViewKind.Agenda)).toBe("Agenda from Wednesday, November 18.");
  });

  it("counts zero and one event", () => {
    const focus = {
      kind: AnnouncementKind.FocusMoved,
      instant: instantAt("2026-11-18", "09:30"),
      allDay: false,
    } as const;
    expect(announce({ ...focus, eventCount: 0 }, settings)).toBe("Wednesday, November 18, 9:30 AM. No events.");
    expect(announce({ ...focus, eventCount: 1 }, settings)).toBe("Wednesday, November 18, 9:30 AM. 1 event.");
  });

  it("says all day for the all-day row", () => {
    const focus = {
      kind: AnnouncementKind.FocusMoved,
      instant: instantAt("2026-11-18", "00:00"),
      allDay: true,
      eventCount: 1,
    } as const;
    expect(announce(focus, settings)).toBe("Wednesday, November 18, all day. 1 event.");
  });

  it("says all day for an all-day move", () => {
    const moved = {
      kind: AnnouncementKind.Moved,
      title: "Trip",
      start: instantAt("2026-11-20", "00:00"),
      end: instantAt("2026-11-23", "00:00"),
      allDay: true,
    } as const;
    expect(announce(moved, settings)).toBe("Moved Trip to Friday, all day.");
  });

  it("uses the view zone for the moved day", () => {
    const moved = {
      kind: AnnouncementKind.Moved,
      title: "Design crit",
      start: instantAt("2026-11-19", "11:00"),
      end: instantAt("2026-11-19", "12:00"),
      allDay: false,
    } as const;
    const tokyo = makeSettings({ timeZone: testZones.tokyo });
    expect(announce(moved, tokyo)).toBe("Moved Design crit to Friday, 4 AM to 5 AM.");
  });

  it("uses 24 hour time when the settings ask for it", () => {
    const refused = {
      kind: AnnouncementKind.Refused,
      reason: RefusalReason.OutsideBookableHours,
      allowedHours: { start: "08:00", end: "18:00" },
    } as const;
    const twentyFour = makeSettings({ hourCycle: HourCycle.TwentyFour, weekStartsOn: Weekday.Monday });
    expect(announce(refused, twentyFour)).toBe("Can't move there. Hours are 08:00 to 18:00. It went back.");
  });

  it("gives the reason when there are no hours to name", () => {
    const refuse = (reason: RefusalReason) => announce({ kind: AnnouncementKind.Refused, reason }, settings);
    expect(refuse(RefusalReason.ReadOnly)).toBe("Can't move there. It's read only. It went back.");
    expect(refuse(RefusalReason.TooShort)).toBe("Can't move there. It would be too short. It went back.");
    expect(refuse(RefusalReason.Unchanged)).toBe("Can't move there. Nothing changed. It went back.");
    expect(refuse(RefusalReason.OutsideBookableHours)).toBe(
      "Can't move there. It's outside the bookable hours. It went back.",
    );
  });
});
