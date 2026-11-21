import { overlapsRange } from "../../event";
import { milliseconds } from "../../time";
import type { DaySpan, Instant, TimedOccurrence } from "../../types";

export type TimedPiece = {
  occurrence: TimedOccurrence;
  startMinute: number;
  endMinute: number;
  reachMinute: number;
  continuesBefore: boolean;
  continuesAfter: boolean;
  marker: boolean;
};

function minutesFrom(origin: Instant, instant: Instant): number {
  return (instant - origin) / milliseconds.minute;
}

export function pieceOf(occurrence: TimedOccurrence, day: DaySpan, minimumMinutes: number): TimedPiece | null {
  const end = Math.max(occurrence.start, occurrence.end);
  const touchesDay = overlapsRange({ start: occurrence.start, end }, { start: day.start, end: day.end });
  if (!touchesDay) {
    return null;
  }
  const startMinute = minutesFrom(day.start, Math.max(occurrence.start, day.start));
  const endMinute = minutesFrom(day.start, Math.min(end, day.end));
  return {
    occurrence,
    startMinute,
    endMinute,
    reachMinute: startMinute + Math.max(endMinute - startMinute, minimumMinutes),
    continuesBefore: occurrence.start < day.start,
    continuesAfter: end > day.end,
    marker: occurrence.start === end,
  };
}

function compareKeys(first: string, second: string): number {
  if (first === second) {
    return 0;
  }
  return first < second ? -1 : 1;
}

export function comparePieces(first: TimedPiece, second: TimedPiece): number {
  const byStart = first.startMinute - second.startMinute;
  if (byStart !== 0) {
    return byStart;
  }
  const byLength = second.endMinute - second.startMinute - (first.endMinute - first.startMinute);
  if (byLength !== 0) {
    return byLength;
  }
  return compareKeys(first.occurrence.key, second.occurrence.key);
}

export function groupOverlapping(pieces: TimedPiece[]): TimedPiece[][] {
  const groups: TimedPiece[][] = [];
  let current: TimedPiece[] = [];
  let reach = -Infinity;
  for (const piece of pieces) {
    const startsNewGroup = piece.startMinute >= reach;
    if (startsNewGroup && current.length > 0) {
      groups.push(current);
    }
    if (startsNewGroup) {
      current = [];
    }
    current.push(piece);
    reach = startsNewGroup ? piece.reachMinute : Math.max(reach, piece.reachMinute);
  }
  if (current.length > 0) {
    groups.push(current);
  }
  return groups;
}
