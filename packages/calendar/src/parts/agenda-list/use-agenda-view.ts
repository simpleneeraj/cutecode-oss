"use client";

import { resolveSettings, textDirectionOf } from "../../locale";
import { dateOf } from "../../time";
import { ViewKind } from "../../types";
import type { BlockView } from "../event-block/appearance";
import { useAnnouncer } from "../live-region/use-announcer";
import { CalendarStatusKind, readyStatus } from "../state/status";
import { HourZoom, hourHeights, type CalendarViewProps } from "../time-grid/props";
import { useGridNavigation } from "../time-grid/use-grid-navigation";
import type { AgendaListContext } from "./index";
import { agendaHeading } from "./row-text";
import { useAgendaItems } from "./use-agenda-items";

export function useAgendaView(calendar: CalendarViewProps) {
  const { data, navigation, options } = calendar;
  const settings = resolveSettings(options);
  const { timeZone } = settings;
  const { message, announce } = useAnnouncer(settings);
  const gridNavigation = useGridNavigation({ navigation, kind: ViewKind.Agenda, timeZone, announce });
  const source = useAgendaItems(data, settings);
  const { now } = source;
  const view: BlockView = { settings, now, hourHeight: hourHeights[HourZoom.Regular], viewerId: options.viewerId };
  const list: AgendaListContext = {
    anchor: navigation.date,
    today: now === null ? null : dateOf(now, timeZone),
    view,
    calendars: data.calendars,
    onOpen: calendar.actions.onEventOpen,
  };
  const status = calendar.status ?? readyStatus;

  return {
    heading: agendaHeading(navigation.date, settings),
    direction: textDirectionOf(settings.locale),
    navigation: gridNavigation,
    message,
    list,
    source,
    status,
    isBusy: status.kind === CalendarStatusKind.Loading,
  };
}
