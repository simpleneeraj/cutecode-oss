import { useEffect, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { codeAtom, currentSlideIdAtom, typingRecordingsAtom, typingReplayCountAtom } from "@/store/editor/editor";

type Recording = { slideId: string; startedAt: number };

export default function useTypingRecorder() {
  const code = useAtomValue(codeAtom);
  const slideId = useAtomValue(currentSlideIdAtom);
  const setRecordings = useSetAtom(typingRecordingsAtom);
  const setReplayCount = useSetAtom(typingReplayCountAtom);
  const [recording, setRecording] = useState<Recording | null>(null);
  const isRecording = recording !== null && recording.slideId === slideId;
  const startedAt = isRecording ? recording.startedAt : null;

  useEffect(() => {
    if (!recording || recording.slideId !== slideId) return;
    const event = { atMs: performance.now() - recording.startedAt, code };
    setRecordings((recordings) => ({ ...recordings, [slideId]: [...(recordings[slideId] ?? []), event] }));
  }, [code, recording, slideId, setRecordings]);

  const start = () => {
    if (!slideId) return;
    setRecordings((recordings) => ({ ...recordings, [slideId]: [] }));
    setRecording({ slideId, startedAt: performance.now() });
  };

  const stop = () => {
    setRecording(null);
    setReplayCount((count) => count + 1);
  };

  const clear = () => {
    if (!slideId) return;
    setRecordings(({ [slideId]: _removed, ...rest }) => rest);
  };

  return { isRecording, startedAt, start, stop, clear };
}
