import { motion } from "motion/react";
import { useLoop } from "../scene";
import styles from "./tailwind.module.css";

const WAVE_PERIOD = 240;

export type Wave = {
  id: string;
  tone: "waveSky" | "waveCyan" | "waveViolet";
  isReversed: boolean;
  cycles: number;
};

type FlowWaveProps = {
  wave: Wave;
};

export default function FlowWave({ wave }: FlowWaveProps) {
  const keyframes = wave.isReversed ? [-WAVE_PERIOD, 0] : [0, -WAVE_PERIOD];
  const x = useLoop(keyframes, { cycles: wave.cycles });

  return <motion.div className={styles[wave.tone]} style={{ x }} />;
}
