import { intersectDates } from "../../agenda/coverage";
import { coveredDates, hiddenCalendarIdsOf } from "../../event";
import { layoutMonth } from "../../layout/month";
import { laneCount } from "../../layout/span";
import { visibleOccurrences } from "../../layout/visible";
import { formatPlainDate, weekInfo } from "../../locale";
import { isWeekend } from "../../range";
import { addDays, eachDate } from "../../time";
import type {
  Calendar,
  DateRange,
  EventOccurrence,
  MonthCell,
  PlainDate,
  SpanBar,
  ViewSettings,
  Weekday,
} from "../../types";
import type { ToolbarHeading } from "../calendar-toolbar/heading";
import { fitChips } from "./metrics";

export type MonthDay = {
  date: PlainDate;
  inMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isWeekend: boolean;
  chips: EventOccurrence[];
  bars: SpanBar[];
  hiddenCount: number;
  eventCount: number;
};

export type MonthWeek = {
  key: PlainDate;
  laneCount: number;
  days: MonthDay[];
};

export type MonthMarks = {
  anchor: PlainDate;
  selected: PlainDate;
  today: PlainDate | null;
  lines: number;
};

export type MonthModelInput = {
  occurrences: EventOccurrence[];
  weeks: PlainDate[][];
  calendars: Calendar[];
  settings: ViewSettings;
  marks: MonthMarks;
};

export type MonthModel = {
  weeks: MonthWeek[];
  dates: PlainDate[];
  hasEvents: boolean;
};

type DayContext = {
  cell: MonthCell;
  bars: SpanBar[];
  chipLines: number;
  byKey: Map<string, EventOccurrence>;
  counts: Map<PlainDate, number>;
  marks: MonthMarks;
  weekend: Weekday[];
};

function shownRange(dates: PlainDate[]): DateRange {
  const start = dates[0] ?? "";
  const last = dates.at(-1) ?? start;
  return { start, end: addDays(last, 1) };
}

export function countByDate(occurrences: EventOccurrence[], shown: DateRange, timeZone: string): Map<PlainDate, number> {
  const counts = new Map<PlainDate, number>();
  for (const occurrence of occurrences) {
    const dates = intersectDates(coveredDates(occurrence, timeZone), shown);
    const covered = dates === null ? [] : eachDate(dates);
    covered.forEach((date) => counts.set(date, (counts.get(date) ?? 0) + 1));
  }
  return counts;
}

function dayOf({ cell, bars, chipLines, byKey, counts, marks, weekend }: DayContext): MonthDay {
  const fitted = fitChips(cell.visibleKeys, cell.hiddenCount, chipLines);
  return {
    date: cell.date,
    inMonth: cell.inMonth,
    isToday: cell.date === marks.today,
    isSelected: cell.date === marks.selected,
    isWeekend: isWeekend(cell.date, weekend),
    chips: fitted.keys.map((key) => byKey.get(key)).filter((occurrence) => occurrence !== undefined),
    bars,
    hiddenCount: fitted.hiddenCount,
    eventCount: counts.get(cell.date) ?? 0,
  };
}

function barsStartingOn(bars: SpanBar[], week: number, dayIndex: number): SpanBar[] {
  return bars.filter((bar) => bar.week === week && bar.startIndex === dayIndex);
}

export function buildMonthModel({ occurrences, weeks, calendars, settings, marks }: MonthModelInput): MonthModel {
  const hiddenCalendarIds = hiddenCalendarIdsOf(calendars);
  const visible = visibleOccurrences(occurrences, hiddenCalendarIds);
  const timeZone = settings.timeZone;
  const chipCapacity = marks.lines;
  const layout = layoutMonth(visible, weeks, { timeZone, month: marks.anchor, chipCapacity, hiddenCalendarIds });
  const dates = weeks.flat();
  const counts = countByDate(visible, shownRange(dates), timeZone);
  const byKey = new Map(visible.map((occurrence) => [occurrence.key, occurrence]));
  const { weekend } = weekInfo(settings.locale);
  const monthWeeks = weeks.map((week, weekIndex) => {
    const lanes = laneCount(layout.bars, weekIndex);
    const chipLines = marks.lines - lanes;
    const days = week.map((_, dayIndex) => {
      const cell = layout.cells[weekIndex * week.length + dayIndex];
      const bars = barsStartingOn(layout.bars, weekIndex, dayIndex);
      return cell === undefined ? null : dayOf({ cell, bars, chipLines, byKey, counts, marks, weekend });
    });
    return { key: week[0] ?? String(weekIndex), laneCount: lanes, days: days.filter((day) => day !== null) };
  });
  return { weeks: monthWeeks, dates, hasEvents: counts.size > 0 };
}

export function monthHeading(anchor: PlainDate, settings: ViewSettings): ToolbarHeading {
  return {
    title: formatPlainDate(anchor, settings, { month: "long", year: "numeric" }),
    subtitle: "",
  };
}
