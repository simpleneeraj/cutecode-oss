import { eventAccessibleName } from "../../announce";
import { occurrenceInterval } from "../../event";
import { minutes } from "../../time";
import {
  Attendance,
  CalendarTone,
  EventStatus,
  type Calendar,
  type CalendarEvent,
  type EventOccurrence,
  type Instant,
  type TimedBox,
  type ViewSettings,
} from "../../types";

export enum BlockStatus {
  Confirmed = "confirmed",
  Tentative = "tentative",
  Declined = "declined",
  Cancelled = "cancelled",
}

export enum BlockCorners {
  Round = "round",
  SquareTop = "squareTop",
  SquareBottom = "squareBottom",
  Square = "square",
}

export enum BlockSize {
  Short = "short",
  Tall = "tall",
}

export type BlockView = {
  settings: ViewSettings;
  now: Instant | null;
  hourHeight: number;
  viewerId?: string;
  pendingEventIds?: ReadonlySet<string>;
};

export type OccurrenceAppearance = {
  tone: CalendarTone;
  status: BlockStatus;
  isPast: boolean;
  isReadOnly: boolean;
  isPending: boolean;
  label: string;
};

export type BlockAppearance = OccurrenceAppearance & {
  corners: BlockCorners;
  size: BlockSize;
};

const pendingWords = ", waiting to sync";

const blockLimits = {
  tallHeight: 40,
};

export const statusWords: Record<BlockStatus, string> = {
  [BlockStatus.Confirmed]: "",
  [BlockStatus.Tentative]: "Tentative",
  [BlockStatus.Declined]: "Declined",
  [BlockStatus.Cancelled]: "Cancelled",
};

const statusTones: Partial<Record<BlockStatus, CalendarTone>> = {
  [BlockStatus.Declined]: CalendarTone.Line,
  [BlockStatus.Cancelled]: CalendarTone.Grey,
};

function hasDeclined(event: CalendarEvent, viewerId: string | undefined): boolean {
  const viewer = event.attendees?.find((attendee) => attendee.id === viewerId);
  return viewer?.attendance === Attendance.Declined;
}

export function blockStatus(event: CalendarEvent, viewerId: string | undefined): BlockStatus {
  if (event.status === EventStatus.Cancelled) {
    return BlockStatus.Cancelled;
  }
  const isDeclined = hasDeclined(event, viewerId);
  if (isDeclined) {
    return BlockStatus.Declined;
  }
  if (event.status === EventStatus.Tentative) {
    return BlockStatus.Tentative;
  }
  return BlockStatus.Confirmed;
}

export function blockCorners(box: TimedBox): BlockCorners {
  if (box.continuesBefore && box.continuesAfter) {
    return BlockCorners.Square;
  }
  if (box.continuesBefore) {
    return BlockCorners.SquareTop;
  }
  if (box.continuesAfter) {
    return BlockCorners.SquareBottom;
  }
  return BlockCorners.Round;
}

export function blockSize(box: TimedBox, hourHeight: number): BlockSize {
  const height = ((box.endMinute - box.startMinute) * hourHeight) / minutes.hour;
  return height >= blockLimits.tallHeight ? BlockSize.Tall : BlockSize.Short;
}

function isOver(occurrence: EventOccurrence, isMarker: boolean, view: BlockView): boolean {
  if (view.now === null) {
    return false;
  }
  const { start, end } = occurrenceInterval(occurrence, view.settings.timeZone);
  const finish = isMarker ? start : end;
  return finish <= view.now;
}

function isPendingSync(event: CalendarEvent, view: BlockView): boolean {
  return view.pendingEventIds?.has(event.id) ?? false;
}

export function occurrenceLabel(occurrence: EventOccurrence, calendar: Calendar | undefined, view: BlockView): string {
  const name = eventAccessibleName(occurrence, calendar, view.settings);
  const isDeclined = hasDeclined(occurrence.event, view.viewerId);
  const label = isDeclined ? `${name}, declined` : name;
  return isPendingSync(occurrence.event, view) ? `${label}${pendingWords}` : label;
}

export function occurrenceAppearance(
  occurrence: EventOccurrence,
  calendar: Calendar | undefined,
  view: BlockView,
  isMarker: boolean,
): OccurrenceAppearance {
  const status = blockStatus(occurrence.event, view.viewerId);
  return {
    tone: statusTones[status] ?? calendar?.tone ?? CalendarTone.Grey,
    status,
    isPast: isOver(occurrence, isMarker, view),
    isReadOnly: calendar?.readOnly ?? true,
    isPending: isPendingSync(occurrence.event, view),
    label: occurrenceLabel(occurrence, calendar, view),
  };
}

export function blockAppearance(box: TimedBox, calendar: Calendar | undefined, view: BlockView): BlockAppearance {
  return {
    ...occurrenceAppearance(box.occurrence, calendar, view, box.marker),
    corners: blockCorners(box),
    size: blockSize(box, view.hourHeight),
  };
}
