import { useAtomValue } from "jotai";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { RecordIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { currentSlideIdAtom, typingRecordingsAtom } from "@/store/editor/editor";
import RecordedSummary from "./recorded-summary";
import RecordingStatus from "./recording-status";
import useTypingRecorder from "./use-typing-recorder";

export default function RecordPanel() {
  const { startedAt, start, stop, clear } = useTypingRecorder();
  const slideId = useAtomValue(currentSlideIdAtom);
  const recordings = useAtomValue(typingRecordingsAtom);
  const events = slideId ? (recordings[slideId] ?? []) : [];
  const lastEvent = events.at(-1);

  if (startedAt !== null) return <RecordingStatus startedAt={startedAt} onStop={stop} />;

  if (lastEvent) return <RecordedSummary durationMs={lastEvent.atMs} onRerecord={start} onClear={clear} />;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-muted-foreground">
        Type in the editor while recording; we&apos;ll replay it in your video.
      </p>
      <Button size="sm" variant="outline" className="self-start" onClick={start} render={<motion.button whileTap={{ scale: 0.96 }} />}>
        <HugeiconsIcon icon={RecordIcon} className="text-destructive" aria-hidden="true" />
        Start recording
      </Button>
    </div>
  );
}
