import { motion, easeInOut } from "motion/react";
import { cn } from "@/utils/cn";
import { BaseFrameProps } from "@/typings/presets";
import { SceneFrame, useLoop } from "../scene";
import styles from "./style.module.css";

const WAVE_PATH = "M0 60Q150 0 300 60T600 60T900 60T1200 60V120H0Z";

const WAVES = [
  { id: "wave-mustard", tone: styles.mustard, sway: 60, phase: 0 },
  { id: "wave-orange", tone: styles.orange, sway: -50, phase: 0.2 },
  { id: "wave-rust", tone: styles.rust, sway: 44, phase: 0.45 },
  { id: "wave-brown", tone: styles.brown, sway: -36, phase: 0.7 },
  { id: "wave-crest-orange", tone: styles.crestOrange, sway: 48, phase: 0.1 },
  { id: "wave-crest-mustard", tone: styles.crestMustard, sway: -40, phase: 0.55 },
];

type Wave = (typeof WAVES)[number];

type RetroWaveProps = {
  wave: Wave;
};

function RetroWave({ wave }: RetroWaveProps) {
  const options = { phase: wave.phase, ease: easeInOut };
  const x = useLoop([0, wave.sway, 0], options);
  const y = useLoop([0, 5, 0], options);

  return (
    <motion.svg className={cn(styles.wave, wave.tone)} viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ x, y }}>
      <path d={WAVE_PATH} />
    </motion.svg>
  );
}

function GroovyScene() {
  const rotate = useLoop([0, 15]);
  const sunScale = useLoop([1, 1.05, 1], { ease: easeInOut });

  return (
    <div className={styles.layer} aria-hidden>
      <motion.div className={styles.sunburst} style={{ rotate }} />
      <motion.div className={styles.sun} style={{ scale: sunScale }} />
      {WAVES.map((wave) => (
        <RetroWave key={wave.id} wave={wave} />
      ))}
    </div>
  );
}

function StripeEdge() {
  const x = useLoop(["-100%", "300%", "300%"]);

  return (
    <div className={styles.topEdge} aria-hidden>
      <motion.div className={styles.sweep} style={{ x }} />
    </div>
  );
}

const background = <GroovyScene />;
const accent = <StripeEdge />;

export default function GroovyFrame(props: BaseFrameProps) {
  return <SceneFrame {...props} themeStyles={styles} background={background} accent={accent} />;
}
