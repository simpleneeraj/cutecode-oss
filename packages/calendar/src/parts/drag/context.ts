"use client";

import { createContext, type PointerEvent } from "react";

import type { ChangeScope, InstantRange } from "../../types";
import type { GridColumn } from "../time-grid/columns";
import { createDragStore, type DragStore } from "./store";
import type { DeleteAsk } from "./use-delete-ask";

export type ColumnPointerHandlers = {
  onPointerDown: (event: PointerEvent<HTMLElement>) => void;
  onPointerMove: (event: PointerEvent<HTMLElement>) => void;
  onPointerUp: (event: PointerEvent<HTMLElement>) => void;
  onPointerCancel: (event: PointerEvent<HTMLElement>) => void;
};

export type ScopeControl = {
  choose: (scope: ChangeScope) => void;
  cancel: () => void;
};

export type DragBinding = {
  gridId: string | null;
  store: DragStore;
  draft: InstantRange | null;
  handlersFor: ((column: GridColumn) => ColumnPointerHandlers) | null;
  scope: ScopeControl;
  deleteAsk: DeleteAsk;
  moveHintId: string | null;
};

export const inertDragStore = createDragStore();

export const DragContext = createContext<DragBinding | null>(null);
