"use client";

import { useState } from "react";

import { formatPlainDate } from "../../locale";
import { fallbackDateOf } from "../../parts/date-grid/fallback";
import { useDateGridFocus } from "../../parts/date-grid/use-date-grid-focus";
import { useFamilySettings, type FamilyOptions } from "../../parts/family-options/use-family-settings";
import type { PlainDate } from "../../types";
import { weekStrip } from "../../widgets";
import { stripDays, weekNumber, weekStripCopy } from "./model";

type WeekStripInput = {
  value: PlainDate;
  options: FamilyOptions;
  isPastLocked: boolean;
};

export function useWeekStrip({ value, options, isPastLocked }: WeekStripInput) {
  const family = useFamilySettings(options);
  const { settings } = family;
  const [browse, setBrowse] = useState({ value, anchor: value });
  const anchor = browse.value === value ? browse.anchor : value;
  const days = stripDays(weekStrip(anchor, settings, family.today ?? ""), value, settings, isPastLocked);
  const dates = days.map((day) => day.date);
  const focus = useDateGridFocus({
    dates,
    fallbackDate: fallbackDateOf(dates, [value, family.today]),
    direction: family.direction,
    timeZone: settings.timeZone,
    onReveal: (date) => setBrowse({ value, anchor: date }),
  });

  return {
    settings,
    days,
    focus,
    monthTitle: formatPlainDate(anchor, settings, { month: "long" }),
    weekTitle: weekStripCopy.week(weekNumber(anchor, settings.weekStartsOn)),
  };
}
