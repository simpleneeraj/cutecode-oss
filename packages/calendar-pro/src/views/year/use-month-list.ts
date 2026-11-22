"use client";

import { useIsPhone } from "@cutecode/calendar/parts/viewport/use-is-phone";
import type { PlainDate } from "@cutecode/calendar/types";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { useState } from "react";

import { monthIndexOf, type YearModel } from "./model";

const listSizes = {
  rowEstimate: 200,
  monthsPerRow: 2,
  overscan: 2,
};

export function useMonthList(model: YearModel) {
  const isPhone = useIsPhone();
  const [scrollMargin, setScrollMargin] = useState(0);
  const virtualizer = useWindowVirtualizer({
    count: Math.ceil(model.months.length / listSizes.monthsPerRow),
    estimateSize: () => listSizes.rowEstimate,
    overscan: listSizes.overscan,
    scrollMargin,
    enabled: isPhone,
  });

  const placeList = (element: HTMLElement | null) => {
    if (element !== null) {
      setScrollMargin(element.getBoundingClientRect().top + window.scrollY);
    }
  };

  const scrollToDate = (date: PlainDate) => {
    const index = monthIndexOf(date, model);
    const row = Math.floor(index / listSizes.monthsPerRow);
    const isMounted = virtualizer.getVirtualItems().some((item) => item.index === row);
    if (isPhone && index !== -1 && !isMounted) {
      virtualizer.scrollToIndex(row, { align: "start" });
    }
  };

  const monthsInRow = (row: number) =>
    model.months.slice(row * listSizes.monthsPerRow, (row + 1) * listSizes.monthsPerRow);

  return { isVirtual: isPhone, virtualizer, scrollMargin, placeList, scrollToDate, monthsInRow };
}

export type MonthList = ReturnType<typeof useMonthList>;
