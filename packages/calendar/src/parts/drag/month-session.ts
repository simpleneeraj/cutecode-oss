import { DragKind, type EventOccurrence, type MoveIntent, type PlainDate } from "../../types";
import type { MonthModel } from "../month-grid/model";
import { monthMoveIntent } from "./month-intent";
import type { DropCell } from "./source";
import { ignoreEnd, type DragSession, type DropFlow } from "./use-drop-flow";
import { restPose, type Pose } from "./visual";

export const monthCellSelector = '[data-slot="month-cell"]';
export const monthItemSelector = '[data-slot="month-drag-item"]';
const chipsSelector = '[data-slot="month-chips"]';

export type MonthItem = {
  occurrence: EventOccurrence;
  element: HTMLElement;
  origin: DropCell;
};

export function occurrencesOf(model: MonthModel): Map<string, EventOccurrence> {
  const byKey = new Map<string, EventOccurrence>();
  model.weeks.forEach((week) =>
    week.days.forEach((day) => {
      day.chips.forEach((occurrence) => byKey.set(occurrence.key, occurrence));
      day.bars.forEach((bar) => byKey.set(bar.key, bar.occurrence));
    }),
  );
  return byKey;
}

export function cellOf(element: Element): DropCell | null {
  const cell = element.closest(monthCellSelector);
  const date = cell?.getAttribute("data-date") ?? null;
  if (cell === null || date === null) {
    return null;
  }
  return { date, element: cell };
}

export function cellOn(root: Element | null, date: PlainDate): DropCell | null {
  const cell = root?.querySelector(`${monthCellSelector}[data-date="${date}"]`) ?? null;
  return cell === null ? null : { date, element: cell };
}

function unclipChips(element: HTMLElement): () => void {
  const chips = element.closest<HTMLElement>(chipsSelector);
  if (chips === null) {
    return ignoreEnd;
  }
  chips.style.overflow = "visible";
  return () => {
    chips.style.overflow = "";
  };
}

export function cellPose(session: DragSession): Pose {
  const target = session.target.element.getBoundingClientRect();
  const origin = session.origin.element.getBoundingClientRect();
  return { x: target.left - origin.left, y: target.top - origin.top, height: null };
}

export function monthSessionOf(item: MonthItem, intent: MoveIntent, flow: DropFlow, gridId: string): DragSession {
  const { occurrence, element, origin } = item;
  const rect = element.getBoundingClientRect();
  return {
    source: { gridId, key: occurrence.key, date: origin.date, kind: DragKind.Move },
    occurrence,
    element,
    origin,
    target: origin,
    grab: intent.grab,
    originRect: origin.element.getBoundingClientRect(),
    pointer: { x: rect.left, y: rect.top },
    home: { top: element.offsetTop, height: element.offsetHeight },
    pose: restPose,
    blockSize: element.style.blockSize,
    result: flow.resolve(intent),
    unclip: unclipChips(element),
    onEnd: ignoreEnd,
  };
}

export function monthItemOf(target: EventTarget, model: MonthModel): MonthItem | null {
  const element = target instanceof Element ? target.closest<HTMLElement>(monthItemSelector) : null;
  const key = element?.dataset.occurrenceKey;
  const occurrence = key === undefined ? undefined : occurrencesOf(model).get(key);
  const origin = element === null ? null : cellOf(element);
  if (element === null || occurrence === undefined || origin === null) {
    return null;
  }
  return { occurrence, element, origin };
}

export function monthIntentOf(item: MonthItem, target: PlainDate, timeZone: string): MoveIntent {
  return monthMoveIntent(item.occurrence, item.origin.date, target, timeZone);
}
