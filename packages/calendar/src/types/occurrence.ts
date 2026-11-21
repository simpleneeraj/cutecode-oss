import type { CalendarEvent, Instant, IsoDateTime, PlainDate } from "./model";

export enum OccurrenceKind {
  Timed = "timed",
  AllDay = "allDay",
}

type OccurrenceBase = {
  key: string;
  event: CalendarEvent;
  originalStart: IsoDateTime;
};

export type TimedOccurrence = OccurrenceBase & {
  kind: OccurrenceKind.Timed;
  start: Instant;
  end: Instant;
};

export type AllDayOccurrence = OccurrenceBase & {
  kind: OccurrenceKind.AllDay;
  startDate: PlainDate;
  endDate: PlainDate;
};

export type EventOccurrence = TimedOccurrence | AllDayOccurrence;
