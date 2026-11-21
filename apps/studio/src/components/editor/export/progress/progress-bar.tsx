import { useEffect } from "react";
import { motion, useReducedMotion, useSpring } from "motion/react";

type ProgressBarProps = {
  progress: number;
};

export default function ProgressBar({ progress }: ProgressBarProps) {
  const scaleX = useSpring(progress, { stiffness: 120, damping: 24 });
  const isReducedMotion = useReducedMotion();

  useEffect(() => {
    if (isReducedMotion) scaleX.jump(progress);
    else scaleX.set(progress);
  }, [progress, isReducedMotion, scaleX]);

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      className="h-1 overflow-hidden rounded-full bg-muted"
    >
      <motion.div className="h-full origin-left rounded-full bg-primary" style={{ scaleX }} />
    </div>
  );
}
