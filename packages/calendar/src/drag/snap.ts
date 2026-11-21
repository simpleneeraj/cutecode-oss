import type { DragSettings, Instant, SlotPoint } from "../types";
import { dateOf, milliseconds, startOfDay } from "../time";

export const defaultDragSettings: DragSettings = {
  snapMinutes: 15,
  createSnapMinutes: 30,
  defaultDurationMinutes: 60,
  minimumDurationMinutes: 15,
};

export function snapMinute(minute: number, step: number): number {
  if (step <= 0) {
    return minute;
  }
  return Math.round(minute / step) * step;
}

export function snapMinuteDown(minute: number, step: number): number {
  if (step <= 0) {
    return minute;
  }
  return Math.floor(minute / step) * step;
}

export function snapMinuteUp(minute: number, step: number): number {
  if (step <= 0) {
    return minute;
  }
  return Math.ceil(minute / step) * step;
}

export function slotInstant(point: SlotPoint, timeZone: string): Instant {
  return startOfDay(point.date, timeZone) + point.minute * milliseconds.minute;
}

export function slotPointAt(instant: Instant, timeZone: string, point: SlotPoint): SlotPoint {
  const date = dateOf(instant, timeZone);
  const minute = (instant - startOfDay(date, timeZone)) / milliseconds.minute;
  return { ...point, date, minute };
}

export function edgeScrollVelocity(distanceFromEdge: number, edgeSize: number, maxVelocity: number): number {
  const isOutsideEdge = edgeSize <= 0 || distanceFromEdge >= edgeSize;
  if (isOutsideEdge) {
    return 0;
  }
  const closeness = 1 - Math.max(distanceFromEdge, 0) / edgeSize;
  return maxVelocity * closeness;
}
