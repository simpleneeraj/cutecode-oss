import { motion, type MotionValue } from "motion/react";

type TypingCaretProps = {
  opacity: MotionValue<number> | number;
};

export default function TypingCaret({ opacity }: TypingCaretProps) {
  return (
    <motion.span
      aria-hidden="true"
      style={{ opacity }}
      className="-mr-0.5 inline-block h-4 w-0.5 translate-y-0.5 bg-current"
    />
  );
}
