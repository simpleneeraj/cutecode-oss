import {
  DragKind,
  OccurrenceKind,
  RefusalReason,
  VerdictKind,
  type ClockRange,
  type ConstraintContext,
  type DragIntent,
  type DragResult,
  type DragSettings,
  type DropConstraint,
  type DropProposal,
  type DropVerdict,
  type MoveIntent,
} from "../types";
import memoizeOne from "memoize-one";
import { daysBetween, isWithinClockRange } from "../time";
import { proposeDrop } from "./propose";

const accepted: DropVerdict = { kind: VerdictKind.Accepted };

function calendarIdOf(intent: DragIntent): string {
  if (intent.kind === DragKind.Create) {
    return intent.calendarId;
  }
  return intent.occurrence.event.calendarId;
}

export const readOnlyConstraint: DropConstraint = (proposal, context) => {
  const calendarId = calendarIdOf(proposal.intent);
  const calendar = context.calendars.find((candidate) => candidate.id === calendarId);
  const isWritable = calendar?.readOnly === false;
  if (isWritable) {
    return accepted;
  }
  return { kind: VerdictKind.Refused, reason: RefusalReason.ReadOnly, calendarName: calendar?.name };
};

export function allowedHoursConstraint(hours: ClockRange): DropConstraint {
  return (proposal, context) => {
    const isAllowed = proposal.allDay || isWithinClockRange(proposal, hours, context.timeZone);
    if (isAllowed) {
      return accepted;
    }
    return { kind: VerdictKind.Refused, reason: RefusalReason.OutsideAllowedHours, allowedHours: hours };
  };
}

function isMoveUnchanged(proposal: DropProposal, intent: MoveIntent): boolean {
  const isSameResource = proposal.resourceId === intent.grab.resourceId;
  const occurrence = intent.occurrence;
  if (occurrence.kind === OccurrenceKind.AllDay) {
    return isSameResource && daysBetween(intent.grab.date, intent.target.date) === 0;
  }
  return isSameResource && proposal.start === occurrence.start && proposal.end === occurrence.end;
}

function isUnchanged(proposal: DropProposal): boolean {
  const intent = proposal.intent;
  if (intent.kind === DragKind.Create) {
    return false;
  }
  if (intent.kind === DragKind.Move) {
    return isMoveUnchanged(proposal, intent);
  }
  return proposal.end === intent.occurrence.end;
}

export const unchangedConstraint: DropConstraint = (proposal) => {
  const isChanged = !isUnchanged(proposal);
  if (isChanged) {
    return accepted;
  }
  return { kind: VerdictKind.Refused, reason: RefusalReason.Unchanged };
};

const coreConstraints: DropConstraint[] = [readOnlyConstraint, unchangedConstraint];

function firstRefusal(proposal: DropProposal, context: ConstraintContext, constraints: DropConstraint[]): DropVerdict {
  for (const constraint of constraints) {
    const verdict = constraint(proposal, context);
    if (verdict.kind === VerdictKind.Refused) {
      return verdict;
    }
  }
  return accepted;
}

export function checkDrop(
  proposal: DropProposal,
  context: ConstraintContext,
  constraints: DropConstraint[],
): DropVerdict {
  const coreVerdict = firstRefusal(proposal, context, coreConstraints);
  if (coreVerdict.kind === VerdictKind.Refused) {
    return coreVerdict;
  }
  return firstRefusal(proposal, context, constraints);
}

const settingsConstraints = memoizeOne((allowedHours: ClockRange | undefined): DropConstraint[] => {
  if (allowedHours === undefined) {
    return [];
  }
  return [allowedHoursConstraint(allowedHours)];
});

function verdictOf(
  proposal: DropProposal,
  settings: DragSettings,
  context: ConstraintContext,
  constraints: DropConstraint[],
): DropVerdict {
  const settingsVerdict = checkDrop(proposal, context, settingsConstraints(settings.allowedHours));
  if (settingsVerdict.kind === VerdictKind.Refused) {
    return settingsVerdict;
  }
  return firstRefusal(proposal, context, constraints);
}

export function resolveDrop(
  intent: DragIntent,
  settings: DragSettings,
  context: ConstraintContext,
  constraints: DropConstraint[],
): DragResult {
  const proposal = proposeDrop(intent, settings, context.timeZone);
  const verdict = verdictOf(proposal, settings, context, constraints);
  if (verdict.kind === VerdictKind.Accepted) {
    return { kind: VerdictKind.Accepted, proposal };
  }
  return { kind: VerdictKind.Refused, proposal, verdict };
}
