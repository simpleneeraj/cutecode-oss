import { slotPointAt } from "../../drag";
import { addDays, daysBetween, toInstant, toWallClock } from "../../time";
import {
  ChangeSource,
  DragKind,
  OccurrenceKind,
  type EventOccurrence,
  type MoveIntent,
  MoveStep,
  type PlainDate,
  type SlotPoint,
} from "../../types";

export const monthColumnKey = "month";

function dayPoint(date: PlainDate): SlotPoint {
  return { date, minute: 0, columnKey: monthColumnKey };
}

export function monthMoveIntent(
  occurrence: EventOccurrence,
  grab: PlainDate,
  target: PlainDate,
  timeZone: string,
): MoveIntent {
  const intent: MoveIntent = {
    kind: DragKind.Move,
    source: ChangeSource.Drag,
    occurrence,
    grab: dayPoint(grab),
    target: dayPoint(target),
    step: MoveStep.Day,
  };
  if (occurrence.kind === OccurrenceKind.AllDay) {
    return intent;
  }
  const wall = toWallClock(occurrence.start, timeZone);
  const moved = toInstant({ date: addDays(wall.date, daysBetween(grab, target)), minute: wall.minute }, timeZone);
  return {
    ...intent,
    grab: slotPointAt(occurrence.start, timeZone, intent.grab),
    target: slotPointAt(moved, timeZone, intent.target),
  };
}
