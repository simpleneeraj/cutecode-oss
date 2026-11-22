"use client";

import { useCallback, useState } from "react";

import { monthMetrics } from "./metrics";

export function useRowHeight() {
  const [height, setHeight] = useState(monthMetrics.estimatedRowHeight);
  const rowRef = useCallback((element: HTMLDivElement | null) => {
    if (element === null) {
      return;
    }
    const observer = new ResizeObserver(([entry]) => {
      if (entry !== undefined) {
        setHeight(Math.round(entry.contentRect.height));
      }
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return { height, rowRef };
}
