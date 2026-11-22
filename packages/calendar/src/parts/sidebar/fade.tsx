"use client";

import { motion as motionTokens } from "@cutecode/ui/tokens/motion";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type SidebarFadeProps = {
  fadeKey: string | null;
  children: ReactNode;
};

const sidebarFadeMotion = {
  full: {
    initial: { opacity: 0, y: 4 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -4 },
    transition: motionTokens.springGentle,
  },
  reduced: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: motionTokens.fade,
  },
};

function SidebarFade({ fadeKey, children }: SidebarFadeProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const fade = reduceMotion ? sidebarFadeMotion.reduced : sidebarFadeMotion.full;

  return (
    <AnimatePresence initial={false} mode="popLayout">
      {fadeKey !== null && (
        <motion.div key={fadeKey} animate={fade.animate} exit={fade.exit} initial={fade.initial} transition={fade.transition}>
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export { SidebarFade };
