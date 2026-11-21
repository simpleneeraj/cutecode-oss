"use client";

import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type HugeiconsIconProps } from "@hugeicons/react";
import { motion, type Transition, useReducedMotion } from "motion/react";

const spinTransition = { duration: 1, ease: "linear", repeat: Infinity } satisfies Transition;

function Spinner(props: Omit<HugeiconsIconProps, "icon">) {
  const isReducedMotion = useReducedMotion();
  const rotation = isReducedMotion ? undefined : { rotate: 360 };

  return (
    <motion.span animate={rotation} className="inline-flex shrink-0" transition={spinTransition}>
      <HugeiconsIcon aria-label="Loading" icon={Loading03Icon} role="status" {...props} />
    </motion.span>
  );
}

export { Spinner };
