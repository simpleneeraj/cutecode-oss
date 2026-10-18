import { useAtomValue } from "jotai";
import { typingTimelineAtom, videoLengthMsAtom } from "@/store/editor/editor";

export default function useTypingOverflowMs() {
  const typingMs = useAtomValue(typingTimelineAtom)?.durationMs ?? 0;
  const lengthMs = useAtomValue(videoLengthMsAtom);
  return typingMs > lengthMs ? typingMs : null;
}
