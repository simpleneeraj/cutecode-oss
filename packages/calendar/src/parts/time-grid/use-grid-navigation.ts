"use client";

import { flushSync } from "react-dom";

import { navigate } from "../../range";
import { dateOf } from "../../time";
import { AnnouncementKind, type Announcement, type PlainDate, type ViewKind } from "../../types";
import { allViews } from "../calendar-toolbar/view-options";
import { useViewSwitch } from "../view-motion/use-view-switch";
import type { CalendarNavigation } from "./props";

export enum NavigationSource {
  Pointer = "pointer",
  Keyboard = "keyboard",
}

type GridNavigationOptions = {
  navigation: CalendarNavigation;
  kind: ViewKind;
  timeZone: string;
  announce: (announcement: Announcement) => void;
};

export function useGridNavigation({ navigation, kind, timeZone, announce }: GridNavigationOptions) {
  const viewSwitch = useViewSwitch();
  const views = navigation.views ?? allViews;

  const goTo = (date: PlainDate, source: NavigationSource) => {
    const update = () => navigation.onDateChange(date);
    if (source === NavigationSource.Keyboard) {
      flushSync(update);
    } else {
      viewSwitch.switchView(update);
    }
    announce({ kind: AnnouncementKind.Navigated, view: kind, anchor: date });
  };

  const changeView = (view: ViewKind) => {
    const isAvailable = views.includes(view);
    if (!isAvailable) {
      return;
    }
    viewSwitch.switchView(() => navigation.onViewChange(view));
    announce({ kind: AnnouncementKind.ViewChanged, view });
  };

  const steps = {
    onPrevious: () => goTo(navigate(kind, navigation.date, -1), NavigationSource.Pointer),
    onNext: () => goTo(navigate(kind, navigation.date, 1), NavigationSource.Pointer),
    onToday: () => goTo(dateOf(Date.now(), timeZone), NavigationSource.Pointer),
  };

  return { goTo, changeView, steps, viewSwitch, views };
}

export type GridNavigation = ReturnType<typeof useGridNavigation>;
