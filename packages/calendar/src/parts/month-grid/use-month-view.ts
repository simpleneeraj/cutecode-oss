"use client";

import { startOfMonth } from "../../time";
import { ViewKind, type PlainDate } from "../../types";
import { useMonthInteraction } from "../drag/use-month-interaction";
import { useAnnouncer } from "../live-region/use-announcer";
import { isShowingEvents, readyStatus } from "../state/status";
import type { CalendarActions, CalendarViewProps } from "../time-grid/props";
import { NavigationSource, useGridNavigation, type GridNavigation } from "../time-grid/use-grid-navigation";
import { lineCapacity } from "./metrics";
import { useMonthKeyboard } from "./use-month-keyboard";
import { useMonthModel, type MonthState } from "./use-month-model";
import { useRowHeight } from "./use-row-height";

export type MonthActions = {
  onSelect: (date: PlainDate) => void;
  onOpenDay: (date: PlainDate) => void;
  onOpen: CalendarActions["onEventOpen"];
};

function useDayActions(calendar: CalendarViewProps, month: MonthState, navigation: GridNavigation) {
  const canOpenDay = navigation.views.includes(ViewKind.Day);
  const onSelect = (date: PlainDate) => {
    const isSameMonth = startOfMonth(date) === month.anchor;
    if (isSameMonth) {
      calendar.navigation.onDateChange(date);
      return;
    }
    navigation.goTo(date, NavigationSource.Pointer);
  };
  const onOpenDay = (date: PlainDate) => {
    calendar.navigation.onDateChange(date);
    if (canOpenDay) {
      navigation.changeView(ViewKind.Day);
    }
  };
  return { onSelect, onOpenDay };
}

export function useMonthView(calendar: CalendarViewProps) {
  const { height, rowRef } = useRowHeight();
  const month = useMonthModel(calendar, lineCapacity(height));
  const { message, announce } = useAnnouncer(month.settings);
  const timeZone = month.settings.timeZone;
  const navigation = useGridNavigation({ navigation: calendar.navigation, kind: ViewKind.Month, timeZone, announce });
  const status = calendar.status ?? readyStatus;
  const { onSelect, onOpenDay } = useDayActions(calendar, month, navigation);
  const { binding, carry } = useMonthInteraction({ month, calendar, announce });
  const editing = { carry, deleteAsk: binding.deleteAsk };
  const keyboardOptions = { month, navigation, announce, onOpenDay, actions: calendar.actions, editing };
  const { gridRef, keyboard, shortcuts } = useMonthKeyboard(keyboardOptions);
  const actions: MonthActions = { onSelect, onOpenDay, onOpen: calendar.actions.onEventOpen };

  return {
    month,
    message,
    navigation,
    keyboard,
    gridRef,
    status,
    actions,
    rowRef,
    drag: binding,
    shortcuts,
    isEmpty: !month.model.hasEvents && isShowingEvents(status),
  };
}

export type MonthViewState = ReturnType<typeof useMonthView>;
