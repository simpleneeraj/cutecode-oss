import { formatTime } from "../../locale";
import { foldHours, type HourFold } from "../../range";
import { milliseconds } from "../../time";
import type { ClockRange, DaySpan, Instant, TimedOccurrence, ViewSettings } from "../../types";
import type { FoldOpen } from "./axis";

export enum FoldEdge {
  Earlier = "earlier",
  Later = "later",
}

export type FoldPill = {
  edge: FoldEdge;
  label: string;
  isOpen: boolean;
};

export type FoldInput = {
  days: DaySpan[];
  shownHours: ClockRange | undefined;
  occurrences: TimedOccurrence[];
  settings: ViewSettings;
  open: FoldOpen;
};

type EdgeSummary = {
  count: number;
  instant: Instant | null;
};

type DayFold = {
  day: DaySpan;
  fold: HourFold;
};

type EdgeCopy = {
  counted: (count: number, time: string) => string;
  show: string;
  hide: string;
};

export const foldCopy: Record<FoldEdge, EdgeCopy> = {
  [FoldEdge.Earlier]: {
    counted: (count, time) => `${count} earlier, from ${time}`,
    show: "Earlier hours",
    hide: "Hide earlier hours",
  },
  [FoldEdge.Later]: {
    counted: (count, time) => `${count} later, until ${time}`,
    show: "Later hours",
    hide: "Hide later hours",
  },
};

function edgeMinute(fold: HourFold, edge: FoldEdge): number | null {
  return edge === FoldEdge.Earlier ? fold.earliestMinute : fold.latestMinute;
}

function edgeCount(fold: HourFold, edge: FoldEdge): number {
  return edge === FoldEdge.Earlier ? fold.earlierCount : fold.laterCount;
}

function summaryOf(folds: DayFold[], edge: FoldEdge): EdgeSummary {
  const points = folds.flatMap(({ day, fold }) => {
    const minute = edgeMinute(fold, edge);
    return minute === null ? [] : [{ minute, instant: day.start + minute * milliseconds.minute }];
  });
  const direction = edge === FoldEdge.Earlier ? 1 : -1;
  const outermost = points.sort((first, second) => (first.minute - second.minute) * direction)[0];
  const count = folds.reduce((total, { fold }) => total + edgeCount(fold, edge), 0);
  return { count, instant: outermost?.instant ?? null };
}

function pillLabel(summary: EdgeSummary, isOpen: boolean, copy: EdgeCopy, settings: ViewSettings): string {
  if (isOpen) {
    return copy.hide;
  }
  if (summary.instant === null) {
    return copy.show;
  }
  return copy.counted(summary.count, formatTime(summary.instant, settings));
}

export function foldPills(input: FoldInput): FoldPill[] {
  const { shownHours, settings, open } = input;
  if (shownHours === undefined) {
    return [];
  }
  const folds = input.days.map((day) => ({
    day,
    fold: foldHours(day, shownHours, input.occurrences, settings.timeZone),
  }));
  const pillOf = (edge: FoldEdge, isOpen: boolean): FoldPill => ({
    edge,
    isOpen,
    label: pillLabel(summaryOf(folds, edge), isOpen, foldCopy[edge], settings),
  });
  return [pillOf(FoldEdge.Earlier, open.earlier), pillOf(FoldEdge.Later, open.later)];
}
