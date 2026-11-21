"use client";

import { LoaderIcon } from "@solar-icons/react/linear/loader";
import type { IconProps } from "@solar-icons/react/lib/types";
import { motion, type Transition, useReducedMotion } from "motion/react";

const spinTransition = { duration: 1, ease: "linear", repeat: Infinity } satisfies Transition;

function Spinner(props: IconProps) {
  const isReducedMotion = useReducedMotion();
  const rotation = isReducedMotion ? undefined : { rotate: 360 };

  return (
    <motion.span animate={rotation} className="inline-flex shrink-0" transition={spinTransition}>
      <LoaderIcon aria-label="Loading" role="status" {...props} />
    </motion.span>
  );
}

export { Spinner };
