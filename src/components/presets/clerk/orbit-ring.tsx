import { motion } from "motion/react";
import { useLoop } from "../scene";
import styles from "./clerk.module.css";

export type Orbit = {
  id: string;
  size: number;
  isReversed: boolean;
};

type OrbitRingProps = {
  orbit: Orbit;
};

export default function OrbitRing({ orbit }: OrbitRingProps) {
  const rotate = useLoop(orbit.isReversed ? [0, -360] : [0, 360]);
  const offset = -orbit.size / 2;

  return (
    <motion.div
      className={styles.ring}
      style={{ width: orbit.size, height: orbit.size, top: offset, marginLeft: offset, rotate }}
    />
  );
}
