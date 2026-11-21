import {
  defaultRangeExtractor,
  elementScroll,
  observeElementOffset,
  observeElementRect,
  type Range,
  type VirtualizerOptions,
} from "@tanstack/virtual-core";
import type { PlainDate } from "../../types";
import type { AgendaDay, AgendaRow } from "../group";

export enum AgendaItemKind {
  Header = "header",
  Row = "row",
}

export type AgendaItem =
  | { kind: AgendaItemKind.Header; key: string; date: PlainDate }
  | { kind: AgendaItemKind.Row; key: string; date: PlainDate; row: AgendaRow };

export type AgendaScrollElement = NonNullable<Parameters<typeof observeElementRect>[0]["scrollElement"]>;

export type AgendaItemSizes = {
  header: number;
  row: number;
};

function itemsOfDay(day: AgendaDay): AgendaItem[] {
  const header: AgendaItem = { kind: AgendaItemKind.Header, key: `header#${day.date}`, date: day.date };
  const rows = day.rows.map((row): AgendaItem => ({ kind: AgendaItemKind.Row, key: row.key, date: day.date, row }));
  return [header, ...rows];
}

export function agendaItems(days: AgendaDay[]): AgendaItem[] {
  return days.flatMap(itemsOfDay);
}

export function stickyHeaderIndex(items: AgendaItem[], startIndex: number): number {
  for (let index = Math.min(startIndex, items.length - 1); index >= 0; index -= 1) {
    const isHeader = items[index]?.kind === AgendaItemKind.Header;
    if (isHeader) {
      return index;
    }
  }
  return -1;
}

function withStickyHeader(items: AgendaItem[], range: Range): number[] {
  const indexes = defaultRangeExtractor(range);
  const sticky = stickyHeaderIndex(items, range.startIndex);
  const firstIndex = indexes[0] ?? 0;
  const isHeaderMissing = sticky >= 0 && sticky < firstIndex;
  if (!isHeaderMissing) {
    return indexes;
  }
  return [sticky, ...indexes];
}

export function agendaVirtualizerOptions(
  items: AgendaItem[],
  sizes: AgendaItemSizes,
  getScrollElement: () => AgendaScrollElement | null,
): VirtualizerOptions<AgendaScrollElement, AgendaScrollElement> {
  return {
    count: items.length,
    getScrollElement,
    estimateSize: (index) => (items[index]?.kind === AgendaItemKind.Header ? sizes.header : sizes.row),
    getItemKey: (index) => items[index]?.key ?? index,
    rangeExtractor: (range) => withStickyHeader(items, range),
    observeElementRect,
    observeElementOffset,
    scrollToFn: elementScroll,
  };
}
