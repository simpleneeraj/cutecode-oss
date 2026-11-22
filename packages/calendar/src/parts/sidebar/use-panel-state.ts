"use client";

import { useState } from "react";

import { hiddenCalendarIdsOf, occurrencesInRange } from "../../event";
import { visibleOccurrences } from "../../layout/visible";
import { resolveSettings, textDirectionOf } from "../../locale";
import { dateOf, startOfDay } from "../../time";
import {
  AnnouncementKind,
  type Calendar,
  type DateRange,
  type EventOccurrence,
  type Instant,
  type PlainDate,
  type ViewSettings,
} from "../../types";
import { upNext } from "../../widgets";
import { useAnnouncer } from "../live-region/use-announcer";
import { countByDate } from "../month-grid/model";
import { useMinuteClock } from "../now-line/clock";
import type { CalendarData } from "../time-grid/props";
import { createExpandRange } from "../time-grid/use-time-grid-model";
import type { MiniMonthSource } from "./mini-month";
import { groupCalendars, searchEvents, upNextWindow } from "./model";
import type { CalendarSidebarProps } from "./props";

type ShownEvents = {
  data: CalendarData;
  hiddenCalendarIds: string[];
  settings: ViewSettings;
};

const noCalendarIds: string[] = [];

function nextOccurrence(shown: ShownEvents, now: Instant | null): EventOccurrence | undefined {
  if (now === null) {
    return undefined;
  }
  const { data, hiddenCalendarIds, settings } = shown;
  const { timeZone } = settings;
  const range = upNextWindow(now);
  const dates = { start: dateOf(range.start, timeZone), end: dateOf(range.end, timeZone) };
  const occurrences = occurrencesInRange(data.events, { range, dates, timeZone }, data.expand);
  return upNext(visibleOccurrences(occurrences, hiddenCalendarIds), now, 1, timeZone)[0];
}

function useMonthSource(shown: ShownEvents, now: Instant | null): MiniMonthSource {
  const [expandMonth] = useState(createExpandRange);
  const { data, hiddenCalendarIds, settings } = shown;
  const { timeZone } = settings;

  const busyIn = (dates: DateRange): Set<PlainDate> => {
    const range = { start: startOfDay(dates.start, timeZone), end: startOfDay(dates.end, timeZone) };
    const key = { ...range, firstDate: dates.start, endDate: dates.end, timeZone };
    const occurrences = visibleOccurrences(expandMonth(data.events, data.expand, key), hiddenCalendarIds);
    return new Set(countByDate(occurrences, dates, timeZone).keys());
  };

  return { busyIn, today: now === null ? null : dateOf(now, timeZone) };
}

export function usePanelState({ data, visibility, options }: CalendarSidebarProps) {
  const settings = resolveSettings(options);
  const { message, announce } = useAnnouncer(settings);
  const [query, setQuery] = useState("");
  const now = useMinuteClock();
  const hiddenCalendarIds = hiddenCalendarIdsOf(data.calendars);
  const shown = { data, hiddenCalendarIds, settings };
  const source = useMonthSource(shown, now);

  const toggle = (calendar: Calendar, visible: boolean) => {
    visibility.onVisibilityChange(calendar.id, visible);
    announce({ kind: AnnouncementKind.CalendarToggled, calendarName: calendar.name, visible });
  };

  return {
    settings,
    message,
    now,
    source,
    toggle,
    hiddenCalendarIds,
    direction: textDirectionOf(settings.locale),
    search: {
      query,
      setQuery,
      results: searchEvents({ events: data.events, hiddenCalendarIds, query, now, expand: data.expand }, settings),
    },
    groups: groupCalendars(data.calendars, visibility.otherCalendarIds ?? noCalendarIds),
    upcoming: nextOccurrence(shown, now),
  };
}
