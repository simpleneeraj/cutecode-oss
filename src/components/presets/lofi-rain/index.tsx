import { motion, easeInOut, easeIn } from "motion/react";
import { BaseFrameProps } from "@/typings/presets";
import { SceneFrame, useLoop } from "../scene";
import styles from "./style.module.css";

const STREAKS = Array.from({ length: 18 }, (_, index) => ({
  id: `streak-${index}`,
  left: `${(index * 37 + 5) % 100}%`,
  length: 36 + ((index * 13) % 40),
  cycles: 2 + (index % 3),
  phase: ((index * 7) % 18) / 18,
}));

const DROPS = Array.from({ length: 6 }, (_, index) => ({
  id: `drop-${index}`,
  left: `${(index * 29 + 11) % 100}%`,
  top: `${(index * 17 + 6) % 50}%`,
  size: 4 + (index % 3),
  phase: index / 6,
}));

const LIGHTS = [
  { id: "light-a", x: 12, y: 24, size: 26 },
  { id: "light-b", x: 30, y: 12, size: 18 },
  { id: "light-c", x: 68, y: 18, size: 22 },
  { id: "light-d", x: 86, y: 30, size: 30 },
  { id: "light-e", x: 52, y: 8, size: 16 },
  { id: "light-f", x: 94, y: 10, size: 20 },
];

const WISPS = [
  { id: "wisp-a", offset: -6, phase: 0 },
  { id: "wisp-b", offset: 2, phase: 1 / 3 },
  { id: "wisp-c", offset: 9, phase: 2 / 3 },
];

type Streak = (typeof STREAKS)[number];
type Drop = (typeof DROPS)[number];
type Light = (typeof LIGHTS)[number];
type Wisp = (typeof WISPS)[number];

function RainStreak({ streak }: { streak: Streak }) {
  const options = { cycles: streak.cycles, phase: streak.phase, ease: easeIn };
  const y = useLoop(["-20cqh", "110cqh"], options);
  const opacity = useLoop([0, 0.8, 0.8, 0], options);

  return <motion.span className={styles.streak} style={{ left: streak.left, height: streak.length, y, opacity }} />;
}

function GlassDrop({ drop }: { drop: Drop }) {
  const options = { phase: drop.phase, ease: easeInOut };
  const y = useLoop([0, 0, 90, 90], options);
  const opacity = useLoop([0, 0.9, 0.9, 0], options);

  return (
    <motion.span
      className={styles.drop}
      style={{ left: drop.left, top: drop.top, width: drop.size, height: drop.size + 2, y, opacity }}
    />
  );
}

function CityLight({ light, index }: { light: Light; index: number }) {
  const opacity = useLoop([0.35, 0.8, 0.35], { phase: index / LIGHTS.length, ease: easeInOut });

  return (
    <motion.span
      className={styles.bokeh}
      style={{ left: `${light.x}%`, top: `${light.y}%`, width: light.size, height: light.size, opacity }}
    />
  );
}

function SteamWisp({ wisp }: { wisp: Wisp }) {
  const options = { phase: wisp.phase };
  const y = useLoop([0, -42], options);
  const x = useLoop([wisp.offset, wisp.offset + 6, wisp.offset - 4, wisp.offset], { ...options, ease: easeInOut });
  const opacity = useLoop([0, 0.55, 0], options);

  return (
    <motion.svg className={styles.wisp} viewBox="0 0 12 40" style={{ x, y, opacity }}>
      <path d="M6 40C2 32 10 26 6 18S8 6 6 0" />
    </motion.svg>
  );
}

function LofiRainScene() {
  const lampScale = useLoop([1, 1.06, 1], { ease: easeInOut });

  return (
    <div className={styles.layer} aria-hidden>
      <motion.div className={styles.lamp} style={{ scale: lampScale }} />
      {LIGHTS.map((light, index) => (
        <CityLight key={light.id} light={light} index={index} />
      ))}
      <div className={styles.mullions} />
      {STREAKS.map((streak) => (
        <RainStreak key={streak.id} streak={streak} />
      ))}
      {DROPS.map((drop) => (
        <GlassDrop key={drop.id} drop={drop} />
      ))}
      <div className={styles.mug}>
        {WISPS.map((wisp) => (
          <SteamWisp key={wisp.id} wisp={wisp} />
        ))}
        <svg className={styles.cup} viewBox="0 0 48 40">
          <path d="M6 8h28v18a12 12 0 0 1-12 12h-4A12 12 0 0 1 6 26zM34 13h3a6 6 0 0 1 0 12h-3v-4h3a2 2 0 0 0 0-4h-3z" />
        </svg>
      </div>
    </div>
  );
}

function LampEdge() {
  const x = useLoop(["-100%", "300%", "300%"]);

  return (
    <div className={styles.topEdge} aria-hidden>
      <motion.div className={styles.sweep} style={{ x }} />
    </div>
  );
}

const background = <LofiRainScene />;
const accent = <LampEdge />;

export default function LofiRainFrame(props: BaseFrameProps) {
  return <SceneFrame {...props} themeStyles={styles} background={background} accent={accent} />;
}
