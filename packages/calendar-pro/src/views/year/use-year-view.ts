"use client";

import { useAnnouncer } from "@cutecode/calendar/parts/live-region/use-announcer";
import { readyStatus, isShowingEvents, CalendarStatusKind } from "@cutecode/calendar/parts/state/status";
import { useGridNavigation } from "@cutecode/calendar/parts/time-grid/use-grid-navigation";
import { useMinuteClock } from "@cutecode/calendar/parts/now-line/clock";
import { resolveSettings, textDirectionOf } from "@cutecode/calendar/locale";
import { viewRange } from "@cutecode/calendar/range";
import { dateOf, parseDateTime } from "@cutecode/calendar/time";
import { ViewKind, type PlainDate } from "@cutecode/calendar/types";
import { useMemo, useState } from "react";

import { countYear } from "./counts";
import { buildYearModel } from "./model";
import type { YearViewProps } from "./props";
import { dateOfTarget, useYearFocus, type YearFocus } from "./use-year-focus";
import { useMonthList } from "./use-month-list";

type TargetEvent = { target: EventTarget };

function cellEventsOf(focus: YearFocus, openDay: (date: PlainDate) => void, hover: (date: PlainDate | null) => void) {
  return {
    onClick: (event: TargetEvent) => {
      const date = dateOfTarget(event.target);
      if (date !== null) {
        focus.select(date);
        openDay(date);
      }
    },
    onKeyDown: focus.onKeyDown,
    onFocus: (event: TargetEvent) => focus.syncFocus(event.target),
    onPointerOver: (event: TargetEvent) => hover(dateOfTarget(event.target)),
    onPointerLeave: () => hover(null),
  };
}

function useYearModel({ data, navigation, options }: YearViewProps) {
  const settings = useMemo(() => resolveSettings(options), [options]);
  const { timeZone } = settings;
  const pinnedNow = options.now === undefined ? undefined : parseDateTime(options.now, timeZone);
  const now = useMinuteClock(pinnedNow);
  const today = now === null ? null : dateOf(now, timeZone);
  const firstDay = viewRange(ViewKind.Year, navigation.date, settings).dates.start;
  const { events, expand, calendars } = data;
  const counts = useMemo(
    () => countYear({ events, expand, calendars }, firstDay, timeZone),
    [events, expand, calendars, firstDay, timeZone],
  );
  const model = useMemo(() => buildYearModel({ firstDay, counts, settings, today }), [firstDay, counts, settings, today]);
  return { settings, model, firstDay, today };
}

export function useYearView(props: YearViewProps) {
  const { settings, model, firstDay, today } = useYearModel(props);
  const { message, announce } = useAnnouncer(settings);
  const navigation = useGridNavigation({ navigation: props.navigation, kind: ViewKind.Year, timeZone: settings.timeZone, announce });
  const list = useMonthList(model);
  const [hovered, setHovered] = useState<PlainDate | null>(null);
  const direction = textDirectionOf(settings.locale);
  const status = props.status ?? readyStatus;

  const openDay = (date: PlainDate) => {
    props.navigation.onDateChange(date);
    navigation.changeView(ViewKind.Day);
  };

  const focusOptions = { model, firstDay, anchor: props.navigation.date, direction, scrollToDate: list.scrollToDate };
  const focus = useYearFocus(focusOptions, { navigation, announce, openDay, today });

  const cellEvents = cellEventsOf(focus, openDay, setHovered);

  return {
    model,
    settings,
    direction,
    message,
    navigation,
    status,
    list,
    focus,
    cellEvents,
    readoutDate: hovered ?? focus.active,
    isBusy: status.kind === CalendarStatusKind.Loading,
    isEmpty: model.total === 0 && isShowingEvents(status),
  };
}

export type YearViewState = ReturnType<typeof useYearView>;
