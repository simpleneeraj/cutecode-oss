"use client";

import { useState } from "react";

import { formatPlainDate } from "../../locale";
import { useFamilySettings, type FamilyOptions } from "../../parts/family-options/use-family-settings";
import { pickerMonth, SelectionMode } from "../../picker";
import { addMonths, startOfMonth } from "../../time";
import type { Calendar, CalendarEvent, PlainDate } from "../../types";
import {
  allCalendars,
  CompactLayout,
  filterChips,
  filteredOccurrences,
  listDays,
  monthOccurrences,
  tileDays,
} from "./model";

export type CompactMonthData = {
  events: CalendarEvent[];
  calendars: Calendar[];
};

type CompactMonthInput = {
  data: CompactMonthData;
  value: PlainDate;
  options: FamilyOptions;
  isLoading: boolean;
};

const noRules = {};

export function useCompactMonth({ data, value, options, isLoading }: CompactMonthInput) {
  const family = useFamilySettings(options);
  const { settings } = family;
  const [browse, setBrowse] = useState({ value, month: startOfMonth(value) });
  const [layout, setLayout] = useState(CompactLayout.Grid);
  const [calendarId, setCalendarId] = useState(allCalendars);
  const month = browse.value === value ? browse.month : startOfMonth(value);
  const showMonth = (date: PlainDate) => setBrowse({ value, month: startOfMonth(date) });

  const loaded = isLoading ? [] : monthOccurrences(data.events, data.calendars, month, settings.timeZone);
  const chips = filterChips(loaded, data.calendars);
  const shownCalendarId = chips.some((chip) => chip.id === calendarId) ? calendarId : allCalendars;
  const shown = filteredOccurrences(loaded, shownCalendarId);
  const weeks = pickerMonth(month, settings, { mode: SelectionMode.Single, date: value }, noRules, family.today ?? "");
  const monthDates = weeks
    .flat()
    .filter((day) => day.inMonth)
    .map((day) => day.date);

  return {
    family,
    title: formatPlainDate(month, settings, { month: "long" }),
    tiles: tileDays(weeks, shown, data.calendars, settings.timeZone),
    list: listDays(shown, monthDates, settings.timeZone),
    filter: { chips, value: shownCalendarId, onValueChange: setCalendarId },
    layout: { value: layout, onValueChange: setLayout },
    isEmpty: !isLoading && loaded.length === 0,
    showMonth,
    step: (offset: number) => showMonth(addMonths(month, offset)),
  };
}
