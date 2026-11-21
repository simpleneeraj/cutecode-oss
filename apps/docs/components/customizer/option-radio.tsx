"use client";

import { RadioPrimitive } from "@cutecode/ui/components/radio-group";
import { CheckCircleIcon } from "@solar-icons/react/bold/check-circle";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { customizerMotion } from "./constants";
import { customizerStyles } from "./style";

type OptionRadioProps = {
  value: string;
  shape: string;
  isSelected: boolean;
  children: ReactNode;
};

const styles = customizerStyles();

export function OptionRadio({ value, shape, isSelected, children }: OptionRadioProps) {
  const isReducedMotion = useReducedMotion();
  const hiddenScale = isReducedMotion ? 1 : 0.5;

  return (
    <RadioPrimitive.Root className={styles.option({ class: shape })} value={value}>
      {children}
      <AnimatePresence initial={false}>
        {isSelected ? (
          <motion.span
            animate={{ opacity: 1, scale: 1 }}
            aria-hidden="true"
            className={styles.check()}
            exit={{ opacity: 0, scale: hiddenScale, transition: customizerMotion.fade }}
            initial={{ opacity: 0, scale: hiddenScale }}
            transition={isReducedMotion ? customizerMotion.fade : customizerMotion.pop}
          >
            <CheckCircleIcon className={styles.checkIcon()} />
          </motion.span>
        ) : null}
      </AnimatePresence>
    </RadioPrimitive.Root>
  );
}
