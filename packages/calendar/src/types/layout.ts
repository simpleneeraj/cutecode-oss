import type { ColumnSource } from "./extensions";
import type { PlainDate } from "./model";
import type { EventOccurrence, TimedOccurrence } from "./occurrence";
import type { DaySpan, ViewRange } from "./view";

export type TimedBox = {
  key: string;
  occurrence: TimedOccurrence;
  date: PlainDate;
  startMinute: number;
  endMinute: number;
  column: number;
  columnCount: number;
  continuesBefore: boolean;
  continuesAfter: boolean;
  marker: boolean;
};

export type OverflowChip = {
  date: PlainDate;
  startMinute: number;
  endMinute: number;
  keys: string[];
};

export type DayColumn = {
  day: DaySpan;
  columnKey: string;
  resourceId?: string;
  boxes: TimedBox[];
  overflow: OverflowChip[];
};

export type SpanBar = {
  key: string;
  occurrence: EventOccurrence;
  week: number;
  lane: number;
  startIndex: number;
  length: number;
  continuesBefore: boolean;
  continuesAfter: boolean;
};

export type MonthCell = {
  date: PlainDate;
  inMonth: boolean;
  visibleKeys: string[];
  hiddenCount: number;
};

export type RangeLayout = {
  range: ViewRange;
  columns: DayColumn[];
  bars: SpanBar[];
  laneCount: number;
};

export type RangeLayoutOptions = {
  maxColumns: number;
  minimumMinutes: number;
  hiddenCalendarIds: string[];
  columns?: ColumnSource;
};
