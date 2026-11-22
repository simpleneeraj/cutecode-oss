import { agendaPage } from "../../agenda";
import { AgendaItemKind, type AgendaItem } from "../../agenda/virtual";
import { compareDates } from "../../time";
import type { DateRange, PlainDate } from "../../types";
import { agendaItemSizes } from "./metrics";

export const agendaWindow = {
  pageDays: 30,
  pagesAhead: 3,
  lookAheadPages: 12,
  maxPages: 24,
  fillHeight: 1120,
};

export type AgendaLoad = {
  window: DateRange;
  earlierPages: number;
  laterPages: number;
};

type ItemsFor = (window: DateRange) => AgendaItem[];

type Growth = {
  step: (load: AgendaLoad) => AgendaLoad;
  pagesOf: (load: AgendaLoad) => number;
  isDone: (load: AgendaLoad) => boolean;
};

export function initialWindow(anchor: PlainDate): DateRange {
  const before = agendaPage(anchor, -1, agendaWindow.pageDays);
  const after = agendaPage(anchor, agendaWindow.pagesAhead - 1, agendaWindow.pageDays);
  return { start: before.start, end: after.end };
}

export function extendEarlier(window: DateRange): DateRange {
  return { start: agendaPage(window.start, -1, agendaWindow.pageDays).start, end: window.end };
}

export function extendLater(window: DateRange): DateRange {
  return { start: window.start, end: agendaPage(window.end, 0, agendaWindow.pageDays).end };
}

export function sizeOfItem(item: AgendaItem | undefined): number {
  return item?.kind === AgendaItemKind.Header ? agendaItemSizes.header : agendaItemSizes.row;
}

export function offsetBefore(items: AgendaItem[], index: number): number {
  return items.slice(0, Math.max(0, index)).reduce((total, item) => total + sizeOfItem(item), 0);
}

export function anchorIndex(items: AgendaItem[], anchor: PlainDate): number {
  const index = items.findIndex((item) => item.kind === AgendaItemKind.Header && compareDates(item.date, anchor) >= 0);
  return index === -1 ? items.length : index;
}

export function prependedHeight(items: AgendaItem[], firstKey: string | undefined): number {
  const index = items.findIndex((item) => item.key === firstKey);
  return index === -1 ? 0 : offsetBefore(items, index);
}

function laterStep(load: AgendaLoad): AgendaLoad {
  return { ...load, window: extendLater(load.window), laterPages: load.laterPages + 1 };
}

function earlierStep(load: AgendaLoad): AgendaLoad {
  return { ...load, window: extendEarlier(load.window), earlierPages: load.earlierPages + 1 };
}

function growUntil(load: AgendaLoad, { step, pagesOf, isDone }: Growth): AgendaLoad {
  let next = load;
  for (let tried = 0; tried < agendaWindow.lookAheadPages; tried += 1) {
    const canGrow = pagesOf(next) < agendaWindow.maxPages && !isDone(next);
    if (!canGrow) {
      return next;
    }
    next = step(next);
  }
  return next;
}

export function heightFrom(items: AgendaItem[], anchor: PlainDate): number {
  return offsetBefore(items, items.length) - offsetBefore(items, anchorIndex(items, anchor));
}

export function initialLoad(anchor: PlainDate, itemsFor: ItemsFor): AgendaLoad {
  const load = { window: initialWindow(anchor), earlierPages: 0, laterPages: 0 };
  return growUntil(load, {
    step: laterStep,
    pagesOf: (next) => next.laterPages,
    isDone: (next) => heightFrom(itemsFor(next.window), anchor) >= agendaWindow.fillHeight,
  });
}

export function growLater(load: AgendaLoad, itemsFor: ItemsFor): AgendaLoad {
  const count = itemsFor(load.window).length;
  return growUntil(load, {
    step: laterStep,
    pagesOf: (next) => next.laterPages,
    isDone: (next) => next !== load && itemsFor(next.window).length > count,
  });
}

export function growEarlier(load: AgendaLoad, itemsFor: ItemsFor): AgendaLoad {
  const count = itemsFor(load.window).length;
  return growUntil(load, {
    step: earlierStep,
    pagesOf: (next) => next.earlierPages,
    isDone: (next) => next !== load && itemsFor(next.window).length > count,
  });
}
