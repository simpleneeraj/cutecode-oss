"use client";

import { useSyncExternalStore } from "react";

import { milliseconds } from "../../time";
import type { Instant } from "../../types";

type ClockState = {
  now: Instant;
  timer: ReturnType<typeof setTimeout> | undefined;
  listeners: Set<() => void>;
};

const clock: ClockState = { now: floorToMinute(Date.now()), timer: undefined, listeners: new Set() };

function floorToMinute(instant: Instant): Instant {
  return Math.floor(instant / milliseconds.minute) * milliseconds.minute;
}

function stop() {
  clearTimeout(clock.timer);
  clock.timer = undefined;
}

function tick() {
  clock.now = floorToMinute(Date.now());
  clock.listeners.forEach((listener) => listener());
  const untilNextMinute = milliseconds.minute - (Date.now() % milliseconds.minute);
  clock.timer = setTimeout(tick, untilNextMinute);
}

function syncVisibility() {
  stop();
  const isVisible = document.visibilityState === "visible";
  if (isVisible) {
    tick();
  }
}

function subscribe(listener: () => void) {
  clock.listeners.add(listener);
  const isFirst = clock.listeners.size === 1;
  if (isFirst) {
    document.addEventListener("visibilitychange", syncVisibility);
    syncVisibility();
  }
  return () => {
    clock.listeners.delete(listener);
    const isLast = clock.listeners.size === 0;
    if (isLast) {
      document.removeEventListener("visibilitychange", syncVisibility);
      stop();
    }
  };
}

function readNow(): Instant | null {
  return clock.now;
}

function readServerNow(): Instant | null {
  return null;
}

function subscribeNowhere() {
  return () => undefined;
}

export function useMinuteClock(pinned?: Instant): Instant | null {
  const isPinned = pinned !== undefined;
  const now = useSyncExternalStore(isPinned ? subscribeNowhere : subscribe, readNow, readServerNow);
  return isPinned ? pinned : now;
}
