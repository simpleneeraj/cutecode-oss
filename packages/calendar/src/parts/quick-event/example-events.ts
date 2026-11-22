"use client";

import { toastManager } from "@cutecode/ui/components/toast";
import { useRef, useState } from "react";

import { applyEventChange, duplicateOccurrence, lastChange, recordChange, removeOccurrence, startHistory, undoChange, undoEntry } from "../../event";
import { makeEvent } from "../../testing";
import {
  ChangeScope,
  type CalendarEvent,
  type ChangeApplier,
  type EventChange,
  type EventOccurrence,
} from "../../types";
import type { QuickEventActions, QuickEventDraft } from "./target";

type EventsUpdate = (events: CalendarEvent[]) => CalendarEvent[];

export type SaveApplier = (events: CalendarEvent[], draft: QuickEventDraft) => CalendarEvent[];

const historyCopy = {
  create: "Create event",
  edit: "Edit event",
  move: "Move event",
  duplicate: "Duplicate event",
  delete: "Delete event",
  deleted: (title: string) => `Deleted ${title}`,
  undoHint: "Press Command Z to undo.",
  undo: "Undo",
  undone: (label: string) => `${label} undone`,
};

export function savedEvents(events: CalendarEvent[], draft: QuickEventDraft): CalendarEvent[] {
  const { eventId, source, ...fields } = draft;
  if (eventId === undefined) {
    return [...events, makeEvent({ ...fields, id: `${source}-${crypto.randomUUID()}` })];
  }
  return events.map((event) => (event.id === eventId ? { ...event, ...fields, version: event.version + 1 } : event));
}

function withCopy(occurrence: EventOccurrence): EventsUpdate {
  return (events) => [...events, duplicateOccurrence(occurrence, `copy-${crypto.randomUUID()}`, Date.now())];
}

function useDeleteToast() {
  const toastRef = useRef<string | null>(null);
  const close = () => {
    if (toastRef.current !== null) {
      toastManager.close(toastRef.current);
    }
    toastRef.current = null;
  };
  const show = (title: string, onUndo: () => void) => {
    close();
    const actionProps = { children: historyCopy.undo, onClick: onUndo };
    toastRef.current = toastManager.add({ title: historyCopy.deleted(title), description: historyCopy.undoHint, actionProps });
  };
  return { show, close };
}

export function useExampleEvents(
  initial: CalendarEvent[],
  applyChange: ChangeApplier = applyEventChange,
  applySave: SaveApplier = savedEvents,
) {
  const [history, setHistory] = useState(() => startHistory(initial));
  const deleteToast = useDeleteToast();
  const record = (label: string, update: EventsUpdate) => {
    deleteToast.close();
    setHistory((current) => recordChange(current, label, update(current.events)));
  };
  const undo = () => {
    const entry = lastChange(history);
    if (entry === null) {
      return false;
    }
    setHistory(undoChange);
    toastManager.add({ title: historyCopy.undone(entry.label) });
    return true;
  };
  const deleteOccurrence = (occurrence: EventOccurrence, scope = ChangeScope.All) => {
    const deleted = recordChange(history, historyCopy.delete, removeOccurrence(history.events, occurrence, scope, Date.now()));
    const entry = lastChange(deleted);
    setHistory(deleted);
    deleteToast.show(occurrence.event.title, () => entry !== null && setHistory((current) => undoEntry(current, entry)));
  };
  const actions: QuickEventActions = {
    onSave: (draft) => record(draft.eventId === undefined ? historyCopy.create : historyCopy.edit, (events) => applySave(events, draft)),
    onDelete: deleteOccurrence,
  };
  const changeEvent = (change: EventChange) =>
    record(historyCopy.move, (events) => applyChange(events, change, Date.now()));
  const editing = {
    onEventDelete: deleteOccurrence,
    onEventDuplicate: (occurrence: EventOccurrence) => record(historyCopy.duplicate, withCopy(occurrence)),
    onUndo: undo,
  };
  return { events: history.events, actions, changeEvent, editing };
}
