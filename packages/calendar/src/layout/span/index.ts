import { coveredDates } from "../../event";
import { daysBetween } from "../../time";
import type { DateRange, EventOccurrence, PlainDate, SpanBar } from "../../types";
import { isShortTimed } from "../timed";
import { createLaneBoard, placeSegments, type LaneSegment } from "./lanes";

type WeekSegment = LaneSegment & {
  continuesBefore: boolean;
  continuesAfter: boolean;
};

type SpanPlan = {
  occurrence: EventOccurrence;
  dates: DateRange;
  dayCount: number;
  segments: WeekSegment[];
};

export function isSpanning(occurrence: EventOccurrence, timeZone: string): boolean {
  return !isShortTimed(occurrence, timeZone);
}

function segmentOf(dates: DateRange, week: PlainDate[], weekIndex: number): WeekSegment | null {
  const first = week[0];
  if (first === undefined) {
    return null;
  }
  const fromIndex = daysBetween(first, dates.start);
  const toIndex = daysBetween(first, dates.end);
  const startIndex = Math.max(fromIndex, 0);
  const endIndex = Math.min(toIndex, week.length);
  if (endIndex <= startIndex) {
    return null;
  }
  return {
    week: weekIndex,
    startIndex,
    length: endIndex - startIndex,
    continuesBefore: fromIndex < 0,
    continuesAfter: toIndex > week.length,
  };
}

function planOf(occurrence: EventOccurrence, weeks: PlainDate[][], timeZone: string): SpanPlan {
  const dates = coveredDates(occurrence, timeZone);
  const segments = weeks
    .map((week, weekIndex) => segmentOf(dates, week, weekIndex))
    .filter((segment) => segment !== null);
  return { occurrence, dates, dayCount: daysBetween(dates.start, dates.end), segments };
}

function compareKeys(first: string, second: string): number {
  if (first === second) {
    return 0;
  }
  return first < second ? -1 : 1;
}

function comparePlans(first: SpanPlan, second: SpanPlan): number {
  const byLength = second.dayCount - first.dayCount;
  if (byLength !== 0) {
    return byLength;
  }
  const byStart = daysBetween(second.dates.start, first.dates.start);
  if (byStart !== 0) {
    return byStart;
  }
  return compareKeys(first.occurrence.key, second.occurrence.key);
}

function compareBars(first: SpanBar, second: SpanBar): number {
  return first.week - second.week || first.lane - second.lane || first.startIndex - second.startIndex;
}

export function layoutSpans(occurrences: EventOccurrence[], weeks: PlainDate[][], timeZone: string): SpanBar[] {
  const board = createLaneBoard();
  const plans = occurrences
    .filter((occurrence) => isSpanning(occurrence, timeZone))
    .map((occurrence) => planOf(occurrence, weeks, timeZone))
    .filter((plan) => plan.segments.length > 0)
    .sort(comparePlans);
  return plans
    .flatMap((plan) => {
      const lanes = placeSegments(board, plan.segments);
      return plan.segments.map((segment, index) => ({
        key: plan.occurrence.key,
        occurrence: plan.occurrence,
        week: segment.week,
        lane: lanes[index] ?? 0,
        startIndex: segment.startIndex,
        length: segment.length,
        continuesBefore: segment.continuesBefore,
        continuesAfter: segment.continuesAfter,
      }));
    })
    .sort(compareBars);
}

export function laneCount(bars: SpanBar[], week: number): number {
  return bars.filter((bar) => bar.week === week).reduce((count, bar) => Math.max(count, bar.lane + 1), 0);
}
