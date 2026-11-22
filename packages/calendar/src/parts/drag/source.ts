"use client";

import { draggable, dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { disableNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview";
import type { DropTargetRecord } from "@atlaskit/pragmatic-drag-and-drop/types";
import { useCallback } from "react";

import { DragKind, type PlainDate } from "../../types";

export type DragSourceData = {
  gridId: string;
  key: string;
  date: PlainDate;
  kind: DragKind;
};

export type DropCell = {
  date: PlainDate;
  columnKey?: string;
  element: Element;
};

function isDragKind(value: unknown): value is DragKind {
  return Object.values(DragKind).some((kind) => kind === value);
}

export function dragSourceOf(data: Record<string, unknown>, gridId: string): DragSourceData | null {
  const { key, date, kind } = data;
  const isOurs = data.gridId === gridId && typeof key === "string" && typeof date === "string";
  if (!isOurs || !isDragKind(kind)) {
    return null;
  }
  return { gridId, key, date, kind };
}

export function dropCellOf(targets: DropTargetRecord[], gridId: string): DropCell | null {
  for (const target of targets) {
    const { date, columnKey } = target.data;
    if (target.data.gridId === gridId && typeof date === "string") {
      return { date, columnKey: typeof columnKey === "string" ? columnKey : undefined, element: target.element };
    }
  }
  return null;
}

export function useDragSourceRef(gridId: string | null, key: string, date: PlainDate, kind: DragKind) {
  return useCallback(
    (element: HTMLElement | null) => {
      if (element === null || gridId === null) {
        return undefined;
      }
      return draggable({
        element,
        getInitialData: () => ({ gridId, key, date, kind }),
        onGenerateDragPreview: ({ nativeSetDragImage }) => disableNativeDragPreview({ nativeSetDragImage }),
      });
    },
    [gridId, key, date, kind],
  );
}

function cellData(gridId: string, date: PlainDate | null, columnKey: string | undefined) {
  if (date === null) {
    return { gridId };
  }
  return columnKey === undefined ? { gridId, date } : { gridId, date, columnKey };
}

export function useDropCellRef(gridId: string | null, date: PlainDate | null, columnKey?: string) {
  return useCallback(
    (element: HTMLElement | null) => {
      if (element === null || gridId === null) {
        return undefined;
      }
      return dropTargetForElements({
        element,
        getData: () => cellData(gridId, date, columnKey),
        canDrop: ({ source }) => source.data.gridId === gridId,
      });
    },
    [gridId, date, columnKey],
  );
}

export function useLanesDropRef(gridId: string | null) {
  return useCallback(
    (element: HTMLElement | null) => {
      if (element === null || gridId === null) {
        return undefined;
      }
      return dropTargetForElements({
        element,
        getData: () => ({ gridId }),
        canDrop: ({ source }) => source.data.gridId === gridId,
      });
    },
    [gridId],
  );
}
