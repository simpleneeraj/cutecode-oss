import { calendarOf, isEventReadOnly } from "../../event";
import {
  AnnouncementKind,
  FocusTarget,
  KeyCommand,
  type Announcement,
  type Calendar,
  type EventOccurrence,
  type GridFocus,
  type SlotFocus,
} from "../../types";
import type { DeleteAsk } from "../drag/use-delete-ask";
import type { KeyboardEdit } from "../drag/use-keyboard-edit";
import { focusKeyOf } from "../roving-focus/focus-key";
import { runSharedCommand, type SharedCommandContext } from "../shortcuts/shared-commands";
import type { GridModel } from "./model";
import type { CalendarActions } from "./props";

export type GridEditing = {
  actions: CalendarActions;
  keyboardEdit: KeyboardEdit;
  deleteAsk: DeleteAsk;
};

export type GridCommandContext = SharedCommandContext &
  GridEditing & {
    model: GridModel;
    moveTo: (focus: GridFocus) => void;
  };

type OccurrenceHandler = ((occurrence: EventOccurrence) => void) | undefined;

const createCommands: ReadonlySet<KeyCommand> = new Set([KeyCommand.NewEvent, KeyCommand.QuickAdd]);

const fallbackCalendarName = "This calendar";

function focusedOccurrence(focus: GridFocus, model: GridModel): EventOccurrence | undefined {
  return focus.target === FocusTarget.Event ? model.occurrenceByKey.get(focus.occurrenceKey) : undefined;
}

function elementOf(focus: GridFocus, root: HTMLElement | null): HTMLElement | null {
  return root?.querySelector<HTMLElement>(`[data-focus-key="${CSS.escape(focusKeyOf(focus))}"]`) ?? null;
}

export function slotUnder(focus: GridFocus): SlotFocus {
  return { target: FocusTarget.Slot, date: focus.date, minute: focus.minute, columnKey: focus.columnKey };
}

export function lockedAnnouncement(occurrence: EventOccurrence, calendars: Calendar[]): Announcement | null {
  const { event } = occurrence;
  if (!isEventReadOnly(event, calendars)) {
    return null;
  }
  const calendarName = calendarOf(event, calendars)?.name ?? fallbackCalendarName;
  return { kind: AnnouncementKind.ReadOnly, title: event.title, calendarName };
}

function editOccurrence(
  occurrence: EventOccurrence,
  handler: OccurrenceHandler,
  done: Announcement,
  context: GridCommandContext,
): boolean {
  if (handler === undefined) {
    return false;
  }
  const locked = lockedAnnouncement(occurrence, context.model.calendars);
  context.announce(locked ?? done);
  if (locked === null) {
    handler(occurrence);
  }
  return true;
}

function deleteOccurrence(occurrence: EventOccurrence, focus: GridFocus, context: GridCommandContext): boolean {
  const { deleteAsk } = context;
  if (!deleteAsk.canDelete) {
    return false;
  }
  const locked = lockedAnnouncement(occurrence, context.model.calendars);
  if (locked !== null) {
    context.announce(locked);
    return true;
  }
  deleteAsk.ask({ occurrence, onDeleted: () => context.moveTo(slotUnder(focus)) });
  return true;
}

function runEventCommand(command: KeyCommand, focus: GridFocus, context: GridCommandContext): boolean {
  const occurrence = focusedOccurrence(focus, context.model);
  if (occurrence === undefined) {
    return false;
  }
  const { title } = occurrence.event;
  switch (command) {
    case KeyCommand.DeleteEvent:
      return deleteOccurrence(occurrence, focus, context);
    case KeyCommand.DuplicateEvent:
      return editOccurrence(occurrence, context.actions.onEventDuplicate, { kind: AnnouncementKind.Duplicated, title }, context);
    case KeyCommand.PickUp: {
      const element = elementOf(focus, context.root);
      return element !== null && context.keyboardEdit.pickUp(occurrence, element);
    }
    default:
      return false;
  }
}

function runCreateCommand(command: KeyCommand, focus: GridFocus, context: GridCommandContext): boolean {
  const { onSlotCreate, onQuickAdd } = context.actions;
  const isQuickAdd = command === KeyCommand.QuickAdd;
  const handler = isQuickAdd ? (onQuickAdd ?? onSlotCreate) : onSlotCreate;
  if (handler === undefined) {
    return false;
  }
  const point = { date: focus.date, minute: focus.minute, columnKey: focus.columnKey };
  context.keyboardEdit.createAt(point, context.root, handler);
  return true;
}

export function runEditCommand(command: KeyCommand, focus: GridFocus, context: GridCommandContext): boolean {
  if (createCommands.has(command)) {
    return runCreateCommand(command, focus, context);
  }
  return runEventCommand(command, focus, context) || runSharedCommand(command, context);
}
