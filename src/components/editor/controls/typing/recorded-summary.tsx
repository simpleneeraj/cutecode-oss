import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon, RecordIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { formatClock } from "./format-duration";

type RecordedSummaryProps = {
  durationMs: number;
  onRerecord: () => void;
  onClear: () => void;
};

export default function RecordedSummary({ durationMs, onRerecord, onClear }: RecordedSummaryProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm">
        Recorded <span className="tabular-nums text-muted-foreground">{formatClock(durationMs)}</span>
      </p>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="flex-1"
          onClick={onRerecord}
          render={<motion.button whileTap={{ scale: 0.96 }} />}
        >
          <HugeiconsIcon icon={RecordIcon} className="text-destructive" aria-hidden="true" />
          Re-record
        </Button>
        <Button size="sm" variant="ghost" onClick={onClear} render={<motion.button whileTap={{ scale: 0.96 }} />}>
          <HugeiconsIcon icon={Delete02Icon} aria-hidden="true" />
          Clear
        </Button>
      </div>
    </div>
  );
}
