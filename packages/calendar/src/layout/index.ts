import { daysInWeek } from "date-fns/constants";
import memoizeOne from "memoize-one";
import { daySpan, eachDate } from "../time";
import type {
  ColumnDescriptor,
  DayColumn,
  EventOccurrence,
  PlainDate,
  RangeLayout,
  RangeLayoutOptions,
  ViewRange,
} from "../types";
import { laneCount, layoutSpans } from "./span";
import { layoutTimedColumns } from "./timed";
import { visibleOccurrences } from "./visible";

export { isSpanning, laneCount, layoutSpans } from "./span";
export { layoutMonth, type MonthLayout, type MonthLayoutOptions } from "./month";
export { isShortTimed, layoutTimedColumns, type TimedLayoutOptions } from "./timed";

type LayoutRangeArguments = [EventOccurrence[], ViewRange, RangeLayoutOptions];

function rowsOf(dates: PlainDate[]): PlainDate[][] {
  return Array.from({ length: Math.ceil(dates.length / daysInWeek) }, (_, row) =>
    dates.slice(row * daysInWeek, (row + 1) * daysInWeek),
  );
}

function belongsToColumn(occurrence: EventOccurrence, descriptor: ColumnDescriptor): boolean {
  if (descriptor.resourceId === undefined) {
    return true;
  }
  return occurrence.event.resourceIds?.includes(descriptor.resourceId) ?? false;
}

function layoutColumns(
  occurrences: EventOccurrence[],
  dates: PlainDate[],
  timeZone: string,
  options: RangeLayoutOptions,
): DayColumn[] {
  const timedOptions = { maxColumns: options.maxColumns, minimumMinutes: options.minimumMinutes };
  const descriptors = options.columns?.(dates) ?? dates.map((date) => ({ key: date, date }));
  return descriptors.flatMap((descriptor) =>
    layoutTimedColumns(
      occurrences.filter((occurrence) => belongsToColumn(occurrence, descriptor)),
      [daySpan(descriptor.date, timeZone)],
      { ...timedOptions, columnKey: descriptor.key, timeZone },
    ),
  );
}

function layoutRange(occurrences: EventOccurrence[], range: ViewRange, options: RangeLayoutOptions): RangeLayout {
  const visible = visibleOccurrences(occurrences, options.hiddenCalendarIds);
  const dates = eachDate(range.dates);
  const weeks = rowsOf(dates);
  const bars = layoutSpans(visible, weeks, range.timeZone);
  const lanes = weeks.map((_, week) => laneCount(bars, week));
  return {
    range,
    columns: layoutColumns(visible, dates, range.timeZone, options),
    bars,
    laneCount: Math.max(0, ...lanes),
  };
}

function haveSameItems(first: string[], second: string[]): boolean {
  return first.length === second.length && first.every((item, index) => item === second[index]);
}

function haveSameOptions(next: RangeLayoutOptions, last: RangeLayoutOptions): boolean {
  return (
    next.maxColumns === last.maxColumns &&
    next.minimumMinutes === last.minimumMinutes &&
    next.columns === last.columns &&
    haveSameItems(next.hiddenCalendarIds, last.hiddenCalendarIds)
  );
}

function haveSameRange(next: ViewRange, last: ViewRange): boolean {
  return (
    next.kind === last.kind &&
    next.anchor === last.anchor &&
    next.dates.start === last.dates.start &&
    next.dates.end === last.dates.end &&
    next.instants.start === last.instants.start &&
    next.instants.end === last.instants.end &&
    next.timeZone === last.timeZone &&
    next.weekStartsOn === last.weekStartsOn
  );
}

function haveSameArguments(next: LayoutRangeArguments, last: LayoutRangeArguments): boolean {
  return next[0] === last[0] && haveSameRange(next[1], last[1]) && haveSameOptions(next[2], last[2]);
}

export function createLayoutRange(): (
  occurrences: EventOccurrence[],
  range: ViewRange,
  options: RangeLayoutOptions,
) => RangeLayout {
  return memoizeOne(layoutRange, haveSameArguments);
}
