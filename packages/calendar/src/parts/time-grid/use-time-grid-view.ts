"use client";

import { ViewKind } from "../../types";
import { useGridInteraction } from "../drag/use-grid-interaction";
import { useAnnouncer } from "../live-region/use-announcer";
import { isShowingEvents, readyStatus } from "../state/status";
import type { FoldOpen } from "./axis";
import type { GridColumn } from "./columns";
import { FoldEdge } from "./fold";
import type { TimeGridActions } from "./index";
import type { CalendarViewProps } from "./props";
import { useGridKeyboard } from "./use-grid-keyboard";
import { useGridNavigation } from "./use-grid-navigation";
import { useTimeGridModel, type GridKind } from "./use-time-grid-model";

function toggledFold(open: FoldOpen, edge: FoldEdge): FoldOpen {
  return edge === FoldEdge.Earlier ? { ...open, earlier: !open.earlier } : { ...open, later: !open.later };
}

export function useTimeGridView(calendar: CalendarViewProps, kind: GridKind, dayCount?: number) {
  const { model, now, fold } = useTimeGridModel(calendar, kind, dayCount);
  const { message, announce } = useAnnouncer(model.settings);
  const timeZone = model.settings.timeZone;
  const navigation = useGridNavigation({ navigation: calendar.navigation, kind, timeZone, announce });
  const { binding, keyboardEdit } = useGridInteraction({
    model,
    options: calendar.options,
    actions: calendar.actions,
    announce,
  });
  const editing = { actions: calendar.actions, keyboardEdit, deleteAsk: binding.deleteAsk };
  const { gridRef, keyboard, shortcuts } = useGridKeyboard({ model, now, fold, navigation, announce, editing });
  const status = calendar.status ?? readyStatus;
  const canOpenDay = kind !== ViewKind.Day && navigation.views.includes(ViewKind.Day);

  const openDay = (column: GridColumn) => {
    calendar.navigation.onDateChange(column.column.day.date);
    navigation.changeView(ViewKind.Day);
  };

  const actions: TimeGridActions = {
    onOpen: calendar.actions.onEventOpen,
    onOpenDay: canOpenDay ? openDay : null,
    onToggleFold: (edge) => fold.setOpen(toggledFold(fold.open, edge)),
  };

  return {
    model,
    message,
    navigation,
    gridRef,
    keyboard,
    status,
    actions,
    drag: binding,
    shortcuts,
    isEmpty: !model.hasEvents && isShowingEvents(status),
  };
}

export type TimeGridViewState = ReturnType<typeof useTimeGridView>;
