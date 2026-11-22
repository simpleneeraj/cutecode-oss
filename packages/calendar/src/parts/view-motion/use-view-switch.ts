"use client";

import { motion as motionTokens } from "@cutecode/ui/tokens/motion";
import { animateView, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import { flushSync } from "react-dom";

import { SwitchKind, viewSwitchKeyframes } from "./presets";

function supportsViewTransitions(): boolean {
  return typeof document.startViewTransition === "function";
}

export function useViewSwitch() {
  const reduceMotion = useReducedMotion() ?? false;
  const surfaceRef = useRef<HTMLDivElement>(null);
  const [kind, setKind] = useState(SwitchKind.Initial);

  const switchView = (update: () => void) => {
    const surface = surfaceRef.current;
    const canTransition = surface !== null && !reduceMotion && supportsViewTransitions();
    if (!canTransition) {
      setKind(SwitchKind.Motion);
      update();
      return;
    }
    setKind(SwitchKind.Native);
    animateView(() => flushSync(update))
      .add(surface)
      .new(viewSwitchKeyframes.rise, motionTokens.springGentle)
      .old(viewSwitchKeyframes.fadeOut, motionTokens.fade);
  };

  return { switchView, surfaceRef, kind };
}
