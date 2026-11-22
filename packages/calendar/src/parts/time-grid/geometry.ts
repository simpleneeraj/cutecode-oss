import type { CSSProperties } from "react";

import type { SpanBar } from "../../types";
import type { Band, BlockPlacement } from "./placement";

export function rowsLength(rows: number): string {
  return `calc(var(--hour-height) * ${rows})`;
}

export function hourHeightStyle(hourHeight: number): CSSProperties {
  const properties: Record<string, string> = { "--hour-height": `${hourHeight}px` };
  return properties;
}

export function bandStyle(band: Band): CSSProperties {
  return { insetBlockStart: rowsLength(band.top), blockSize: rowsLength(band.height) };
}

export function blockStyle(placement: BlockPlacement): CSSProperties {
  const reserve = placement.isReserved ? "var(--spacing) * 7" : "0px";
  const lane = `(100% - var(--spacing) - ${reserve})`;
  return {
    insetBlockStart: rowsLength(placement.top),
    blockSize: rowsLength(placement.height),
    insetInlineStart: `calc(var(--spacing) * 0.5 + ${lane} * ${placement.column} / ${placement.columnCount})`,
    inlineSize: `calc(${lane} / ${placement.columnCount} - var(--spacing) * 0.5)`,
  };
}

export function barStyle(bar: SpanBar): CSSProperties {
  return { gridColumn: `${bar.startIndex + 1} / span ${bar.length}`, gridRow: bar.lane + 1 };
}

export function columnsStyle(count: number): CSSProperties {
  return { gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` };
}
