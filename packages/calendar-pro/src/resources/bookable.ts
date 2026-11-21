import { isWithinClockRange } from "@cutecode/calendar/time";
import { RefusalReason, VerdictKind, type DropConstraint, type DropVerdict } from "@cutecode/calendar/types";

const accepted: DropVerdict = { kind: VerdictKind.Accepted };

export const bookableHoursConstraint: DropConstraint = (proposal, context) => {
  if (proposal.allDay) {
    return accepted;
  }
  const resource = context.resources.find((candidate) => candidate.id === proposal.resourceId);
  const hours = resource?.bookableHours;
  if (hours === undefined) {
    return accepted;
  }
  const timeZone = resource?.timeZone ?? context.timeZone;
  if (isWithinClockRange(proposal, hours, timeZone)) {
    return accepted;
  }
  return { kind: VerdictKind.Refused, reason: RefusalReason.OutsideBookableHours, allowedHours: hours };
};
