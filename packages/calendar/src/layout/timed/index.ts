import { daysBetween, minutes, toWallClock } from "../../time";
import {
  OccurrenceKind,
  type DayColumn,
  type DaySpan,
  type EventOccurrence,
  type OverflowChip,
  type TimedBox,
  type TimedOccurrence,
} from "../../types";
import { comparePieces, groupOverlapping, pieceOf, type TimedPiece } from "./piece";

export { comparePieces, groupOverlapping, pieceOf, type TimedPiece } from "./piece";

export const timedColumnLimits = {
  week: 3,
  day: 4,
};

export type TimedLayoutOptions = {
  maxColumns: number;
  minimumMinutes: number;
  columnKey: string;
  timeZone: string;
};

type PlacedPiece = {
  piece: TimedPiece;
  column: number;
};

function placeInColumns(cluster: TimedPiece[]): PlacedPiece[] {
  const columnReach: number[] = [];
  return cluster.map((piece) => {
    const freeColumn = columnReach.findIndex((reach) => reach <= piece.startMinute);
    const column = freeColumn === -1 ? columnReach.length : freeColumn;
    columnReach[column] = piece.reachMinute;
    return { piece, column };
  });
}

function boxOf(placed: PlacedPiece, columnCount: number, day: DaySpan): TimedBox {
  const { piece } = placed;
  return {
    key: piece.occurrence.key,
    occurrence: piece.occurrence,
    date: day.date,
    startMinute: piece.startMinute,
    endMinute: piece.endMinute,
    column: placed.column,
    columnCount,
    continuesBefore: piece.continuesBefore,
    continuesAfter: piece.continuesAfter,
    marker: piece.marker,
  };
}

function chipOf(window: TimedPiece[], day: DaySpan): OverflowChip {
  return {
    date: day.date,
    startMinute: Math.min(...window.map((piece) => piece.startMinute)),
    endMinute: Math.min(day.minutes, Math.max(...window.map((piece) => piece.reachMinute))),
    keys: window.map((piece) => piece.occurrence.key),
  };
}

function layoutCluster(cluster: TimedPiece[], day: DaySpan, maxColumns: number): Pick<DayColumn, "boxes" | "overflow"> {
  const placed = placeInColumns(cluster);
  const usedColumns = Math.max(...placed.map((entry) => entry.column)) + 1;
  const columnCount = Math.min(usedColumns, maxColumns);
  const visible = placed.filter((entry) => entry.column < maxColumns);
  const hidden = placed.filter((entry) => entry.column >= maxColumns).map((entry) => entry.piece);
  return {
    boxes: visible.map((entry) => boxOf(entry, columnCount, day)),
    overflow: groupOverlapping(hidden).map((window) => chipOf(window, day)),
  };
}

export function layoutDayColumn(occurrences: TimedOccurrence[], day: DaySpan, options: TimedLayoutOptions): DayColumn {
  const pieces = occurrences
    .map((occurrence) => pieceOf(occurrence, day, options.minimumMinutes))
    .filter((piece) => piece !== null)
    .sort(comparePieces);
  const clusters = groupOverlapping(pieces).map((cluster) => layoutCluster(cluster, day, options.maxColumns));
  return {
    day,
    columnKey: options.columnKey,
    boxes: clusters.flatMap((cluster) => cluster.boxes),
    overflow: clusters.flatMap((cluster) => cluster.overflow),
  };
}

function wallMinutesBetween(occurrence: TimedOccurrence, timeZone: string): number {
  const start = toWallClock(occurrence.start, timeZone);
  const end = toWallClock(occurrence.end, timeZone);
  return daysBetween(start.date, end.date) * minutes.day + end.minute - start.minute;
}

export function isShortTimed(occurrence: EventOccurrence, timeZone: string): occurrence is TimedOccurrence {
  if (occurrence.kind !== OccurrenceKind.Timed) {
    return false;
  }
  return wallMinutesBetween(occurrence, timeZone) < minutes.day;
}

export function layoutTimedColumns(
  occurrences: EventOccurrence[],
  days: DaySpan[],
  options: TimedLayoutOptions,
): DayColumn[] {
  const timed = occurrences.filter((occurrence) => isShortTimed(occurrence, options.timeZone));
  return days.map((day) => layoutDayColumn(timed, day, options));
}
