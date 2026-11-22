import { slotPointAt } from "../../drag";
import { dateOf } from "../../time";
import {
  AnnouncementKind,
  ChangeSource,
  DragKind,
  OccurrenceKind,
  RefusalReason,
  VerdictKind,
  type Announcement,
  type DragResult,
  type EventOccurrence,
  type KeyCommand,
  type MoveIntent,
  type PlainDate,
} from "../../types";
import { dayColumnKey } from "../time-grid/focus";
import { isRefusal } from "./feedback";
import type { DropCell } from "./source";
import type { DragSession, DropFlow } from "./use-drop-flow";
import { glideElement, restPose, type Pose } from "./visual";

export type Carry = {
  intent: MoveIntent;
  session: DragSession;
  glide: ReturnType<typeof glideElement>;
  canReach: (intent: MoveIntent) => boolean;
  nudge?: (intent: MoveIntent, command: KeyCommand) => MoveIntent;
  poseOf: (session: DragSession) => Pose;
};

type CarryStart = {
  occurrence: EventOccurrence;
  element: HTMLElement;
  origin: DropCell;
  gridId: string;
  flow: DropFlow;
};

export type ColumnPoint = {
  columnKey: string;
  resourceId?: string;
};

const dayColumnPoint: ColumnPoint = { columnKey: dayColumnKey };

export function dayMoveIntent(occurrence: EventOccurrence, date: PlainDate, column = dayColumnPoint): MoveIntent {
  const point = { ...column, date, minute: 0 };
  return { kind: DragKind.Move, source: ChangeSource.Keyboard, occurrence, grab: point, target: point };
}

export function carryIntentAt(
  occurrence: EventOccurrence,
  date: PlainDate,
  timeZone: string,
  column = dayColumnPoint,
): MoveIntent {
  const intent = dayMoveIntent(occurrence, date, column);
  if (occurrence.kind !== OccurrenceKind.Timed) {
    return intent;
  }
  const grab = slotPointAt(occurrence.start, timeZone, intent.grab);
  return { ...intent, grab, target: grab };
}

export function carrySessionOf({ occurrence, element, origin, gridId, flow }: CarryStart, intent: MoveIntent): DragSession {
  return {
    source: { gridId, key: occurrence.key, date: origin.date, kind: DragKind.Move },
    element,
    origin,
    originRect: origin.element.getBoundingClientRect(),
    pointer: { x: 0, y: 0 },
    home: { top: element.offsetTop, height: element.offsetHeight },
    occurrence,
    grab: intent.grab,
    target: origin,
    pose: restPose,
    blockSize: element.style.blockSize,
    result: flow.resolve(intent),
    unclip: () => undefined,
    onEnd: () => undefined,
  };
}

export function isUnchanged(result: DragResult): boolean {
  return result.kind === VerdictKind.Refused && result.verdict.reason === RefusalReason.Unchanged;
}

export function pickedUpAnnouncement(occurrence: EventOccurrence, result: DragResult): Announcement {
  const { start, end, allDay } = result.proposal;
  return { kind: AnnouncementKind.PickedUp, title: occurrence.event.title, start, end, allDay };
}

export function carriedAnnouncement(result: DragResult): Announcement {
  const { start, end, allDay } = result.proposal;
  return { kind: AnnouncementKind.Carried, start, end, allDay, isAllowed: !isRefusal(result) };
}

export function movedSelector(session: DragSession, timeZone: string): { date: PlainDate; prefix: string } {
  const { event } = session.occurrence;
  const date = dateOf(session.result.proposal.start, timeZone);
  return { date, prefix: CSS.escape(`${event.seriesId ?? event.id}@`) };
}
