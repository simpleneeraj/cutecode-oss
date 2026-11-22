import { ChangeSource, TextDirection, type MoveIntent } from "../../types";
import type { GridModel } from "../time-grid/model";
import { dayMoveIntent } from "./keyboard-carry";
import type { DragSourceData } from "./source";
import { ignoreEnd, type DragSession, type DropFlow } from "./use-drop-flow";
import { restPose, type Pose } from "./visual";

export const lanesSelector = '[data-slot="all-day-lanes"]';
export const allDayItemSelector = '[data-slot="all-day-item"]';

function columnIndexOf(model: GridModel, date: string): number {
  return model.columns.findIndex((column) => column.column.day.date === date);
}

function signOf(model: GridModel): number {
  return model.direction === TextDirection.RightToLeft ? -1 : 1;
}

export function isShownDate(model: GridModel, date: string): boolean {
  return columnIndexOf(model, date) !== -1;
}

export function lanePose(session: DragSession, model: GridModel, target: string): Pose {
  const width = session.origin.element.getBoundingClientRect().width / model.columns.length;
  const steps = columnIndexOf(model, target) - columnIndexOf(model, session.origin.date);
  return { x: steps * width * signOf(model), y: 0, height: null };
}

export function laneDateAt(lanes: Element, clientX: number, model: GridModel): string | null {
  const rect = lanes.getBoundingClientRect();
  const count = model.columns.length;
  const fromStart = signOf(model) === 1 ? clientX - rect.left : rect.right - clientX;
  const index = Math.min(Math.max(Math.floor((fromStart / rect.width) * count), 0), count - 1);
  return model.columns[index]?.column.day.date ?? null;
}

export function laneIntent(session: DragSession, date: string): MoveIntent {
  return { ...dayMoveIntent(session.occurrence, date), grab: session.grab, source: ChangeSource.Drag };
}

type LaneStart = {
  source: DragSourceData;
  element: HTMLElement;
  clientX: number;
  clientY: number;
};

export function allDaySessionOf(start: LaneStart, model: GridModel, flow: DropFlow): DragSession | null {
  const { source, element } = start;
  const occurrence = model.occurrenceByKey.get(source.key);
  const lanes = element.closest(lanesSelector);
  const grabDate = lanes === null ? null : laneDateAt(lanes, start.clientX, model);
  if (occurrence === undefined || lanes === null || grabDate === null) {
    return null;
  }
  const intent = { ...dayMoveIntent(occurrence, grabDate), source: ChangeSource.Drag };
  return {
    source,
    element,
    occurrence,
    origin: { date: grabDate, element: lanes },
    target: { date: grabDate, element: lanes },
    grab: intent.grab,
    originRect: lanes.getBoundingClientRect(),
    pointer: { x: start.clientX, y: start.clientY },
    home: { top: element.offsetTop, height: element.offsetHeight },
    pose: restPose,
    blockSize: element.style.blockSize,
    result: flow.resolve(intent),
    unclip: ignoreEnd,
    onEnd: ignoreEnd,
  };
}
