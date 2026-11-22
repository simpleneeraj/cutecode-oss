"use client";

import { motion as motionTokens } from "@cutecode/ui/tokens/motion";
import { ClockCircleIcon } from "@solar-icons/react/linear/clock-circle";
import { ForbiddenCircleIcon } from "@solar-icons/react/linear/forbidden-circle";
import { HandGrabIcon } from "@solar-icons/react/linear/hand-grab";
import { LockKeyholeMinimalisticIcon } from "@solar-icons/react/linear/lock-keyhole-minimalistic";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { DragKind, type PlainDate, type ViewSettings } from "../../types";
import { dragTip, TipIcon } from "./feedback";
import { slotResultOf, useDragState, type DragStore } from "./store";
import { dragTipStyles } from "./style";

type DragTipProps = {
  store: DragStore;
  slotKey: string;
  date: PlainDate;
  settings: ViewSettings;
};

const tipIcons = {
  [TipIcon.Grab]: HandGrabIcon,
  [TipIcon.Clock]: ClockCircleIcon,
  [TipIcon.Refused]: ForbiddenCircleIcon,
  [TipIcon.Lock]: LockKeyholeMinimalisticIcon,
};

const tipMotion = {
  full: { initial: { opacity: 0, y: 4 }, animate: { opacity: 1, y: 0 } },
  reduced: { initial: { opacity: 0 }, animate: { opacity: 1 } },
};

function DragTip({ store, slotKey, date, settings }: DragTipProps) {
  const result = useDragState(store, (state) => slotResultOf(state, slotKey, date));
  const isReducedMotion = useReducedMotion();
  const tip = result === null ? null : dragTip(result, settings);
  const styles = dragTipStyles({ isBelow: result?.proposal.intent.kind === DragKind.Resize });
  const shown = isReducedMotion ? tipMotion.reduced : tipMotion.full;
  const Icon = tip === null ? null : tipIcons[tip.icon];

  return (
    <AnimatePresence>
      {tip && Icon && (
        <motion.span
          key="drag-tip"
          {...shown}
          aria-hidden="true"
          className={styles.root()}
          data-slot="drag-tip"
          exit={{ opacity: 0 }}
          transition={motionTokens.fade}
        >
          <Icon aria-hidden="true" className={styles.icon()} />
          {tip.text}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

export { DragTip };
