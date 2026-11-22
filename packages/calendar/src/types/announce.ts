import type { ClockRange, Instant, PlainDate } from "./model";
import type { RefusalReason } from "./interaction";
import type { ViewKind } from "./view";

export enum AnnouncementKind {
  ViewChanged = "viewChanged",
  Navigated = "navigated",
  FocusMoved = "focusMoved",
  DayFocused = "dayFocused",
  Moved = "moved",
  Resized = "resized",
  Refused = "refused",
  CreateRefused = "createRefused",
  ReadOnly = "readOnly",
  Deleted = "deleted",
  CalendarToggled = "calendarToggled",
  PickedUp = "pickedUp",
  Carried = "carried",
  DropCancelled = "dropCancelled",
  Duplicated = "duplicated",
  Undone = "undone",
}

export type Announcement =
  | { kind: AnnouncementKind.ViewChanged; view: ViewKind }
  | { kind: AnnouncementKind.Navigated; view: ViewKind; anchor: PlainDate }
  | { kind: AnnouncementKind.FocusMoved; instant: Instant; allDay: boolean; eventCount: number }
  | { kind: AnnouncementKind.DayFocused; date: PlainDate; eventCount: number }
  | { kind: AnnouncementKind.Moved; title: string; start: Instant; end: Instant; allDay: boolean }
  | { kind: AnnouncementKind.Resized; title: string; end: Instant }
  | { kind: AnnouncementKind.Refused; reason: RefusalReason; allowedHours?: ClockRange }
  | { kind: AnnouncementKind.CreateRefused; reason: RefusalReason; allowedHours?: ClockRange }
  | { kind: AnnouncementKind.ReadOnly; title: string; calendarName: string }
  | { kind: AnnouncementKind.Deleted; title: string }
  | { kind: AnnouncementKind.CalendarToggled; calendarName: string; visible: boolean }
  | { kind: AnnouncementKind.PickedUp; title: string; start: Instant; end: Instant; allDay: boolean }
  | { kind: AnnouncementKind.Carried; start: Instant; end: Instant; allDay: boolean; isAllowed: boolean }
  | { kind: AnnouncementKind.DropCancelled; title: string }
  | { kind: AnnouncementKind.Duplicated; title: string }
  | { kind: AnnouncementKind.Undone };
