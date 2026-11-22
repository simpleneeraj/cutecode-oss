import { formatClock, formatTime, formatZoneName } from "../../locale";
import { formatClockTime, milliseconds } from "../../time";
import type { Instant, SecondaryZoneProvider, ViewSettings, ZoneMark } from "../../types";
import {
  AxisSide,
  offsetAt,
  sideOf,
  type AxisRow,
  type DayTrack,
  type TimeAxis,
  type TrackStop,
  type VisibleAxis,
} from "./axis";

export type GutterLabel = {
  key: string;
  offset: number;
  text: string;
  zone: string | null;
};

export type ZoneShiftLabeler = (mark: ZoneMark, previous: ZoneMark | undefined, settings: ViewSettings) => string | null;

export type SecondaryZone = {
  timeZone: string;
  marksOf: SecondaryZoneProvider;
  shiftLabelOf?: ZoneShiftLabeler;
};

function isShiftStop(stop: TrackStop, track: DayTrack): boolean {
  const repeats = track.stops.filter((other) => other.wallMinute === stop.wallMinute).length;
  return stop.afterGap || repeats > 1;
}

function shiftInstantOf(row: AxisRow, axis: TimeAxis): Instant | null {
  const instants = axis.tracks.flatMap((track) =>
    track.stops
      .filter((stop) => stop.rowKey === row.key && isShiftStop(stop, track))
      .map((stop) => track.day.start + stop.minute * milliseconds.minute),
  );
  return instants[0] ?? null;
}

function rowLabel(row: AxisRow, index: number, axis: TimeAxis, settings: ViewSettings): GutterLabel {
  const shiftInstant = shiftInstantOf(row, axis);
  const zone = shiftInstant === null ? null : formatZoneName(shiftInstant, settings);
  return { key: row.key, offset: index, text: formatTime(shiftInstant ?? row.instant, settings), zone };
}

export function gutterLabels(axis: TimeAxis, visible: VisibleAxis, settings: ViewSettings): GutterLabel[] {
  return visible.rows
    .map((row, index) => rowLabel(row, index, axis, settings))
    .filter((label) => label.offset > 0);
}

function isShownMark(mark: ZoneMark | undefined, track: DayTrack, visible: VisibleAxis): boolean {
  return mark !== undefined && sideOf(track, mark.minute, visible) === AxisSide.Inside;
}

export function secondaryLabels(
  zone: SecondaryZone,
  track: DayTrack,
  visible: VisibleAxis,
  settings: ViewSettings,
): GutterLabel[] {
  const marks = zone.marksOf(track.day, zone.timeZone);
  return marks
    .map((mark, index) => ({
      key: `${mark.date}|${mark.minute}`,
      offset: offsetAt(track, mark.minute, visible),
      text: formatClock(formatClockTime(mark.wallMinute), settings),
      zone: zone.shiftLabelOf?.(mark, marks[index - 1], settings) ?? null,
    }))
    .filter((label, index) => isShownMark(marks[index], track, visible) && label.offset > 0);
}

export function zoneNames(zone: SecondaryZone | undefined, track: DayTrack | undefined, settings: ViewSettings) {
  if (zone === undefined || track === undefined) {
    return null;
  }
  const instant = track.day.start;
  return {
    primary: formatZoneName(instant, settings),
    secondary: formatZoneName(instant, { ...settings, timeZone: zone.timeZone }),
  };
}
