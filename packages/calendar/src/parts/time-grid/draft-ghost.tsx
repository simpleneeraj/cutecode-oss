"use client";

import { motion as motionTokens } from "@cutecode/ui/tokens/motion";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { use } from "react";

import { formatTimeRange } from "../../locale";
import { milliseconds } from "../../time";
import type { Instant } from "../../types";
import { DragContext, inertDragStore } from "../drag/context";
import { isRefusal } from "../drag/feedback";
import { createResultOf, useDragState } from "../drag/store";
import { draftGhostStyles } from "../drag/style";
import { offsetAt } from "./axis";
import type { GridColumn } from "./columns";
import { bandStyle } from "./geometry";
import type { GridModel } from "./model";
import type { DraftRange } from "./props";

type DraftGhostProps = {
  column: GridColumn;
  model: GridModel;
};

const draftCopy = {
  title: "New event",
};

const instantTransition = { duration: 0 };

function isOnColumn(range: DraftRange | null, column: GridColumn): range is DraftRange {
  const { day } = column.column;
  const isOnDay = range !== null && range.start >= day.start && range.start < day.end;
  return isOnDay && (column.resource === null || range.resourceId === column.resource.id);
}

function offsetOf(instant: Instant, column: GridColumn, model: GridModel): number {
  const minute = (instant - column.column.day.start) / milliseconds.minute;
  return offsetAt(column.track, minute, model.visible);
}

function DraftGhost({ column, model }: DraftGhostProps) {
  const drag = use(DragContext);
  const isReducedMotion = useReducedMotion() ?? false;
  const { date } = column.column.day;
  const result = useDragState(drag?.store ?? inertDragStore, (state) => createResultOf(state, date));
  const range = result?.proposal ?? drag?.draft ?? null;
  const isShown = isOnColumn(range, column);
  const styles = draftGhostStyles({ isRefused: result !== null && isRefusal(result) });
  const top = isShown ? offsetOf(range.start, column, model) : 0;
  const height = isShown ? offsetOf(range.end, column, model) - top : 0;

  return (
    <AnimatePresence>
      {isShown && (
        <motion.div
          key="draft-ghost"
          animate={{ opacity: 1 }}
          aria-hidden="true"
          className={styles.root()}
          data-slot="draft-ghost"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          style={bandStyle({ top, height })}
          transition={isReducedMotion ? instantTransition : motionTokens.fade}
        >
          <span>{draftCopy.title}</span>
          <span className={styles.time()}>{formatTimeRange(range.start, range.end, model.settings)}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export { DraftGhost };
