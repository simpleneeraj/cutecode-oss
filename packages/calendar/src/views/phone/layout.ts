import { weekInfo } from "../../locale";
import { isWeekend } from "../../range";
import { addDays, dateOf, milliseconds, parseClockTime, startOfWeek, toInstant, toWallClock } from "../../time";
import {
  TextDirection,
  ViewKind,
  type Instant,
  type InstantRange,
  type PlainDate,
  type ViewSettings,
} from "../../types";
import { weekStrip, type WeekStripDay } from "../../widgets";
import { HourZoom } from "../../parts/time-grid/props";

export const phoneLayout = {
  landscapeDays: 5,
  tabs: [ViewKind.Day, ViewKind.Month, ViewKind.Agenda],
  listTabs: [ViewKind.Month, ViewKind.Agenda],
};

const swipeThreshold = {
  distance: 60,
  velocity: 500,
};

const newEventDefaults = {
  snapMinutes: 30,
  durationMinutes: 60,
  clock: "09:00",
};

export function phoneStripDays(anchor: PlainDate, settings: ViewSettings, now: Instant | null): WeekStripDay[] {
  if (now === null) {
    return weekStrip(anchor, settings, anchor).map((day) => ({ ...day, today: false, past: false }));
  }
  return weekStrip(anchor, settings, dateOf(now, settings.timeZone));
}

export function workWeekStart(anchor: PlainDate, settings: ViewSettings): PlainDate {
  const { weekend } = weekInfo(settings.locale);
  const weekStart = startOfWeek(anchor, settings.weekStartsOn);
  const days = Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
  return days.find((date) => !isWeekend(date, weekend)) ?? weekStart;
}

export function phoneTabsOf(views: ViewKind[]): ViewKind[] {
  return phoneLayout.tabs.filter((view) => views.includes(view));
}

export function phoneTabOf(view: ViewKind): ViewKind {
  return phoneLayout.listTabs.includes(view) ? view : ViewKind.Day;
}

export function swipeStep(offset: number, velocity: number, direction: TextDirection): number {
  const isSwipe = Math.abs(offset) > swipeThreshold.distance || Math.abs(velocity) > swipeThreshold.velocity;
  if (!isSwipe) {
    return 0;
  }
  const towardStart = offset < 0 ? 1 : -1;
  return direction === TextDirection.RightToLeft ? -towardStart : towardStart;
}

function nextSnap(now: Instant, timeZone: string): Instant {
  const wall = toWallClock(now, timeZone);
  const step = newEventDefaults.snapMinutes;
  return toInstant({ date: wall.date, minute: Math.ceil(wall.minute / step) * step }, timeZone);
}

export function newEventRange(date: PlainDate, settings: ViewSettings, now: Instant | null): InstantRange {
  const isToday = now !== null && dateOf(now, settings.timeZone) === date;
  const clock = parseClockTime(settings.workingHours?.start ?? newEventDefaults.clock);
  const start = isToday ? nextSnap(now, settings.timeZone) : toInstant({ date, minute: clock }, settings.timeZone);
  return { start, end: start + newEventDefaults.durationMinutes * milliseconds.minute };
}

const zoomOrder = [HourZoom.Compact, HourZoom.Regular, HourZoom.Spacious];

const pinchThreshold = {
  grow: 1.25,
  shrink: 0.8,
};

function pinchStep(scale: number): number {
  if (scale >= pinchThreshold.grow) {
    return 1;
  }
  if (scale <= pinchThreshold.shrink) {
    return -1;
  }
  return 0;
}

export function pinchedZoom(zoom: HourZoom, scale: number): HourZoom {
  const index = zoomOrder.indexOf(zoom) + pinchStep(scale);
  return zoomOrder[Math.min(Math.max(index, 0), zoomOrder.length - 1)] ?? zoom;
}
