"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef, useState } from "react";
import { flushSync } from "react-dom";

import { agendaVirtualizerOptions, stickyHeaderIndex, type AgendaItem } from "../../agenda/virtual";
import type { DateRange, PlainDate } from "../../types";
import { agendaItemSizes, agendaScroll } from "./metrics";
import { anchorIndex, growEarlier, growLater, initialLoad, offsetBefore, prependedHeight } from "./window";

type AgendaScrollOptions = {
  anchor: PlainDate;
  itemsFor: (window: DateRange) => AgendaItem[];
};

export function useAgendaScroll({ anchor, itemsFor }: AgendaScrollOptions) {
  const [load, setLoad] = useState(() => initialLoad(anchor, itemsFor));
  const scrollRef = useRef<HTMLDivElement>(null);
  const items = itemsFor(load.window);
  const virtualizer = useVirtualizer({
    ...agendaVirtualizerOptions(items, agendaItemSizes, () => scrollRef.current),
    initialOffset: () => offsetBefore(items, anchorIndex(items, anchor)),
  });

  const prependPage = (element: HTMLElement) => {
    const next = growEarlier(load, itemsFor);
    if (next === load) {
      return;
    }
    const shift = prependedHeight(itemsFor(next.window), items[0]?.key);
    flushSync(() => setLoad(next));
    element.scrollTop += shift;
  };

  const onScroll = () => {
    const element = scrollRef.current;
    if (element === null) {
      return;
    }
    const distanceToEnd = element.scrollHeight - element.scrollTop - element.clientHeight;
    const isNearEnd = distanceToEnd < agendaScroll.edgeDistance;
    if (isNearEnd) {
      setLoad(growLater(load, itemsFor));
      return;
    }
    const isNearStart = element.scrollTop < agendaScroll.edgeDistance;
    if (isNearStart) {
      prependPage(element);
    }
  };

  const stickyIndex = stickyHeaderIndex(items, virtualizer.range?.startIndex ?? 0);
  return { items, scrollRef, virtualizer, onScroll, stickyIndex };
}
