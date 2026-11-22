import type { GridFocus, KeyCommand, PlainDate } from "../../types";
import { moveMonthFocus } from "../month-grid/focus";

export function moveWithin(focus: GridFocus, command: KeyCommand, dates: PlainDate[]): GridFocus {
  const next = moveMonthFocus(focus, command);
  return dates.includes(next.date) ? next : focus;
}
