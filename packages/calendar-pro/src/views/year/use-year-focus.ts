"use client";

import { commandFor } from "@cutecode/calendar/keyboard";
import { NavigationSource, type GridNavigation } from "@cutecode/calendar/parts/time-grid/use-grid-navigation";
import { AnnouncementKind, KeyboardMode, KeyCommand, ViewKind, type Announcement, type PlainDate, type TextDirection } from "@cutecode/calendar/types";
import { useRef, useState, type KeyboardEvent } from "react";

import { isInYear, stepByCommand, stepByKey } from "./focus";
import type { YearModel } from "./model";

type YearFocusOptions = {
  model: YearModel;
  firstDay: PlainDate;
  anchor: PlainDate;
  direction: TextDirection;
  scrollToDate: (date: PlainDate) => void;
};

type YearCommands = {
  navigation: GridNavigation;
  announce: (announcement: Announcement) => void;
  openDay: (date: PlainDate) => void;
  today: PlainDate | null;
};

const viewCommands: Partial<Record<KeyCommand, ViewKind>> = {
  [KeyCommand.ShowDay]: ViewKind.Day,
  [KeyCommand.ShowWeek]: ViewKind.Week,
  [KeyCommand.ShowMonth]: ViewKind.Month,
  [KeyCommand.ShowAgenda]: ViewKind.Agenda,
};

const openKeys = new Set(["Enter", " "]);

export function dateOfTarget(target: EventTarget): PlainDate | null {
  const cell = target instanceof Element ? target.closest<HTMLElement>("[data-date]") : null;
  return cell?.dataset.date ?? null;
}

function nextDateOf(command: KeyCommand | null, key: string, date: PlainDate, today: PlainDate | null) {
  if (command === KeyCommand.Today) {
    return today;
  }
  return (command === null ? null : stepByCommand(date, command)) ?? stepByKey(date, key);
}

type KeyContext = {
  active: PlainDate;
  direction: TextDirection;
  commands: YearCommands;
  moveTo: (date: PlainDate) => void;
};

function handleKey(event: KeyboardEvent<HTMLElement>, { active, direction, commands, moveTo }: KeyContext) {
  if (dateOfTarget(event.target) === null) {
    return;
  }
  if (openKeys.has(event.key)) {
    event.preventDefault();
    commands.openDay(active);
    return;
  }
  const command = commandFor(event, KeyboardMode.Browse, direction);
  const view = command === null ? undefined : viewCommands[command];
  const next = nextDateOf(command, event.key, active, commands.today);
  if (view === undefined && next === null) {
    return;
  }
  event.preventDefault();
  if (view !== undefined) {
    commands.navigation.changeView(view);
  }
  if (next !== null) {
    moveTo(next);
  }
}

export function useYearFocus(options: YearFocusOptions, commands: YearCommands) {
  const [focused, setFocused] = useState(options.anchor);
  const pendingRef = useRef(false);
  const active = isInYear(focused, options.firstDay) ? focused : options.anchor;

  const focusRef = (element: HTMLElement | null) => {
    if (element !== null && pendingRef.current) {
      pendingRef.current = false;
      element.focus();
    }
  };

  const moveTo = (date: PlainDate) => {
    pendingRef.current = true;
    setFocused(date);
    if (!isInYear(date, options.firstDay)) {
      commands.navigation.goTo(date, NavigationSource.Keyboard);
      return;
    }
    options.scrollToDate(date);
    const eventCount = options.model.days.get(date)?.count ?? 0;
    commands.announce({ kind: AnnouncementKind.DayFocused, date, eventCount });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => handleKey(event, { active, direction: options.direction, commands, moveTo });

  const syncFocus = (target: EventTarget) => {
    const date = dateOfTarget(target);
    if (date !== null && date !== active) {
      setFocused(date);
    }
  };

  return { active, focusRef, onKeyDown, syncFocus, select: setFocused };
}

export type YearFocus = ReturnType<typeof useYearFocus>;
