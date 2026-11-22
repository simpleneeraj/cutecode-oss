import { ViewKind } from "../../types";

export enum SkeletonLayout {
  Columns = "columns",
  Cells = "cells",
  Months = "months",
  Rows = "rows",
}

type SkeletonShape = {
  layout: SkeletonLayout;
  ids: string[];
};

function idsOf(prefix: string, count: number): string[] {
  return Array.from({ length: count }, (_, position) => `${prefix}-${position + 1}`);
}

export const skeletonShapes: Record<ViewKind, SkeletonShape> = {
  [ViewKind.Day]: { layout: SkeletonLayout.Columns, ids: idsOf("day", 1) },
  [ViewKind.Week]: { layout: SkeletonLayout.Columns, ids: idsOf("day", 7) },
  [ViewKind.Month]: { layout: SkeletonLayout.Cells, ids: idsOf("cell", 42) },
  [ViewKind.Year]: { layout: SkeletonLayout.Months, ids: idsOf("month", 12) },
  [ViewKind.Agenda]: { layout: SkeletonLayout.Rows, ids: idsOf("row", 6) },
};
