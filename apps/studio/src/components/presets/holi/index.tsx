import { motion, easeInOut, easeOut } from "motion/react";
import { BaseFrameProps } from "@/typings/presets";
import { SceneFrame, useLoop } from "../scene";
import styles from "./style.module.css";

const TONES = [styles.rose, styles.blush, styles.deep];

const CLOUDS = [
  { id: "cloud-top-left", x: -6, y: -14, size: 300, tone: styles.rose, drift: 26, phase: 0 },
  { id: "cloud-top-right", x: 62, y: -18, size: 280, tone: styles.blush, drift: -22, phase: 0.2 },
  { id: "cloud-right", x: 78, y: 48, size: 300, tone: styles.deep, drift: -24, phase: 0.45 },
  { id: "cloud-left", x: -10, y: 56, size: 290, tone: styles.blush, drift: 20, phase: 0.6 },
  { id: "cloud-bottom", x: 34, y: 74, size: 240, tone: styles.rose, drift: 18, phase: 0.8 },
];

const PUFFS = [
  { id: "puff-top-left", x: 14, y: 20, size: 150, tone: styles.rose, phase: 0 },
  { id: "puff-right", x: 86, y: 34, size: 170, tone: styles.blush, phase: 0.25 },
  { id: "puff-bottom-right", x: 72, y: 88, size: 160, tone: styles.deep, phase: 0.5 },
  { id: "puff-left", x: 10, y: 72, size: 140, tone: styles.blush, phase: 0.75 },
];

const SPECKS = Array.from({ length: 20 }, (_, index) => ({
  id: `speck-${index}`,
  left: `${(index * 43 + 7) % 100}%`,
  top: `${30 + ((index * 23) % 65)}%`,
  size: 3 + (index % 4),
  rise: 60 + ((index * 17) % 70),
  drift: index % 2 === 0 ? 28 : -28,
  cycles: 1 + (index % 2),
  phase: ((index * 7) % 20) / 20,
  tone: TONES[index % TONES.length],
}));

type Cloud = (typeof CLOUDS)[number];
type Puff = (typeof PUFFS)[number];
type Speck = (typeof SPECKS)[number];

type PowderCloudProps = {
  cloud: Cloud;
};

function PowderCloud({ cloud }: PowderCloudProps) {
  const options = { phase: cloud.phase, ease: easeInOut };
  const scale = useLoop([0.9, 1.12, 0.9], options);
  const x = useLoop([0, cloud.drift, 0], options);
  const y = useLoop([0, -cloud.drift / 2, 0], { ...options, phase: cloud.phase + 0.25 });

  return (
    <motion.span
      className={`${styles.cloud} ${cloud.tone}`}
      style={{ left: `${cloud.x}%`, top: `${cloud.y}%`, width: cloud.size, height: cloud.size, scale, x, y }}
    />
  );
}

type PowderPuffProps = {
  puff: Puff;
};

function PowderPuff({ puff }: PowderPuffProps) {
  const options = { phase: puff.phase, ease: easeOut };
  const scale = useLoop([0.2, 1, 1.2, 0.2], options);
  const opacity = useLoop([0, 0.75, 0, 0], options);

  return (
    <motion.span
      className={`${styles.puff} ${puff.tone}`}
      style={{
        left: `${puff.x}%`,
        top: `${puff.y}%`,
        width: puff.size,
        height: puff.size,
        marginLeft: -puff.size / 2,
        marginTop: -puff.size / 2,
        scale,
        opacity,
      }}
    />
  );
}

type PowderSpeckProps = {
  speck: Speck;
};

function PowderSpeck({ speck }: PowderSpeckProps) {
  const options = { cycles: speck.cycles, phase: speck.phase };
  const y = useLoop([0, -speck.rise], options);
  const x = useLoop([0, speck.drift], { ...options, ease: easeOut });
  const opacity = useLoop([0, 0.9, 0.6, 0], options);

  return (
    <motion.span
      className={`${styles.speck} ${speck.tone}`}
      style={{ left: speck.left, top: speck.top, width: speck.size, height: speck.size, x, y, opacity }}
    />
  );
}

function HoliScene() {
  return (
    <div className={styles.layer} aria-hidden>
      {CLOUDS.map((cloud) => (
        <PowderCloud key={cloud.id} cloud={cloud} />
      ))}
      {PUFFS.map((puff) => (
        <PowderPuff key={puff.id} puff={puff} />
      ))}
      {SPECKS.map((speck) => (
        <PowderSpeck key={speck.id} speck={speck} />
      ))}
    </div>
  );
}

function PowderEdge() {
  const x = useLoop(["-100%", "300%", "300%"]);

  return (
    <div className={styles.topEdge} aria-hidden>
      <motion.div className={styles.sweep} style={{ x }} />
    </div>
  );
}

const background = <HoliScene />;
const accent = <PowderEdge />;

export default function HoliFrame(props: BaseFrameProps) {
  return <SceneFrame {...props} themeStyles={styles} background={background} accent={accent} />;
}
