import type { ClockRange, Instant, PlainDate } from "./model";
import type { RefusalReason } from "./interaction";
import type { ViewKind } from "./view";

export enum AnnouncementKind {
  ViewChanged = "viewChanged",
  Navigated = "navigated",
  FocusMoved = "focusMoved",
  Moved = "moved",
  Resized = "resized",
  Refused = "refused",
  ReadOnly = "readOnly",
  Deleted = "deleted",
  CalendarToggled = "calendarToggled",
}

export type Announcement =
  | { kind: AnnouncementKind.ViewChanged; view: ViewKind }
  | { kind: AnnouncementKind.Navigated; view: ViewKind; anchor: PlainDate }
  | { kind: AnnouncementKind.FocusMoved; instant: Instant; allDay: boolean; eventCount: number }
  | { kind: AnnouncementKind.Moved; title: string; start: Instant; end: Instant; allDay: boolean }
  | { kind: AnnouncementKind.Resized; title: string; end: Instant }
  | { kind: AnnouncementKind.Refused; reason: RefusalReason; allowedHours?: ClockRange }
  | { kind: AnnouncementKind.ReadOnly; title: string; calendarName: string }
  | { kind: AnnouncementKind.Deleted; title: string }
  | { kind: AnnouncementKind.CalendarToggled; calendarName: string; visible: boolean };
