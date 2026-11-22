"use client";

import { useState } from "react";

import { dateOf, monthWeeks, startOfMonth } from "../../time";
import { resolveSettings, textDirectionOf } from "../../locale";
import { viewRange } from "../../range";
import { ViewKind } from "../../types";
import type { BlockView } from "../event-block/appearance";
import { useMinuteClock } from "../now-line/clock";
import { HourZoom, hourHeights, type CalendarViewProps } from "../time-grid/props";
import { createExpandRange } from "../time-grid/use-time-grid-model";
import { buildMonthModel, monthHeading } from "./model";

export function useMonthModel(calendar: CalendarViewProps, lines: number) {
  const { data, navigation, options } = calendar;
  const [expandRange] = useState(createExpandRange);
  const now = useMinuteClock();
  const settings = resolveSettings(options);
  const { timeZone } = settings;
  const range = viewRange(ViewKind.Month, navigation.date, settings);
  const key = {
    start: range.instants.start,
    end: range.instants.end,
    firstDate: range.dates.start,
    endDate: range.dates.end,
    timeZone,
  };
  const occurrences = expandRange(data.events, data.expand, key);
  const anchor = startOfMonth(navigation.date);
  const today = now === null ? null : dateOf(now, timeZone);
  const marks = { anchor, selected: navigation.date, today, lines };
  const weeks = monthWeeks(navigation.date, settings.weekStartsOn);
  const model = buildMonthModel({ occurrences, weeks, calendars: data.calendars, settings, marks });
  const view: BlockView = { settings, now, hourHeight: hourHeights[HourZoom.Regular], viewerId: options.viewerId };
  return {
    model,
    settings,
    anchor,
    selected: navigation.date,
    view,
    calendars: data.calendars,
    heading: monthHeading(anchor, settings),
    direction: textDirectionOf(settings.locale),
  };
}

export type MonthState = ReturnType<typeof useMonthModel>;
