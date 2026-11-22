import type { CSSProperties } from "react";

import type { SpanBar } from "../../types";
import { monthMetrics } from "./metrics";

export function barSlotStyle(bar: SpanBar): CSSProperties {
  return {
    insetBlockStart: `${monthMetrics.dateHeight + bar.lane * monthMetrics.lineHeight}px`,
    inlineSize: `calc(${bar.length * 100}% + ${bar.length - 1}px)`,
  };
}

export function chipsStyle(lanes: number): CSSProperties {
  return { paddingBlockStart: `${lanes * monthMetrics.lineHeight}px` };
}

export function weeksStyle(count: number): CSSProperties {
  return { gridTemplateRows: `repeat(${count}, minmax(0, 1fr))` };
}
