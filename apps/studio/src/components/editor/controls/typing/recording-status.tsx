import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { StopIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { formatClock } from "./format-duration";
import useElapsedMs from "./use-elapsed-ms";

const pulse = { duration: 1.2, repeat: Infinity, ease: "easeInOut" } as const;

type RecordingStatusProps = {
  startedAt: number;
  onStop: () => void;
};

export default function RecordingStatus({ startedAt, onStop }: RecordingStatusProps) {
  const elapsedMs = useElapsedMs(startedAt);

  return (
    <div className="flex items-center justify-between gap-2 rounded-lg border bg-destructive/4 px-3 py-2">
      <span className="flex items-center gap-2 text-sm" aria-live="polite">
        <motion.span
          animate={{ opacity: [1, 0.3, 1] }}
          transition={pulse}
          className="size-2 rounded-full bg-destructive"
          aria-hidden="true"
        />
        Recording
        <span className="tabular-nums text-muted-foreground">{formatClock(elapsedMs)}</span>
      </span>
      <Button size="sm" variant="destructive" onClick={onStop} render={<motion.button whileTap={{ scale: 0.95 }} />}>
        <HugeiconsIcon icon={StopIcon} aria-hidden="true" />
        Stop
      </Button>
    </div>
  );
}
