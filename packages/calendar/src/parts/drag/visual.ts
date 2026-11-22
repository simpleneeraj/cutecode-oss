import { motion as motionTokens } from "@cutecode/ui/tokens/motion";
import { animate } from "motion/react";

export type Pose = {
  x: number;
  y: number;
  height: number | null;
};

export const restPose: Pose = { x: 0, y: 0, height: null };

const liftScale = 1.02;

export function applyPose(element: HTMLElement, pose: Pose) {
  element.style.translate = `${pose.x}px ${pose.y}px`;
  if (pose.height !== null) {
    element.style.blockSize = `${pose.height}px`;
  }
}

function mix(from: number, to: number, progress: number): number {
  return from + (to - from) * progress;
}

function mixPose(from: Pose, to: Pose, progress: number): Pose {
  const height = from.height === null || to.height === null ? to.height : mix(from.height, to.height, progress);
  return { x: mix(from.x, to.x, progress), y: mix(from.y, to.y, progress), height };
}

export function liftElement(element: HTMLElement, isReducedMotion: boolean) {
  if (!isReducedMotion) {
    animate(element, { scale: liftScale }, motionTokens.springSnappy);
  }
}

export function settleElement(element: HTMLElement, from: Pose, to: Pose, isReducedMotion: boolean): Promise<void> {
  if (isReducedMotion) {
    applyPose(element, to);
    return Promise.resolve();
  }
  animate(element, { scale: 1 }, motionTokens.springSnappy);
  return new Promise((resolve) => {
    animate(0, 1, {
      ...motionTokens.springSnappy,
      onUpdate: (progress) => applyPose(element, mixPose(from, to, progress)),
      onComplete: resolve,
    });
  });
}

export function glideElement(element: HTMLElement, from: Pose, to: Pose, isReducedMotion: boolean) {
  if (isReducedMotion) {
    applyPose(element, to);
    return null;
  }
  return animate(0, 1, {
    ...motionTokens.springSnappy,
    onUpdate: (progress) => applyPose(element, mixPose(from, to, progress)),
  });
}

export function releaseElement(element: HTMLElement, blockSize: string) {
  element.style.translate = "";
  element.style.transform = "";
  element.style.blockSize = blockSize;
}
