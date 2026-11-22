"use client";

import { use } from "react";

import { DragKind, type PlainDate } from "../../types";
import { DragContext, inertDragStore } from "./context";
import { useDragSourceRef } from "./source";
import { slotLookOf, useDragState } from "./store";

export function useDragItem(itemKey: string, date: PlainDate) {
  const drag = use(DragContext);
  const store = drag?.store ?? inertDragStore;
  const ref = useDragSourceRef(drag?.gridId ?? null, itemKey, date, DragKind.Move);
  const look = useDragState(store, (state) => slotLookOf(state, itemKey, date));
  return { ref, look, store };
}
