import { motion, useReducedMotion } from "motion/react";
import { StopIcon } from "@solar-icons/react/linear/stop";
import { Button } from "@cutecode/ui/components/button";
import { panelButton, panelText } from "../dock-styles";
import { formatClock } from "./format-duration";
import useElapsedMs from "./use-elapsed-ms";

const pulse = { duration: 1.2, repeat: Infinity, ease: "easeInOut" } as const;
const pulseFrames = { opacity: [1, 0.3, 1] };

type RecordingStatusProps = {
  startedAt: number;
  onStop: () => void;
};

export default function RecordingStatus({ startedAt, onStop }: RecordingStatusProps) {
  const elapsedMs = useElapsedMs(startedAt);
  const isReducedMotion = useReducedMotion();

  return (
    <div className="flex items-center justify-between gap-2 rounded-density-surface bg-muted py-1.5 ps-row-inset pe-1.5">
      <span className={panelText({ tone: "body", className: "flex items-center gap-2" })} aria-live="polite">
        <motion.span
          animate={isReducedMotion ? undefined : pulseFrames}
          transition={pulse}
          className="size-2 rounded-full bg-destructive"
          aria-hidden="true"
        />
        Recording
        <span className="tabular-nums text-muted-foreground">{formatClock(elapsedMs)}</span>
      </span>
      <Button size="sm" variant="destructive" className={panelButton()} onClick={onStop}>
        <StopIcon aria-hidden="true" />
        Stop
      </Button>
    </div>
  );
}
