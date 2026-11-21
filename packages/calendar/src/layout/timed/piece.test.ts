import { describe, expect, it } from "vitest";
import { instantAt, makeEvent, testZones } from "../../testing";
import { daySpan } from "../../time";
import { OccurrenceKind, type Instant, type TimedOccurrence } from "../../types";
import { comparePieces, groupOverlapping, pieceOf, type TimedPiece } from "./piece";

const day = daySpan("2026-11-18", testZones.losAngeles);

function timedOccurrence(key: string, start: Instant, end: Instant): TimedOccurrence {
  return { kind: OccurrenceKind.Timed, key, event: makeEvent({ id: key }), originalStart: key, start, end };
}

function onDay(key: string, from: string, to: string, date = "2026-11-18"): TimedOccurrence {
  return timedOccurrence(key, instantAt(date, from), instantAt(date, to));
}

function piecesFor(occurrences: TimedOccurrence[], minimumMinutes = 0): TimedPiece[] {
  return occurrences.flatMap((occurrence) => pieceOf(occurrence, day, minimumMinutes) ?? []);
}

describe("pieceOf", () => {
  it("places an event at real minutes from the start of the day", () => {
    const piece = pieceOf(onDay("crit", "10:00", "11:30"), day, 30);
    expect(piece).toMatchObject({
      startMinute: 600,
      endMinute: 690,
      reachMinute: 690,
      continuesBefore: false,
      continuesAfter: false,
      marker: false,
    });
  });

  it("keeps the true end of a 5 minute event and reserves the minimum for collisions", () => {
    const piece = pieceOf(onDay("standup", "09:00", "09:05"), day, 30);
    expect(piece).toMatchObject({ startMinute: 540, endMinute: 545, reachMinute: 570, marker: false });
  });

  it("marks a 0 minute event and still reserves the minimum", () => {
    const piece = pieceOf(onDay("deadline", "17:00", "17:00"), day, 30);
    expect(piece).toMatchObject({ startMinute: 1020, endMinute: 1020, reachMinute: 1050, marker: true });
  });

  it("treats an end before the start as a marker at the start", () => {
    const piece = pieceOf(
      timedOccurrence("broken", instantAt("2026-11-18", "12:00"), instantAt("2026-11-18", "11:00")),
      day,
      15,
    );
    expect(piece).toMatchObject({ startMinute: 720, endMinute: 720, reachMinute: 735, marker: true });
  });

  it("keeps a marker at midnight on the day it starts", () => {
    expect(pieceOf(onDay("midnight", "00:00", "00:00"), day, 15)).toMatchObject({ startMinute: 0, marker: true });
    expect(pieceOf(onDay("midnight", "00:00", "00:00", "2026-11-19"), day, 15)).toBeNull();
  });

  it("skips occurrences outside the day", () => {
    expect(pieceOf(onDay("yesterday", "10:00", "11:00", "2026-11-17"), day, 15)).toBeNull();
    expect(pieceOf(onDay("tomorrow", "10:00", "11:00", "2026-11-19"), day, 15)).toBeNull();
  });

  it("skips an event that ends exactly at the start of the day", () => {
    const occurrence = timedOccurrence("late", instantAt("2026-11-17", "22:00"), day.start);
    expect(pieceOf(occurrence, day, 15)).toBeNull();
  });

  it("splits an event that crosses midnight into two pieces", () => {
    const occurrence = timedOccurrence("late", instantAt("2026-11-18", "22:00"), instantAt("2026-11-19", "01:30"));
    const nextDay = daySpan("2026-11-19", testZones.losAngeles);
    expect(pieceOf(occurrence, day, 15)).toMatchObject({
      startMinute: 1320,
      endMinute: 1440,
      continuesBefore: false,
      continuesAfter: true,
    });
    expect(pieceOf(occurrence, nextDay, 15)).toMatchObject({
      startMinute: 0,
      endMinute: 90,
      continuesBefore: true,
      continuesAfter: false,
    });
  });

  it("does not continue after when the event ends exactly at midnight", () => {
    const occurrence = timedOccurrence("evening", instantAt("2026-11-18", "22:00"), instantAt("2026-11-19", "00:00"));
    expect(pieceOf(occurrence, day, 15)).toMatchObject({ endMinute: 1440, continuesAfter: false });
  });

  it("counts real elapsed minutes on the fall day", () => {
    const fallDay = daySpan("2026-11-01", testZones.losAngeles);
    expect(fallDay.minutes).toBe(1500);
    const piece = pieceOf(onDay("early", "03:00", "04:00", "2026-11-01"), fallDay, 15);
    expect(piece).toMatchObject({ startMinute: 240, endMinute: 300 });
    const lastHour = pieceOf(onDay("last", "23:00", "23:59", "2026-11-01"), fallDay, 15);
    expect(lastHour).toMatchObject({ startMinute: 1440, endMinute: 1499 });
  });

  it("counts real elapsed minutes on the spring day", () => {
    const springDay = daySpan("2026-03-08", testZones.losAngeles);
    expect(springDay.minutes).toBe(1380);
    const piece = pieceOf(onDay("early", "03:00", "04:00", "2026-03-08"), springDay, 15);
    expect(piece).toMatchObject({ startMinute: 120, endMinute: 180 });
  });

  it("clips a crossing piece to the 25 hour fall day", () => {
    const fallDay = daySpan("2026-11-01", testZones.losAngeles);
    const occurrence = timedOccurrence("night", instantAt("2026-11-01", "23:00"), instantAt("2026-11-02", "01:00"));
    expect(pieceOf(occurrence, fallDay, 15)).toMatchObject({
      startMinute: 1440,
      endMinute: 1500,
      continuesAfter: true,
    });
  });

  it("places an event made in Tokyo at the right minute in Los Angeles", () => {
    const occurrence = timedOccurrence(
      "tokyo",
      instantAt("2026-11-19", "03:00", testZones.tokyo),
      instantAt("2026-11-19", "04:00", testZones.tokyo),
    );
    expect(pieceOf(occurrence, day, 15)).toMatchObject({ startMinute: 600, endMinute: 660 });
  });

  it("follows the day in other zones with half and quarter hour offsets", () => {
    const kathmanduDay = daySpan("2026-11-18", testZones.kathmandu);
    const occurrence = timedOccurrence(
      "standup",
      instantAt("2026-11-18", "09:00", testZones.stJohns),
      instantAt("2026-11-18", "09:30", testZones.stJohns),
    );
    expect(pieceOf(occurrence, kathmanduDay, 15)).toMatchObject({ startMinute: 1095, endMinute: 1125 });
  });
});

describe("comparePieces", () => {
  it("orders by start, then longest first, then by key", () => {
    const pieces = piecesFor([
      onDay("d", "11:00", "12:00"),
      onDay("c", "10:00", "10:30"),
      onDay("b", "10:00", "12:00"),
      onDay("a", "10:00", "10:30"),
    ]).sort(comparePieces);
    expect(pieces.map((piece) => piece.occurrence.key)).toEqual(["b", "a", "c", "d"]);
  });

  it("returns 0 for the same piece", () => {
    const [piece] = piecesFor([onDay("a", "10:00", "11:00")]);
    expect(piece && comparePieces(piece, piece)).toBe(0);
  });
});

describe("groupOverlapping", () => {
  function keysOf(groups: TimedPiece[][]): string[][] {
    return groups.map((group) => group.map((piece) => piece.occurrence.key));
  }

  it("returns no groups for no pieces", () => {
    expect(groupOverlapping([])).toEqual([]);
  });

  it("keeps touching events apart", () => {
    const pieces = piecesFor([onDay("a", "10:00", "11:00"), onDay("b", "11:00", "12:00")]);
    expect(keysOf(groupOverlapping(pieces))).toEqual([["a"], ["b"]]);
  });

  it("joins a chain of overlaps into one group", () => {
    const pieces = piecesFor([
      onDay("a", "09:00", "10:30"),
      onDay("b", "10:00", "11:30"),
      onDay("c", "11:00", "12:00"),
      onDay("d", "13:00", "14:00"),
    ]);
    expect(keysOf(groupOverlapping(pieces))).toEqual([["a", "b", "c"], ["d"]]);
  });

  it("keeps a long event reaching over later short ones in its group", () => {
    const pieces = piecesFor([
      onDay("long", "09:00", "13:00"),
      onDay("short", "09:30", "10:00"),
      onDay("later", "12:00", "12:30"),
    ]);
    expect(keysOf(groupOverlapping(pieces))).toEqual([["long", "short", "later"]]);
  });

  it("uses the reserved minimum of a marker for collisions", () => {
    const pieces = piecesFor([onDay("deadline", "10:00", "10:00"), onDay("next", "10:10", "11:00")], 30);
    expect(keysOf(groupOverlapping(pieces))).toEqual([["deadline", "next"]]);
  });
});
