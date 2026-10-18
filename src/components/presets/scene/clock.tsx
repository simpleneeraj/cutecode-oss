"use client";

import { createContext, useContext, useEffect, type ReactNode, type RefObject } from "react";
import { atom, useAtomValue } from "jotai";
import {
  cancelFrame,
  frame,
  useInView,
  useMotionValue,
  usePageInView,
  useReducedMotion,
  type FrameData,
  type MotionValue,
} from "motion/react";
import { sceneTimeScaleAtom } from "@/store/editor/editor/video";
import { SCENE_LOOP_MS } from "./loop";

export { SCENE_LOOP_MS } from "./loop";

export const sceneExportTimeAtom = atom<number | null>(null);

const SceneClockContext = createContext<MotionValue<number> | null>(null);

type SceneClockProps = {
  targetRef: RefObject<HTMLElement | null>;
  children: ReactNode;
};

export function SceneClock({ targetRef, children }: SceneClockProps) {
  const exportTime = useAtomValue(sceneExportTimeAtom);
  const timeScale = useAtomValue(sceneTimeScaleAtom);
  const time = useMotionValue(0);
  const isInView = useInView(targetRef);
  const isPageVisible = usePageInView();
  const prefersReducedMotion = useReducedMotion();
  const isExporting = exportTime !== null;
  const isPlaying = isInView && isPageVisible && !prefersReducedMotion && !isExporting;

  useEffect(() => {
    if (isExporting) time.set(exportTime * timeScale);
    else if (prefersReducedMotion) time.set(0);
  }, [exportTime, isExporting, prefersReducedMotion, time, timeScale]);

  useEffect(() => {
    if (!isPlaying) return undefined;
    const tick = ({ delta }: FrameData) => time.set((time.get() + delta) % SCENE_LOOP_MS);
    frame.update(tick, true);
    return () => cancelFrame(tick);
  }, [isPlaying, time]);

  return <SceneClockContext.Provider value={time}>{children}</SceneClockContext.Provider>;
}

export function useSceneClock() {
  const clock = useContext(SceneClockContext);
  if (!clock) throw new Error("useSceneClock must be used inside SceneClock");
  return clock;
}
