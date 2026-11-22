import { addDays, startOfDay } from "../../time";
import { AnnouncementKind, KeyCommand, type PlainDate } from "../../types";
import type { MonthItem } from "../drag/month-session";
import type { DeleteAsk } from "../drag/use-delete-ask";
import type { MonthCarry } from "../drag/use-month-carry";
import { defaultCalendarId } from "../drag/use-slot-create";
import { lockedAnnouncement } from "../time-grid/grid-commands";
import { runSharedCommand, type SharedCommandContext } from "../shortcuts/shared-commands";
import type { CalendarActions } from "../time-grid/props";
import { dayKey } from "./focus";
import type { MonthState } from "./use-month-model";

export type MonthCommandContext = SharedCommandContext & {
  month: MonthState;
  actions: CalendarActions;
};

export type MonthItemContext = MonthCommandContext & {
  carry: MonthCarry;
  deleteAsk: DeleteAsk;
};

function createOnDay(date: PlainDate, isQuickAdd: boolean, context: MonthCommandContext): boolean {
  const { onSlotCreate, onQuickAdd } = context.actions;
  const handler = isQuickAdd ? (onQuickAdd ?? onSlotCreate) : onSlotCreate;
  const calendarId = defaultCalendarId(context.month.calendars);
  if (handler === undefined || calendarId === null) {
    return false;
  }
  const { timeZone } = context.month.settings;
  const slot = { start: startOfDay(date, timeZone), end: startOfDay(addDays(date, 1), timeZone), allDay: true, calendarId };
  const cell = context.root?.querySelector<HTMLElement>(`[data-focus-key="${CSS.escape(dayKey(date))}"]`) ?? null;
  handler(slot, cell);
  return true;
}

export function runMonthEditCommand(command: KeyCommand, date: PlainDate, context: MonthCommandContext): boolean {
  if (command === KeyCommand.NewEvent || command === KeyCommand.QuickAdd) {
    return createOnDay(date, command === KeyCommand.QuickAdd, context);
  }
  return runSharedCommand(command, context);
}

function isLocked(item: MonthItem, context: MonthCommandContext): boolean {
  const locked = lockedAnnouncement(item.occurrence, context.month.calendars);
  if (locked !== null) {
    context.announce(locked);
  }
  return locked !== null;
}

function deleteItem(item: MonthItem, context: MonthItemContext): boolean {
  if (!context.deleteAsk.canDelete) {
    return false;
  }
  if (!isLocked(item, context)) {
    context.deleteAsk.ask({ occurrence: item.occurrence, onDeleted: context.refocus });
  }
  return true;
}

function duplicateItem(item: MonthItem, context: MonthItemContext): boolean {
  const onDuplicate = context.actions.onEventDuplicate;
  if (onDuplicate === undefined) {
    return false;
  }
  if (!isLocked(item, context)) {
    onDuplicate(item.occurrence);
    context.announce({ kind: AnnouncementKind.Duplicated, title: item.occurrence.event.title });
  }
  return true;
}

export function runMonthItemCommand(command: KeyCommand, item: MonthItem, context: MonthItemContext): boolean {
  switch (command) {
    case KeyCommand.PickUp:
      return context.carry.pickUp(item);
    case KeyCommand.DeleteEvent:
      return deleteItem(item, context);
    case KeyCommand.DuplicateEvent:
      return duplicateItem(item, context);
    default:
      return runSharedCommand(command, context);
  }
}
