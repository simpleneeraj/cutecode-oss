import {
  DragKind,
  OccurrenceKind,
  type ChangeScope,
  type DropProposal,
  type EventChange,
  type MoveIntent,
  type ResizeIntent,
} from "../types";
import { formatDateTime } from "../time";
import { shiftAllDay } from "./propose";

export type ChangeProposal = DropProposal & {
  intent: MoveIntent | ResizeIntent;
};

export function isChangeProposal(proposal: DropProposal): proposal is ChangeProposal {
  return proposal.intent.kind !== DragKind.Create;
}

function changedTimes(proposal: ChangeProposal): { start: string; end: string } {
  const intent = proposal.intent;
  const occurrence = intent.occurrence;
  const isAllDayMove = intent.kind === DragKind.Move && occurrence.kind === OccurrenceKind.AllDay;
  if (isAllDayMove) {
    const shift = shiftAllDay(occurrence, intent);
    return { start: shift.startDate, end: shift.endDate };
  }
  const timeZone = occurrence.event.timeZone;
  return { start: formatDateTime(proposal.start, timeZone), end: formatDateTime(proposal.end, timeZone) };
}

export function toEventChange(proposal: ChangeProposal, scope: ChangeScope): EventChange {
  const occurrence = proposal.intent.occurrence;
  return {
    eventId: occurrence.event.id,
    originalStart: occurrence.originalStart,
    ...changedTimes(proposal),
    allDay: proposal.allDay,
    resourceId: proposal.intent.kind === DragKind.Move ? proposal.resourceId : undefined,
    scope,
    source: proposal.intent.source,
  };
}
