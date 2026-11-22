import { formatClock, formatPlainDate, formatTime, formatTimeRange } from "../../locale";
import { dateOf } from "../../time";
import {
  AnnouncementKind,
  DragKind,
  RefusalReason,
  VerdictKind,
  type Announcement,
  type DragResult,
  type ViewSettings,
} from "../../types";

export enum TipIcon {
  Grab = "grab",
  Clock = "clock",
  Refused = "refused",
  Lock = "lock",
}

export type DragTip = {
  text: string;
  icon: TipIcon;
};

const refusalTips: Record<RefusalReason, string> = {
  [RefusalReason.ReadOnly]: "Read only",
  [RefusalReason.OutsideBookableHours]: "Outside bookable hours",
  [RefusalReason.OutsideAllowedHours]: "Outside allowed hours",
  [RefusalReason.TooShort]: "Too short",
  [RefusalReason.Unchanged]: "",
};

const tipCopy = {
  readOnly: (calendarName: string) => `${calendarName} is read only`,
  outside: (start: string, end: string) => `Outside ${start} to ${end}`,
  ends: (time: string) => `Ends ${time}`,
  allDay: "all day",
  fallbackCalendar: "This calendar",
};

export function isRefusal(result: DragResult): boolean {
  return result.kind === VerdictKind.Refused && result.verdict.reason !== RefusalReason.Unchanged;
}

function refusalTip(result: Extract<DragResult, { kind: VerdictKind.Refused }>, settings: ViewSettings): DragTip {
  const { reason, allowedHours, calendarName } = result.verdict;
  if (reason === RefusalReason.ReadOnly) {
    return { text: tipCopy.readOnly(calendarName ?? tipCopy.fallbackCalendar), icon: TipIcon.Lock };
  }
  if (allowedHours !== undefined) {
    const text = tipCopy.outside(formatClock(allowedHours.start, settings), formatClock(allowedHours.end, settings));
    return { text, icon: TipIcon.Refused };
  }
  return { text: refusalTips[reason], icon: TipIcon.Refused };
}

function placeTip(result: DragResult, settings: ViewSettings): DragTip {
  const { proposal } = result;
  const kind = proposal.intent.kind;
  if (kind === DragKind.Resize) {
    return { text: tipCopy.ends(formatTime(proposal.end, settings)), icon: TipIcon.Clock };
  }
  if (kind === DragKind.Create) {
    return { text: formatTimeRange(proposal.start, proposal.end, settings), icon: TipIcon.Clock };
  }
  const weekday = formatPlainDate(dateOf(proposal.start, settings.timeZone), settings, { weekday: "short" });
  const when = proposal.allDay ? tipCopy.allDay : formatTimeRange(proposal.start, proposal.end, settings);
  return { text: `${weekday}, ${when}`, icon: TipIcon.Grab };
}

export function dragTip(result: DragResult, settings: ViewSettings): DragTip {
  if (result.kind === VerdictKind.Refused && isRefusal(result)) {
    return refusalTip(result, settings);
  }
  return placeTip(result, settings);
}

function acceptedAnnouncement(result: DragResult): Announcement | null {
  const { intent, start, end, allDay } = result.proposal;
  if (intent.kind === DragKind.Create) {
    return null;
  }
  const title = intent.occurrence.event.title;
  if (intent.kind === DragKind.Resize) {
    return { kind: AnnouncementKind.Resized, title, end };
  }
  return { kind: AnnouncementKind.Moved, title, start, end, allDay };
}

export function readOnlyAnnouncement(result: DragResult): Announcement | null {
  const { intent } = result.proposal;
  if (result.kind !== VerdictKind.Refused || !isReadOnlyRefusal(result) || intent.kind === DragKind.Create) {
    return null;
  }
  const calendarName = result.verdict.calendarName ?? tipCopy.fallbackCalendar;
  return { kind: AnnouncementKind.ReadOnly, title: intent.occurrence.event.title, calendarName };
}

export function dropAnnouncement(result: DragResult): Announcement | null {
  if (result.kind === VerdictKind.Accepted) {
    return acceptedAnnouncement(result);
  }
  const { reason, allowedHours } = result.verdict;
  if (reason === RefusalReason.Unchanged || reason === RefusalReason.ReadOnly) {
    return null;
  }
  return { kind: AnnouncementKind.Refused, reason, allowedHours };
}

export function isReadOnlyRefusal(result: DragResult): boolean {
  return result.kind === VerdictKind.Refused && result.verdict.reason === RefusalReason.ReadOnly;
}
