import { isShortTimed } from "../../layout/timed";
import { formatTime, textDirectionOf, weekInfo } from "../../locale";
import { hiddenCalendarIdsOf, isOnHiddenCalendar } from "../../event";
import { minutes } from "../../time";
import type {
  Calendar,
  EventOccurrence,
  Instant,
  PlainDate,
  RangeLayout,
  Resource,
  SpanBar,
  TextDirection,
  TimedOccurrence,
  ViewRange,
  ViewSettings,
} from "../../types";
import type { BlockView } from "../event-block/appearance";
import { rangeHeading, type ToolbarHeading } from "../calendar-toolbar/heading";
import { buildAxis, hourWindow, visibleAxis, wholeHours, type FoldOpen, type VisibleAxis } from "./axis";
import { anchorColumn, gridColumnOf, type GridColumn } from "./columns";
import { foldPills, type FoldPill } from "./fold";
import { gutterLabels, secondaryLabels, zoneNames, type GutterLabel } from "./gutter-labels";
import { HourZoom, hourHeights, type TimeGridOptions } from "./props";

export type GridModelInput = {
  range: ViewRange;
  settings: ViewSettings;
  layout: RangeLayout;
  occurrences: EventOccurrence[];
  options: TimeGridOptions;
  calendars: Calendar[];
  selected: PlainDate;
  now: Instant | null;
  open: FoldOpen;
  pendingEventIds?: ReadonlySet<string>;
  resources?: Resource[];
};

export type SecondaryGutter = {
  labels: GutterLabel[];
  names: { primary: string; secondary: string } | null;
};

export type GridModel = {
  range: ViewRange;
  settings: ViewSettings;
  direction: TextDirection;
  heading: ToolbarHeading;
  columns: GridColumn[];
  bars: SpanBar[];
  laneCount: number;
  visible: VisibleAxis;
  gutter: GutterLabel[];
  secondary: SecondaryGutter | null;
  nowLabel: GutterLabel | null;
  pills: FoldPill[];
  calendars: Calendar[];
  resources: Resource[];
  occurrenceByKey: Map<string, EventOccurrence>;
  blockView: BlockView;
  hasEvents: boolean;
};

const blockLimits = {
  minimumHeight: 18,
};

export function hourHeightOf(options: TimeGridOptions): number {
  return hourHeights[options.hourZoom ?? HourZoom.Regular];
}

export function minimumMinutesOf(hourHeight: number): number {
  return Math.ceil((blockLimits.minimumHeight * minutes.hour) / hourHeight);
}

function visibleOccurrences(input: GridModelInput): EventOccurrence[] {
  const hidden = hiddenCalendarIdsOf(input.calendars);
  return input.occurrences.filter((occurrence) => !isOnHiddenCalendar(occurrence.event, hidden));
}

function shortTimed(occurrences: EventOccurrence[], timeZone: string): TimedOccurrence[] {
  return occurrences.filter((occurrence) => isShortTimed(occurrence, timeZone));
}

function nowLabelOf(columns: GridColumn[], now: Instant | null, settings: ViewSettings): GutterLabel | null {
  const offset = columns.find((column) => column.nowOffset !== null)?.nowOffset ?? null;
  if (offset === null || now === null) {
    return null;
  }
  return { key: "now", offset, text: formatTime(now, settings), zone: null };
}

function secondaryOf(input: GridModelInput, visible: VisibleAxis, columns: GridColumn[]): SecondaryGutter | null {
  const zone = input.options.secondaryZone;
  const track = anchorColumn(columns)?.track;
  if (zone === undefined || track === undefined) {
    return null;
  }
  return {
    labels: secondaryLabels(zone, track, visible, input.settings),
    names: zoneNames(zone, track, input.settings),
  };
}

function columnsOf(input: GridModelInput, visible: VisibleAxis, tracks: GridColumn["track"][]): GridColumn[] {
  const context = {
    visible,
    settings: input.settings,
    weekend: weekInfo(input.settings.locale).weekend,
    selected: input.selected,
    now: input.now,
    resources: input.resources ?? [],
  };
  return input.layout.columns.flatMap((column, index) => {
    const track = tracks[index];
    return track === undefined ? [] : [gridColumnOf(column, track, context)];
  });
}

function uniqueDays(columns: GridColumn[]): GridColumn["column"]["day"][] {
  const byDate = new Map(columns.map((column) => [column.column.day.date, column.column.day]));
  return [...byDate.values()];
}

function isBookedIn(bar: SpanBar, column: GridColumn): boolean {
  return column.resource === null || (bar.occurrence.event.resourceIds?.includes(column.resource.id) ?? false);
}

function resourceBars(bar: SpanBar, columns: GridColumn[], perDate: number): SpanBar[] {
  const end = bar.startIndex + bar.length;
  return columns.flatMap((column, index) => {
    const dateIndex = Math.floor(index / perDate);
    const isOnDate = dateIndex >= bar.startIndex && dateIndex < end;
    if (!isOnDate || !isBookedIn(bar, column)) {
      return [];
    }
    const continuesBefore = bar.continuesBefore || dateIndex > bar.startIndex;
    const continuesAfter = bar.continuesAfter || dateIndex < end - 1;
    return [{ ...bar, startIndex: index, length: 1, continuesBefore, continuesAfter }];
  });
}

function columnBars(bars: SpanBar[], columns: GridColumn[], dateCount: number): SpanBar[] {
  const perDate = dateCount === 0 ? 1 : columns.length / dateCount;
  if (perDate <= 1) {
    return bars;
  }
  return bars.flatMap((bar) => resourceBars(bar, columns, perDate));
}

export function buildGridModel(input: GridModelInput): GridModel {
  const { settings, layout, options } = input;
  const shownHours = options.shownHours === undefined ? undefined : wholeHours(options.shownHours);
  const axis = buildAxis(
    layout.columns.map((column) => column.day),
    settings.timeZone,
  );
  const visible = visibleAxis(axis, hourWindow(shownHours, input.open));
  const columns = columnsOf(input, visible, axis.tracks);
  const shown = visibleOccurrences(input);
  const days = uniqueDays(columns);
  return {
    range: input.range,
    settings,
    direction: textDirectionOf(settings.locale),
    heading: rangeHeading(input.range, settings),
    columns,
    bars: columnBars(layout.bars, columns, days.length),
    laneCount: layout.laneCount,
    visible,
    gutter: gutterLabels(axis, visible, settings),
    secondary: secondaryOf(input, visible, columns),
    nowLabel: nowLabelOf(columns, input.now, settings),
    pills: foldPills({
      days,
      shownHours,
      occurrences: shortTimed(shown, settings.timeZone),
      settings,
      open: input.open,
    }),
    calendars: input.calendars,
    resources: input.resources ?? [],
    occurrenceByKey: new Map(shown.map((occurrence) => [occurrence.key, occurrence])),
    blockView: {
      settings,
      now: input.now,
      hourHeight: hourHeightOf(options),
      viewerId: options.viewerId,
      pendingEventIds: input.pendingEventIds,
    },
    hasEvents: shown.length > 0,
  };
}
