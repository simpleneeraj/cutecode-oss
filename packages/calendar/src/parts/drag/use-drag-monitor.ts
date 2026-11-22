"use client";

import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { monitorForElements, type ElementEventBasePayload } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { autoScrollWindowForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";
import { useEffect, useEffectEvent } from "react";

type DragHandler = (payload: ElementEventBasePayload) => void;

export type DragHandlers = {
  start: DragHandler;
  move: DragHandler;
  drop: DragHandler;
};

export function useDragMonitor(gridId: string, isEditable: boolean, handlers: DragHandlers) {
  const start = useEffectEvent(handlers.start);
  const move = useEffectEvent(handlers.move);
  const drop = useEffectEvent(handlers.drop);

  useEffect(() => {
    if (!isEditable) {
      return undefined;
    }
    const isOurs = (data: Record<string, unknown>) => data.gridId === gridId;
    return combine(
      monitorForElements({
        canMonitor: ({ source }) => isOurs(source.data),
        onDragStart: (payload) => start(payload),
        onDrag: (payload) => move(payload),
        onDrop: (payload) => drop(payload),
      }),
      autoScrollWindowForElements({ canScroll: ({ source }) => isOurs(source.data) }),
    );
  }, [gridId, isEditable]);
}
