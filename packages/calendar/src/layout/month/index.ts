import { occurrenceInterval, overlapsRange } from "../../event";
import { daySpan, startOfMonth } from "../../time";
import type { EventOccurrence, MonthCell, PlainDate, SpanBar, TimedOccurrence } from "../../types";
import { laneCount, layoutSpans } from "../span";
import { isShortTimed } from "../timed";
import { visibleOccurrences } from "../visible";

export type MonthLayoutOptions = {
  timeZone: string;
  month: PlainDate;
  chipCapacity: number;
  hiddenCalendarIds: string[];
};

export type MonthLayout = {
  cells: MonthCell[];
  bars: SpanBar[];
};

function compareChips(first: TimedOccurrence, second: TimedOccurrence): number {
  const byStart = first.start - second.start;
  if (byStart !== 0) {
    return byStart;
  }
  const byLength = second.end - second.start - (first.end - first.start);
  if (byLength !== 0) {
    return byLength;
  }
  if (first.key === second.key) {
    return 0;
  }
  return first.key < second.key ? -1 : 1;
}

function chipKeysOn(chips: TimedOccurrence[], date: PlainDate, timeZone: string): string[] {
  const day = daySpan(date, timeZone);
  return chips.filter((chip) => overlapsRange(occurrenceInterval(chip, timeZone), day)).map((chip) => chip.key);
}

function coversDay(bar: SpanBar, week: number, dayIndex: number): boolean {
  return bar.week === week && bar.startIndex <= dayIndex && dayIndex < bar.startIndex + bar.length;
}

function cellOf(
  date: PlainDate,
  keys: string[],
  capacity: number,
  hiddenBarCount: number,
  month: PlainDate,
): MonthCell {
  return {
    date,
    inMonth: startOfMonth(date) === month,
    visibleKeys: keys.slice(0, capacity),
    hiddenCount: hiddenBarCount + Math.max(0, keys.length - capacity),
  };
}

export function layoutMonth(
  occurrences: EventOccurrence[],
  weeks: PlainDate[][],
  options: MonthLayoutOptions,
): MonthLayout {
  const visible = visibleOccurrences(occurrences, options.hiddenCalendarIds);
  const laneCapacity = Math.max(0, options.chipCapacity);
  const placed = layoutSpans(visible, weeks, options.timeZone);
  const bars = placed.filter((bar) => bar.lane < laneCapacity);
  const overflowBars = placed.filter((bar) => bar.lane >= laneCapacity);
  const chips = visible.filter((occurrence) => isShortTimed(occurrence, options.timeZone)).sort(compareChips);
  const month = startOfMonth(options.month);
  const cells = weeks.flatMap((week, weekIndex) => {
    const capacity = laneCapacity - laneCount(bars, weekIndex);
    return week.map((date, dayIndex) => {
      const hiddenBarCount = overflowBars.filter((bar) => coversDay(bar, weekIndex, dayIndex)).length;
      return cellOf(date, chipKeysOn(chips, date, options.timeZone), capacity, hiddenBarCount, month);
    });
  });
  return { cells, bars };
}
