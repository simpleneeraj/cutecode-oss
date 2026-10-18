import { useEffect, type RefObject } from "react";
import { useAtomValue } from "jotai";
import {
  cancelFrame,
  frame,
  useInView,
  useMotionValue,
  usePageInView,
  useReducedMotion,
  type FrameData,
} from "motion/react";
import { sceneExportTimeAtom } from "@/components/presets/scene";
import { typingIsPausedAtom, typingReplayCountAtom } from "@/store/editor/editor";

export default function useTypingClock(targetRef: RefObject<HTMLElement | null>, durationMs: number) {
  const exportTime = useAtomValue(sceneExportTimeAtom);
  const isPaused = useAtomValue(typingIsPausedAtom);
  const replayCount = useAtomValue(typingReplayCountAtom);
  const time = useMotionValue(0);
  const isInView = useInView(targetRef);
  const isPageVisible = usePageInView();
  const prefersReducedMotion = useReducedMotion();
  const isPlaying = isInView && isPageVisible && !prefersReducedMotion && !isPaused && exportTime === null;

  useEffect(() => {
    time.set(0);
  }, [replayCount, time]);

  useEffect(() => {
    if (prefersReducedMotion) time.set(durationMs);
  }, [prefersReducedMotion, durationMs, time]);

  useEffect(() => {
    if (!isPlaying) return undefined;
    const tick = ({ delta }: FrameData) => time.set((time.get() + delta) % durationMs);
    frame.update(tick, true);
    return () => cancelFrame(tick);
  }, [isPlaying, durationMs, time]);

  return time;
}
