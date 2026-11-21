import { useTransform, type EasingFunction } from "motion/react";
import { useSceneClock } from "./clock";
import { SCENE_LOOP_MS } from "./loop";

type LoopOptions = {
  cycles?: number;
  phase?: number;
  ease?: EasingFunction;
};

export function useLoop<T>(keyframes: T[], { cycles = 1, phase = 0, ease }: LoopOptions = {}) {
  const clock = useSceneClock();
  const progress = useTransform(clock, (time) => ((time / SCENE_LOOP_MS) * cycles + phase) % 1);
  const offsets = keyframes.map((_, index) => index / (keyframes.length - 1));
  return useTransform(progress, offsets, keyframes, { ease });
}
