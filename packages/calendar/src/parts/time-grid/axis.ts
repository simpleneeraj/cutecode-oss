import { hourMarks } from "../../range";
import { formatClockTime, minutes, parseClockTime } from "../../time";
import type { ClockRange, DaySpan, HourMark, Instant } from "../../types";

export type AxisRow = {
  key: string;
  wallMinute: number;
  repeat: number;
  instant: Instant;
};

export type TrackStop = {
  rowKey: string;
  wallMinute: number;
  minute: number;
  span: number;
  afterGap: boolean;
};

export type DayTrack = {
  day: DaySpan;
  stops: TrackStop[];
};

export type TimeAxis = {
  rows: AxisRow[];
  tracks: DayTrack[];
};

export type HourWindow = {
  fromMinute: number;
  toMinute: number;
};

export type VisibleAxis = {
  rows: AxisRow[];
  window: HourWindow;
  indexByKey: Map<string, number>;
};

export enum AxisSide {
  Before = "before",
  Inside = "inside",
  After = "after",
}

export type FoldOpen = {
  earlier: boolean;
  later: boolean;
};

export type FoldControl = {
  open: FoldOpen;
  setOpen: (open: FoldOpen) => void;
};

type MarkedRow = {
  row: AxisRow;
  stop: TrackStop;
};

function repeatOf(marks: HourMark[], index: number): number {
  const wallMinute = marks[index]?.wallMinute;
  return marks.slice(0, index).filter((mark) => mark.wallMinute === wallMinute).length;
}

function markedRowsOf(day: DaySpan, timeZone: string): MarkedRow[] {
  const marks = hourMarks(day, timeZone);
  return marks.map((mark, index) => {
    const repeat = repeatOf(marks, index);
    const key = `${mark.wallMinute}|${repeat}`;
    const nextMinute = marks[index + 1]?.minute ?? day.minutes;
    return {
      row: { key, wallMinute: mark.wallMinute, repeat, instant: mark.instant },
      stop: {
        rowKey: key,
        wallMinute: mark.wallMinute,
        minute: mark.minute,
        span: nextMinute - mark.minute,
        afterGap: mark.afterGap,
      },
    };
  });
}

function compareRows(first: AxisRow, second: AxisRow): number {
  return first.wallMinute - second.wallMinute || first.repeat - second.repeat;
}

function uniqueRows(rows: AxisRow[]): AxisRow[] {
  const byKey = new Map<string, AxisRow>();
  rows.forEach((row) => {
    if (!byKey.has(row.key)) {
      byKey.set(row.key, row);
    }
  });
  return [...byKey.values()].sort(compareRows);
}

export function buildAxis(days: DaySpan[], timeZone: string): TimeAxis {
  const marked = days.map((day) => ({ day, rows: markedRowsOf(day, timeZone) }));
  return {
    rows: uniqueRows(marked.flatMap((entry) => entry.rows.map((marks) => marks.row))),
    tracks: marked.map((entry) => ({ day: entry.day, stops: entry.rows.map((marks) => marks.stop) })),
  };
}

export function wholeHours(range: ClockRange): ClockRange {
  const start = Math.floor(parseClockTime(range.start) / minutes.hour) * minutes.hour;
  const end = Math.ceil(parseClockTime(range.end) / minutes.hour) * minutes.hour;
  return { start: formatClockTime(start), end: formatClockTime(end) };
}

export function hourWindow(shownHours: ClockRange | undefined, open: FoldOpen): HourWindow {
  if (shownHours === undefined) {
    return { fromMinute: 0, toMinute: minutes.day };
  }
  return {
    fromMinute: open.earlier ? 0 : parseClockTime(shownHours.start),
    toMinute: open.later ? minutes.day : parseClockTime(shownHours.end),
  };
}

function isRowShown(row: AxisRow, window: HourWindow): boolean {
  return row.wallMinute + minutes.hour > window.fromMinute && row.wallMinute < window.toMinute;
}

export function visibleAxis(axis: TimeAxis, window: HourWindow): VisibleAxis {
  const rows = axis.rows.filter((row) => isRowShown(row, window));
  return { rows, window, indexByKey: new Map(rows.map((row, index) => [row.key, index])) };
}

function stopAt(track: DayTrack, minute: number): TrackStop | undefined {
  return track.stops.findLast((stop) => stop.minute <= minute) ?? track.stops[0];
}

export function sideOf(track: DayTrack, minute: number, visible: VisibleAxis): AxisSide {
  const stop = stopAt(track, minute);
  const isShown = stop !== undefined && visible.indexByKey.has(stop.rowKey);
  if (isShown) {
    return AxisSide.Inside;
  }
  const isEarlier = stop !== undefined && stop.wallMinute < visible.window.fromMinute;
  return isEarlier ? AxisSide.Before : AxisSide.After;
}

export function offsetAt(track: DayTrack, minute: number, visible: VisibleAxis): number {
  const stop = stopAt(track, minute);
  const index = stop === undefined ? undefined : visible.indexByKey.get(stop.rowKey);
  if (stop === undefined || index === undefined) {
    const side = sideOf(track, minute, visible);
    return side === AxisSide.Before ? 0 : visible.rows.length;
  }
  const progress = (minute - stop.minute) / stop.span;
  return index + Math.min(1, Math.max(0, progress));
}

export function missingRows(track: DayTrack, visible: VisibleAxis): number[] {
  const trackKeys = new Set(track.stops.map((stop) => stop.rowKey));
  return visible.rows.flatMap((row, index) => (trackKeys.has(row.key) ? [] : [index]));
}

export function gapRows(track: DayTrack, visible: VisibleAxis): number[] {
  return track.stops
    .filter((stop) => stop.afterGap)
    .map((stop) => visible.indexByKey.get(stop.rowKey))
    .filter((index) => index !== undefined);
}

function stopForRow(track: DayTrack, visible: VisibleAxis, index: number): TrackStop | undefined {
  return track.stops.find((stop) => (visible.indexByKey.get(stop.rowKey) ?? -1) >= index);
}

export function minuteAtOffset(track: DayTrack, offset: number, visible: VisibleAxis): number {
  const lastIndex = visible.rows.length - 1;
  const index = Math.min(Math.max(Math.floor(offset), 0), Math.max(lastIndex, 0));
  const stop = stopForRow(track, visible, index);
  if (stop === undefined) {
    return track.day.minutes;
  }
  const isSameRow = visible.indexByKey.get(stop.rowKey) === index;
  const progress = isSameRow ? Math.min(Math.max(offset - index, 0), 1) : 0;
  return stop.minute + progress * stop.span;
}
