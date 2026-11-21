import {
  DragKind,
  KeyCommand,
  OccurrenceKind,
  type AllDayOccurrence,
  type CreateIntent,
  type DragIntent,
  type DragSettings,
  type DropProposal,
  type Instant,
  type MoveIntent,
  type PlainDate,
  type ResizeIntent,
  type SlotPoint,
  type TimedOccurrence,
} from "../types";
import { addDays, dateOf, daysBetween, milliseconds, startOfDay, toInstant, toWallClock } from "../time";
import { slotInstant, slotPointAt, snapMinute, snapMinuteDown, snapMinuteUp } from "./snap";

export type DateShift = {
  startDate: PlainDate;
  endDate: PlainDate;
};

type MinuteSnap = (minute: number, step: number) => number;

export function shiftAllDay(occurrence: AllDayOccurrence, intent: MoveIntent): DateShift {
  const days = daysBetween(intent.grab.date, intent.target.date);
  return { startDate: addDays(occurrence.startDate, days), endDate: addDays(occurrence.endDate, days) };
}

function snapInstant(instant: Instant, snap: MinuteSnap, step: number, timeZone: string): Instant {
  const dayStart = startOfDay(dateOf(instant, timeZone), timeZone);
  const minute = (instant - dayStart) / milliseconds.minute;
  return dayStart + snap(minute, step) * milliseconds.minute;
}

function snapPoint(point: SlotPoint, snap: MinuteSnap, step: number, timeZone: string): Instant {
  return snapInstant(slotInstant(point, timeZone), snap, step, timeZone);
}

function proposeAllDayMove(occurrence: AllDayOccurrence, intent: MoveIntent, timeZone: string): DropProposal {
  const shift = shiftAllDay(occurrence, intent);
  const start = startOfDay(shift.startDate, timeZone);
  const end = startOfDay(shift.endDate, timeZone);
  return { intent, start, end, allDay: true, resourceId: intent.target.resourceId };
}

function isSamePoint(first: SlotPoint, second: SlotPoint): boolean {
  const isSameSlot = first.date === second.date && first.minute === second.minute;
  return isSameSlot && first.resourceId === second.resourceId;
}

function snappedMoveStart(
  occurrence: TimedOccurrence,
  intent: MoveIntent,
  settings: DragSettings,
  timeZone: string,
): Instant {
  const grabOffset = occurrence.start - slotInstant(intent.grab, timeZone);
  const rawStart = slotInstant(intent.target, timeZone) + grabOffset;
  return snapInstant(rawStart, snapMinute, settings.snapMinutes, timeZone);
}

function proposeTimedMove(
  occurrence: TimedOccurrence,
  intent: MoveIntent,
  settings: DragSettings,
  timeZone: string,
): DropProposal {
  const isInPlace = isSamePoint(intent.grab, intent.target);
  const start = isInPlace ? occurrence.start : snappedMoveStart(occurrence, intent, settings, timeZone);
  const end = start + (occurrence.end - occurrence.start);
  return { intent, start, end, allDay: false, resourceId: intent.target.resourceId };
}

function proposeMove(intent: MoveIntent, settings: DragSettings, timeZone: string): DropProposal {
  const occurrence = intent.occurrence;
  if (occurrence.kind === OccurrenceKind.AllDay) {
    return proposeAllDayMove(occurrence, intent, timeZone);
  }
  return proposeTimedMove(occurrence, intent, settings, timeZone);
}

function proposeResize(intent: ResizeIntent, settings: DragSettings, timeZone: string): DropProposal {
  const start = intent.occurrence.start;
  const shortest = start + settings.minimumDurationMinutes * milliseconds.minute;
  const end = Math.max(snapPoint(intent.target, snapMinute, settings.snapMinutes, timeZone), shortest);
  return { intent, start, end, allDay: false, resourceId: intent.grab.resourceId };
}

function isClick(intent: CreateIntent): boolean {
  return intent.anchor.date === intent.target.date && intent.anchor.minute === intent.target.minute;
}

function proposeClickCreate(intent: CreateIntent, settings: DragSettings, timeZone: string): DropProposal {
  const start = snapPoint(intent.anchor, snapMinuteDown, settings.createSnapMinutes, timeZone);
  const end = start + settings.defaultDurationMinutes * milliseconds.minute;
  return { intent, start, end, allDay: false, resourceId: intent.anchor.resourceId };
}

function proposeCreate(intent: CreateIntent, settings: DragSettings, timeZone: string): DropProposal {
  if (isClick(intent)) {
    return proposeClickCreate(intent, settings, timeZone);
  }
  const step = settings.createSnapMinutes;
  const isForward = slotInstant(intent.target, timeZone) >= slotInstant(intent.anchor, timeZone);
  const earlier = isForward ? intent.anchor : intent.target;
  const later = isForward ? intent.target : intent.anchor;
  const start = snapPoint(earlier, snapMinuteDown, step, timeZone);
  const end = Math.max(snapPoint(later, snapMinuteUp, step, timeZone), start + step * milliseconds.minute);
  return { intent, start, end, allDay: false, resourceId: intent.anchor.resourceId };
}

export function proposeDrop(intent: DragIntent, settings: DragSettings, timeZone: string): DropProposal {
  if (intent.kind === DragKind.Move) {
    return proposeMove(intent, settings, timeZone);
  }
  if (intent.kind === DragKind.Resize) {
    return proposeResize(intent, settings, timeZone);
  }
  return proposeCreate(intent, settings, timeZone);
}

function moveTargetBy(intent: MoveIntent, deltaMinutes: number, timeZone: string): MoveIntent {
  const instant = slotInstant(intent.target, timeZone) + deltaMinutes * milliseconds.minute;
  return { ...intent, target: slotPointAt(instant, timeZone, intent.target) };
}

function moveTargetByDays(intent: MoveIntent, days: number, timeZone: string): MoveIntent {
  const wallClock = toWallClock(slotInstant(intent.target, timeZone), timeZone);
  const instant = toInstant({ date: addDays(wallClock.date, days), minute: wallClock.minute }, timeZone);
  return { ...intent, target: slotPointAt(instant, timeZone, intent.target) };
}

function nudgeByMinutes(intent: MoveIntent, deltaMinutes: number, timeZone: string): MoveIntent {
  const isAllDay = intent.occurrence.kind === OccurrenceKind.AllDay;
  if (isAllDay) {
    return intent;
  }
  return moveTargetBy(intent, deltaMinutes, timeZone);
}

export function nudgeIntent(
  intent: MoveIntent,
  command: KeyCommand,
  settings: DragSettings,
  timeZone: string,
): MoveIntent {
  if (command === KeyCommand.PreviousHour) {
    return nudgeByMinutes(intent, -settings.snapMinutes, timeZone);
  }
  if (command === KeyCommand.NextHour) {
    return nudgeByMinutes(intent, settings.snapMinutes, timeZone);
  }
  if (command === KeyCommand.PreviousDay) {
    return moveTargetByDays(intent, -1, timeZone);
  }
  if (command === KeyCommand.NextDay) {
    return moveTargetByDays(intent, 1, timeZone);
  }
  return intent;
}
