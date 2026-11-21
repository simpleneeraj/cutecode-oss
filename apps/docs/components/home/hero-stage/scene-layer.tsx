"use client";

import { type MotionValue, motion, useTransform } from "motion/react";
import type { ReactNode } from "react";

import { type ScenePlace, sceneDepths } from "./constants";
import { sceneLayerStyles } from "./style";

export type SceneTilt = {
  x: MotionValue<number>;
  y: MotionValue<number>;
};

type SceneLayerProps = {
  place: ScenePlace;
  tilt: SceneTilt;
  children: ReactNode;
};

export function SceneLayer({ place, tilt, children }: SceneLayerProps) {
  const depth = sceneDepths[place];
  const x = useTransform(tilt.x, (offset) => offset * depth);
  const y = useTransform(tilt.y, (offset) => offset * depth);

  return (
    <motion.div className={sceneLayerStyles({ place })} style={{ x, y }}>
      {children}
    </motion.div>
  );
}
