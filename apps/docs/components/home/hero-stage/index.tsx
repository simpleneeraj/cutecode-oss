"use client";

import { useMotionValue, useReducedMotion, useSpring } from "motion/react";
import type { PointerEvent } from "react";

import { homeMotion } from "@/components/home/motion";

import { DesktopScene } from "./desktop-scene";
import { PhoneScene } from "./phone-scene";
import { heroStageStyles } from "./style";

const styles = heroStageStyles();

function useSceneTilt(isEnabled: boolean) {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, homeMotion.springGentle);
  const y = useSpring(pointerY, homeMotion.springGentle);

  function followPointer(event: PointerEvent<HTMLElement>) {
    const isFinePointer = event.pointerType === "mouse" || event.pointerType === "pen";
    const canTilt = isEnabled && isFinePointer;
    if (!canTilt) {
      return;
    }
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 2);
    pointerY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 2);
  }

  function resetTilt() {
    pointerX.set(0);
    pointerY.set(0);
  }

  return { tilt: { x, y }, followPointer, resetTilt };
}

export function HeroStage() {
  const isReducedMotion = useReducedMotion() ?? false;
  const scene = useSceneTilt(!isReducedMotion);

  return (
    <div className={styles.root()} onPointerLeave={scene.resetTilt} onPointerMove={scene.followPointer}>
      <DesktopScene tilt={scene.tilt} />
      <PhoneScene />
    </div>
  );
}
