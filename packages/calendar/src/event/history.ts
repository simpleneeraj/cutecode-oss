import type { CalendarEvent } from "../types";

export type HistoryEntry = {
  label: string;
  events: CalendarEvent[];
};

export type EventHistory = {
  events: CalendarEvent[];
  past: HistoryEntry[];
};

export const historyLimit = 20;

export function startHistory(events: CalendarEvent[]): EventHistory {
  return { events, past: [] };
}

export function recordChange(history: EventHistory, label: string, next: CalendarEvent[]): EventHistory {
  const entry: HistoryEntry = { label, events: history.events };
  return { events: next, past: [...history.past, entry].slice(-historyLimit) };
}

export function lastChange(history: EventHistory): HistoryEntry | null {
  return history.past.at(-1) ?? null;
}

export function undoChange(history: EventHistory): EventHistory {
  const entry = lastChange(history);
  if (entry === null) {
    return history;
  }
  return { events: entry.events, past: history.past.slice(0, -1) };
}

export function undoEntry(history: EventHistory, entry: HistoryEntry): EventHistory {
  return lastChange(history) === entry ? undoChange(history) : history;
}
