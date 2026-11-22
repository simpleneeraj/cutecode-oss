import type { DraftRange } from "../time-grid/props";
import { QuickEventMode, type QuickEventTarget } from "./target";

export const quickEventCopy = {
  newEvent: "New event",
  add: "Add event",
  save: "Save",
};

export function targetKey(target: QuickEventTarget): string {
  if (target.mode === QuickEventMode.Read) {
    return `event|${target.occurrence.key}`;
  }
  return `new|${target.slot.start}|${target.slot.end}|${target.slot.allDay}`;
}

export function targetLabel(target: QuickEventTarget): string {
  return target.mode === QuickEventMode.Read ? target.occurrence.event.title : quickEventCopy.newEvent;
}

export function draftOf(target: QuickEventTarget | null): DraftRange | null {
  if (target?.mode !== QuickEventMode.Create || target.slot.allDay) {
    return null;
  }
  return { start: target.slot.start, end: target.slot.end, resourceId: target.slot.resourceId };
}
