"use client";

import memoizeOne from "memoize-one";
import { useState } from "react";

import { hiddenCalendarIdsOf, occurrencesInRange } from "../../event";
import { createLayoutRange } from "../../layout";
import { timedColumnLimits } from "../../layout/timed";
import { resolveSettings } from "../../locale";
import { daysRange, viewRange } from "../../range";
import { parseDateTime } from "../../time";
import { ViewKind, type CalendarEvent, type Instant, type OccurrenceExpander, type PlainDate } from "../../types";
import { useMinuteClock } from "../now-line/clock";
import { pendingEventIdsOf, readyStatus } from "../state/status";
import type { FoldControl, FoldOpen } from "./axis";
import { buildGridModel, hourHeightOf, minimumMinutesOf } from "./model";
import type { CalendarViewProps } from "./props";

export type GridKind = ViewKind.Day | ViewKind.Week;

const closedFolds: FoldOpen = { earlier: false, later: false };

type ExpansionKey = {
  start: Instant;
  end: Instant;
  firstDate: PlainDate;
  endDate: PlainDate;
  timeZone: string;
};

function expandOnce(events: CalendarEvent[], expand: OccurrenceExpander | undefined, key: ExpansionKey) {
  const context = {
    range: { start: key.start, end: key.end },
    dates: { start: key.firstDate, end: key.endDate },
    timeZone: key.timeZone,
  };
  return occurrencesInRange(events, context, expand);
}

function haveSameExpansion(next: Parameters<typeof expandOnce>, last: Parameters<typeof expandOnce>): boolean {
  const [events, expand, key] = next;
  const [lastEvents, lastExpand, lastKey] = last;
  const isSameRange = key.start === lastKey.start && key.end === lastKey.end;
  const isSameDates = key.firstDate === lastKey.firstDate && key.endDate === lastKey.endDate;
  const isSameZone = key.timeZone === lastKey.timeZone;
  return events === lastEvents && expand === lastExpand && isSameRange && isSameDates && isSameZone;
}

export function createExpandRange() {
  return memoizeOne(expandOnce, haveSameExpansion);
}

function maxColumnsOf(kind: GridKind): number {
  return kind === ViewKind.Day ? timedColumnLimits.day : timedColumnLimits.week;
}

function useFoldControl(options: CalendarViewProps["options"]): FoldControl {
  const [localOpen, setLocalOpen] = useState(closedFolds);
  return {
    open: options.fold?.open ?? localOpen,
    setOpen: (next) => {
      setLocalOpen(next);
      options.fold?.onOpenChange(next);
    },
  };
}

export function useTimeGridModel(calendar: CalendarViewProps, kind: GridKind, dayCount?: number) {
  const { data, navigation, options } = calendar;
  const [layoutRange] = useState(createLayoutRange);
  const [expandRange] = useState(createExpandRange);
  const fold = useFoldControl(options);
  const { open } = fold;
  const settings = resolveSettings(options);
  const pinnedNow = options.now === undefined ? undefined : parseDateTime(options.now, settings.timeZone);
  const now = useMinuteClock(pinnedNow);
  const range =
    dayCount === undefined
      ? viewRange(kind, navigation.date, settings)
      : daysRange(navigation.date, dayCount, settings);
  const { start, end } = range.instants;
  const firstDate = range.dates.start;
  const endDate = range.dates.end;
  const { timeZone } = settings;
  const occurrences = expandRange(data.events, data.expand, { start, end, firstDate, endDate, timeZone });
  const layout = layoutRange(occurrences, range, {
    maxColumns: maxColumnsOf(kind),
    minimumMinutes: minimumMinutesOf(hourHeightOf(options)),
    hiddenCalendarIds: hiddenCalendarIdsOf(data.calendars),
  });
  const model = buildGridModel({
    range,
    settings,
    layout,
    occurrences,
    options,
    calendars: data.calendars,
    selected: navigation.date,
    now,
    open,
    pendingEventIds: pendingEventIdsOf(calendar.status ?? readyStatus),
  });
  return { model, now, fold };
}
