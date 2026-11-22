"use client";

import { useState } from "react";

import { groupAgenda } from "../../agenda";
import { agendaItems, type AgendaItem } from "../../agenda/virtual";
import { hiddenCalendarIdsOf } from "../../event";
import { visibleOccurrences } from "../../layout/visible";
import { startOfDay } from "../../time";
import type { DateRange, ViewSettings } from "../../types";
import { useMinuteClock } from "../now-line/clock";
import type { CalendarData } from "../time-grid/props";
import { createExpandRange } from "../time-grid/use-time-grid-model";

export function useAgendaItems(data: CalendarData, settings: ViewSettings) {
  const [expandRange] = useState(createExpandRange);
  const now = useMinuteClock();
  const { timeZone } = settings;
  const hiddenCalendarIds = hiddenCalendarIdsOf(data.calendars);

  const itemsFor = (window: DateRange): AgendaItem[] => {
    const key = {
      start: startOfDay(window.start, timeZone),
      end: startOfDay(window.end, timeZone),
      firstDate: window.start,
      endDate: window.end,
      timeZone,
    };
    const occurrences = visibleOccurrences(expandRange(data.events, data.expand, key), hiddenCalendarIds);
    return agendaItems(groupAgenda(occurrences, window, now ?? 0, timeZone));
  };

  return { itemsFor, now };
}

export type AgendaItemsSource = ReturnType<typeof useAgendaItems>;
