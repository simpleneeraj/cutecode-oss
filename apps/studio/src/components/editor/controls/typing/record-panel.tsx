import { useAtomValue } from "jotai";
import { RecordCircleIcon } from "@solar-icons/react/linear/record-circle";
import { Button } from "@cutecode/ui/components/button";
import { currentSlideIdAtom, typingRecordingsAtom } from "@/store/editor/editor";
import RecordedSummary from "./recorded-summary";
import RecordingStatus from "./recording-status";
import useTypingRecorder from "./use-typing-recorder";
import { panelButton, panelText } from "../dock-styles";

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
      <p className={panelText()}>
        Hit record, then type in the editor. Your exact keystrokes play back in the export.
      </p>
      <Button size="sm" variant="outline" className={panelButton({ className: "self-start" })} onClick={start}>
        <RecordCircleIcon className="text-destructive" aria-hidden="true" />
        Start recording
      </Button>
    </div>
  );
}
