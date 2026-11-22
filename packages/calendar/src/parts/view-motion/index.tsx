"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode, RefObject } from "react";

import { SwitchKind, viewSwitchMotion } from "./presets";
import { viewSwitchStyles } from "./style";

type ViewSwitchProps = {
  viewKey: string;
  kind: SwitchKind;
  surfaceRef: RefObject<HTMLDivElement | null>;
  children: ReactNode;
};

function ViewSwitch({ viewKey, kind, surfaceRef, children }: ViewSwitchProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const entrance = reduceMotion ? viewSwitchMotion.reduced : viewSwitchMotion.full;
  const isMotionSwitch = kind === SwitchKind.Motion;
  const styles = viewSwitchStyles();

  return (
    <div ref={surfaceRef} className={styles.root()} data-slot="view-switch">
      <motion.div
        key={viewKey}
        animate={entrance.animate}
        className={styles.view()}
        initial={isMotionSwitch ? entrance.initial : false}
        transition={entrance.transition}
      >
        {children}
      </motion.div>
    </div>
  );
}

export { ViewSwitch };
