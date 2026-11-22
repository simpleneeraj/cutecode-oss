import { minuteAtOffset, offsetAt } from "../time-grid/axis";
import type { GridColumn } from "../time-grid/columns";
import type { GridModel } from "../time-grid/model";
import { milliseconds } from "../../time";
import { ChangeSource, DragKind, OccurrenceKind, type DragIntent, type Instant, type SlotPoint } from "../../types";
import type { DragSession } from "./use-drop-flow";
import type { DropCell } from "./source";
import type { Pose } from "./visual";

type PointerInput = {
  clientX: number;
  clientY: number;
};

const minimumHeight = 18;

export const columnSelector = '[data-slot="day-column"]';

export const slotSelector = '[data-slot="event-slot"]';

export function originOf(element: HTMLElement): DropCell | null {
  const column = element.closest(columnSelector);
  const date = column?.getAttribute("data-date") ?? null;
  if (column === null || date === null) {
    return null;
  }
  return { date, columnKey: column.getAttribute("data-column-key") ?? undefined, element: column };
}

function isColumnOf(column: GridColumn, columnKey: string | undefined): boolean {
  return columnKey === undefined || column.focusKey === columnKey;
}

function columnOn(model: GridModel, cell: Pick<DropCell, "date" | "columnKey">): GridColumn | undefined {
  return model.columns.find((column) => column.column.day.date === cell.date && isColumnOf(column, cell.columnKey));
}

function columnAt(model: GridModel, instant: Instant, columnKey: string | undefined): GridColumn | undefined {
  return model.columns.find(
    (column) => column.column.day.start <= instant && instant < column.column.day.end && isColumnOf(column, columnKey),
  );
}

function minuteIn(column: GridColumn, instant: Instant): number {
  return (instant - column.column.day.start) / milliseconds.minute;
}

export function gridPointAt(clientY: number, cell: DropCell, model: GridModel): SlotPoint | null {
  const column = columnOn(model, cell);
  if (column === undefined) {
    return null;
  }
  const rows = (clientY - cell.element.getBoundingClientRect().top) / model.blockView.hourHeight;
  const minute = minuteAtOffset(column.track, rows, model.visible);
  const point = { date: cell.date, minute, columnKey: column.focusKey };
  return column.resource === null ? point : { ...point, resourceId: column.resource.id };
}

export type IntentBase = Pick<DragSession, "occurrence" | "grab" | "source" | "origin" | "target">;

export function gridIntent(session: IntentBase, input: PointerInput, model: GridModel): DragIntent | null {
  const { occurrence, grab, source } = session;
  if (source.kind !== DragKind.Resize) {
    const target = gridPointAt(input.clientY, session.target, model);
    return target === null ? null : { kind: DragKind.Move, source: ChangeSource.Drag, occurrence, grab, target };
  }
  const target = gridPointAt(input.clientY, session.origin, model);
  if (target === null || occurrence.kind !== OccurrenceKind.Timed) {
    return null;
  }
  return { kind: DragKind.Resize, source: ChangeSource.Resize, occurrence, grab, target };
}

export function pointerPose(session: DragSession, input: PointerInput): Pose {
  const rect = session.origin.element.getBoundingClientRect();
  const drift = { x: session.originRect.left - rect.left, y: session.originRect.top - rect.top };
  if (session.source.kind === DragKind.Resize) {
    const height = Math.max(input.clientY - rect.top - session.home.top, minimumHeight);
    return { x: 0, y: 0, height };
  }
  return {
    x: input.clientX - session.pointer.x + drift.x,
    y: input.clientY - session.pointer.y + drift.y,
    height: null,
  };
}

function resizePose(session: DragSession, model: GridModel): Pose {
  const column = columnOn(model, session.origin);
  if (column === undefined) {
    return session.pose;
  }
  const bottom = offsetAt(column.track, minuteIn(column, session.result.proposal.end), model.visible);
  return { x: 0, y: 0, height: Math.max(bottom * model.blockView.hourHeight - session.home.top, minimumHeight) };
}

function pieceStart(session: DragSession, model: GridModel): Instant {
  const { occurrence } = session;
  const { start } = session.result.proposal;
  if (occurrence.kind !== OccurrenceKind.Timed) {
    return start;
  }
  const originStart = columnOn(model, session.origin)?.column.day.start ?? occurrence.start;
  return Math.max(occurrence.start, originStart) + (start - occurrence.start);
}

export function snappedPose(session: DragSession, model: GridModel): Pose {
  if (session.source.kind === DragKind.Resize) {
    return resizePose(session, model);
  }
  const start = pieceStart(session, model);
  const { intent } = session.result.proposal;
  const targetKey = intent.kind === DragKind.Move ? intent.target.columnKey : session.target.columnKey;
  const column = columnAt(model, start, targetKey);
  const columnKey = CSS.escape(column?.focusKey ?? "");
  const selector = `${columnSelector}[data-date="${column?.column.day.date}"][data-column-key="${columnKey}"]`;
  const element = session.origin.element.parentElement?.querySelector(selector);
  if (column === undefined || element === null || element === undefined) {
    return session.pose;
  }
  const top = offsetAt(column.track, minuteIn(column, start), model.visible) * model.blockView.hourHeight;
  const x = element.getBoundingClientRect().left - session.origin.element.getBoundingClientRect().left;
  return { x, y: top - session.home.top, height: null };
}
