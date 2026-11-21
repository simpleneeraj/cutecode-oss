import { motion } from "motion/react";
import { RecordCircleIcon } from "@solar-icons/react/linear/record-circle";
import { TrashBinMinimalisticIcon } from "@solar-icons/react/linear/trash-bin-minimalistic";
import { Button } from "@cutecode/ui/components/button";
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
        Recording saved <span className="tabular-nums text-muted-foreground">{formatClock(durationMs)}</span>
      </p>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="flex-1"
          onClick={onRerecord}
          render={<motion.button whileTap={{ scale: 0.96 }} />}
        >
          <RecordCircleIcon className="text-destructive" aria-hidden="true" />
          Re-record
        </Button>
        <Button size="sm" variant="ghost" onClick={onClear} render={<motion.button whileTap={{ scale: 0.96 }} />}>
          <TrashBinMinimalisticIcon aria-hidden="true" />
          Clear
        </Button>
      </div>
    </div>
  );
}
