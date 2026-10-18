import { motion, easeInOut } from "motion/react";
import { BaseFrameProps } from "@/typings/presets";
import { SceneFrame, useLoop } from "../scene";
import styles from "./style.module.css";

const BAT_PATH =
  "M12 8.6 11.4 7.5 11.1 8.8C9.4 8.9 7 8.4 2 9.6c2.2.9 3.3 2.1 3.4 3.6 1.3-.9 2.7-.9 3.7.4.7-1 1.7-1.2 2.9-.2 1.2-1 2.2-.8 2.9.2 1-1.3 2.4-1.3 3.7-.4.1-1.5 1.2-2.7 3.4-3.6-5-1.2-7.4-.7-9.1-.8l-.3-1.3z";

const BATS = [
  { id: "bat-high", top: 14, size: 26, rise: -12, phase: 0 },
  { id: "bat-low", top: 34, size: 18, rise: 10, phase: 0.3 },
  { id: "bat-mid", top: 22, size: 22, rise: -8, phase: 0.55 },
  { id: "bat-far", top: 8, size: 14, rise: 6, phase: 0.8 },
];

const FOG = Array.from({ length: 5 }, (_, index) => ({
  id: `fog-${index}`,
  left: `${-20 + index * 24}%`,
  bottom: `${(index * 7) % 22}%`,
  drift: index % 2 === 0 ? 36 : -36,
  phase: index / 5,
}));

const STARS = Array.from({ length: 10 }, (_, index) => ({
  id: `star-${index}`,
  left: `${(index * 37 + 5) % 72}%`,
  top: `${4 + ((index * 23) % 40)}%`,
  size: 2 + (index % 2),
  cycles: 1 + (index % 3),
  phase: ((index * 3) % 10) / 10,
}));

const CANDLES = [
  { id: "candle-left-tall", left: "5%", height: 46, phase: 0 },
  { id: "candle-left-short", left: "11%", height: 28, phase: 0.4 },
  { id: "candle-right", left: "92%", height: 36, phase: 0.7 },
];

type Bat = (typeof BATS)[number];
type Wisp = (typeof FOG)[number];
type Star = (typeof STARS)[number];
type Candle = (typeof CANDLES)[number];

function FlyingBat({ bat }: { bat: Bat }) {
  const x = useLoop(["-14cqw", "114cqw"], { phase: bat.phase });
  const y = useLoop([0, bat.rise, 0, -bat.rise, 0], { cycles: 2, phase: bat.phase, ease: easeInOut });
  const scaleY = useLoop([1, 0.35, 1], { cycles: 9, phase: bat.phase });

  return (
    <motion.svg
      className={styles.bat}
      viewBox="0 0 24 24"
      width={bat.size}
      height={bat.size}
      style={{ top: `${bat.top}%`, x, y, scaleY }}
    >
      <path d={BAT_PATH} />
    </motion.svg>
  );
}

function FogWisp({ wisp }: { wisp: Wisp }) {
  const x = useLoop([0, wisp.drift, 0], { phase: wisp.phase, ease: easeInOut });
  const opacity = useLoop([0.55, 0.9, 0.55], { phase: wisp.phase, ease: easeInOut });

  return <motion.span className={styles.fog} style={{ left: wisp.left, bottom: wisp.bottom, x, opacity }} />;
}

function TwinkleStar({ star }: { star: Star }) {
  const opacity = useLoop([0.25, 1, 0.25], { cycles: star.cycles, phase: star.phase, ease: easeInOut });

  return (
    <motion.span
      className={styles.star}
      style={{ left: star.left, top: star.top, width: star.size, height: star.size, opacity }}
    />
  );
}

function CandleLight({ candle }: { candle: Candle }) {
  const options = { cycles: 3, phase: candle.phase, ease: easeInOut };
  const scaleY = useLoop([1, 1.14, 0.9, 1.06, 1], options);
  const rotate = useLoop([0, -4, 3, -2, 0], options);
  const opacity = useLoop([0.75, 1, 0.8, 0.95, 0.75], options);

  return (
    <div className={styles.candle} style={{ left: candle.left, height: candle.height }}>
      <motion.span className={styles.candleGlow} style={{ opacity }} />
      <motion.span className={styles.flame} style={{ scaleY, rotate }} />
    </div>
  );
}

function HalloweenScene() {
  const moonScale = useLoop([1, 1.04, 1], { ease: easeInOut });
  const driftX = useLoop([0, -24, 0], { ease: easeInOut, phase: 0.25 });

  return (
    <div className={styles.layer} aria-hidden>
      <motion.div className={styles.emberBlob} style={{ x: driftX }} />
      <div className={styles.stars}>
        {STARS.map((star) => (
          <TwinkleStar key={star.id} star={star} />
        ))}
      </div>
      <motion.div className={styles.moon} style={{ scale: moonScale }} />
      {BATS.map((bat) => (
        <FlyingBat key={bat.id} bat={bat} />
      ))}
      {FOG.map((wisp) => (
        <FogWisp key={wisp.id} wisp={wisp} />
      ))}
      {CANDLES.map((candle) => (
        <CandleLight key={candle.id} candle={candle} />
      ))}
    </div>
  );
}

function EmberEdge() {
  const x = useLoop(["-100%", "300%", "300%"]);

  return (
    <div className={styles.topEdge} aria-hidden>
      <motion.div className={styles.sweep} style={{ x }} />
    </div>
  );
}

const background = <HalloweenScene />;
const accent = <EmberEdge />;

export default function HalloweenFrame(props: BaseFrameProps) {
  return <SceneFrame {...props} themeStyles={styles} background={background} accent={accent} />;
}
