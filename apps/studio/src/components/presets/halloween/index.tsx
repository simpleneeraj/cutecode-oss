import { motion, easeInOut } from "motion/react";
import { cn } from "@/utils/cn";
import { BaseFrameProps } from "@/typings/presets";
import { SceneFrame, useLoop } from "../scene";
import styles from "./style.module.css";

const PUMPKIN_STEM = "M22.6 15.4C22.8 13.4 23 11.6 22.6 10C24 9.8 25.2 10 26.2 10.6C25.6 12.2 25.4 13.8 25.6 15.4Z";
const PUMPKIN_BODY =
  "M24 15.6C21.6 14.4 18 14.4 15.4 16C11.6 18.4 10.4 23.4 11 28C11.6 33 15.4 36.4 19.6 36.2C21.2 36.2 22.6 35.6 24 35C25.4 35.6 26.8 36.2 28.4 36.2C32.6 36.4 36.4 33 37 28C37.6 23.4 36.4 18.4 32.6 16C30 14.4 26.4 14.4 24 15.6Z";
const PUMPKIN_RIBS = "M24 15.6C21.2 20 21.2 30 24 35M24 15.6C26.8 20 26.8 30 24 35M17.4 15.4C14.6 20 15 31 19.6 36.2M30.6 15.4C33.4 20 33 31 28.4 36.2";
const PUMPKIN_FACE =
  "M17.6 24L20.4 20.4L22.2 24.2ZM25.8 24.2L27.6 20.4L30.4 24ZM16.6 27.4C18.8 31.6 29 31.6 31.4 27.4C29.8 28.6 28.6 28.8 27.6 28.4L26.6 30L25.4 28.6C24.4 28.9 23.6 28.9 22.6 28.6L21.4 30L20.4 28.4C19 28.8 17.8 28.6 16.6 27.4Z";

const BAT_LEFT_WING = "M13 10C10 6 5 5 1 7C3 8 3.6 9.6 3.4 11C5 10 6.6 10.4 7.4 12C8.6 11 10.4 11 12.6 13Z";
const BAT_RIGHT_WING = "M19 10C22 6 27 5 31 7C29 8 28.4 9.6 28.6 11C27 10 25.4 10.4 24.6 12C23.4 11 21.6 11 19.4 13Z";
const BAT_EARS = "M13.6 8.4L13.8 4.6L15.4 7.2ZM18.4 8.4L18.2 4.6L16.6 7.2Z";

const GHOST_PATH = "M16 2C8.8 2 4 7.6 4 15V32L8 29L12 32L16 29L20 32L24 29L28 32V15C28 7.6 23.2 2 16 2Z";
const SPIDER_LEGS = "M7.5 11L3 7.6M7.2 13.5L2.4 13M7.6 15.6L3.4 18.6M16.5 11L21 7.6M16.8 13.5L21.6 13M16.4 15.6L20.6 18.6";

const BACK_HILL = "M0 46C16 24 32 30 48 42C62 52 78 22 100 34V100H0Z";
const FRONT_HILL = "M0 70C20 52 40 58 58 66C74 72 88 54 100 60V100H0Z";

const BATS = [
  { id: "bat-high", top: 12, size: 40, rise: -12, cycles: 1, phase: 0 },
  { id: "bat-low", top: 34, size: 28, rise: 10, cycles: 1, phase: 0.35 },
  { id: "bat-mid", top: 22, size: 34, rise: -8, cycles: 1, phase: 0.62 },
  { id: "bat-far", top: 6, size: 22, rise: 6, cycles: 2, phase: 0.2 },
];

const STARS = Array.from({ length: 14 }, (_, index) => ({
  id: `star-${index}`,
  left: `${(index * 37 + 5) % 96}%`,
  top: `${4 + ((index * 23) % 44)}%`,
  size: 2 + (index % 2),
  cycles: 1 + (index % 3),
  phase: ((index * 3) % 14) / 14,
}));

const LANTERNS = [
  { id: "lantern-large", x: 4, bottom: 3, size: 18, phase: 0 },
  { id: "lantern-small", x: 17, bottom: 2, size: 11, phase: 0.4 },
  { id: "lantern-right", x: 84, bottom: 4, size: 14, phase: 0.7 },
];

function createFog(prefix: string, count: number, base: number) {
  return Array.from({ length: count }, (_, index) => ({
    id: `${prefix}-${index}`,
    left: `${-24 + index * (112 / count)}%`,
    bottom: `${base + ((index * 5) % 10)}cqh`,
    drift: index % 2 === 0 ? 8 : -8,
    phase: index / count,
  }));
}

const FOG_BACK = createFog("fog-back", 4, 8);
const FOG_FRONT = createFog("fog-front", 3, -4);

type Bat = (typeof BATS)[number];
type Star = (typeof STARS)[number];
type Lantern = (typeof LANTERNS)[number];
type Wisp = (typeof FOG_BACK)[number];

function FlyingBat({ bat }: { bat: Bat }) {
  const options = { cycles: bat.cycles, phase: bat.phase };
  const x = useLoop(["-16cqw", "116cqw"], options);
  const y = useLoop([0, bat.rise, 0, -bat.rise, 0], { ...options, ease: easeInOut });
  const flap = useLoop([1, 0.25, 1], { cycles: 10, phase: bat.phase, ease: easeInOut });

  return (
    <motion.svg
      className={styles.bat}
      viewBox="0 0 32 20"
      width={bat.size}
      height={(bat.size * 20) / 32}
      style={{ top: `${bat.top}%`, x, y }}
    >
      <motion.g style={{ scaleY: flap }}>
        <path d={BAT_LEFT_WING} />
        <path d={BAT_RIGHT_WING} />
      </motion.g>
      <path d={BAT_EARS} />
      <ellipse cx="16" cy="11" rx="3.4" ry="4.2" />
      <circle className={styles.batEye} cx="14.8" cy="10.2" r="0.7" />
      <circle className={styles.batEye} cx="17.2" cy="10.2" r="0.7" />
    </motion.svg>
  );
}

function TwinkleStar({ star }: { star: Star }) {
  const opacity = useLoop([0.2, 1, 0.2], { cycles: star.cycles, phase: star.phase, ease: easeInOut });

  return (
    <motion.span
      className={styles.star}
      style={{ left: star.left, top: star.top, width: star.size, height: star.size, opacity }}
    />
  );
}

function FogWisp({ wisp }: { wisp: Wisp }) {
  const x = useLoop(["0cqw", `${wisp.drift}cqw`, "0cqw"], { phase: wisp.phase, ease: easeInOut });
  const opacity = useLoop([0.6, 1, 0.6], { phase: wisp.phase, ease: easeInOut });

  return <motion.span className={styles.fog} style={{ left: wisp.left, bottom: wisp.bottom, x, opacity }} />;
}

function JackOLantern({ lantern }: { lantern: Lantern }) {
  const rotate = useLoop([-4, 4, -4], { phase: lantern.phase, ease: easeInOut });
  const flicker = useLoop([0.7, 1, 0.78, 0.95, 0.62, 0.7], { cycles: 3, phase: lantern.phase, ease: easeInOut });

  return (
    <motion.div
      className={styles.lantern}
      style={{ left: `${lantern.x}%`, bottom: `${lantern.bottom}cqh`, width: `${lantern.size}cqmin`, rotate }}
    >
      <motion.span className={styles.lanternGlow} style={{ opacity: flicker }} />
      <svg className={styles.pumpkin} viewBox="10 9 28 28">
        <path className={styles.stem} d={PUMPKIN_STEM} />
        <path className={styles.body} d={PUMPKIN_BODY} />
        <path className={styles.ribs} d={PUMPKIN_RIBS} />
        <path className={styles.faceHollow} d={PUMPKIN_FACE} />
        <motion.path className={styles.faceLight} d={PUMPKIN_FACE} style={{ opacity: flicker }} />
      </svg>
    </motion.div>
  );
}

function PeekingGhost() {
  const y = useLoop(["0cqh", "-3cqh", "0cqh"], { ease: easeInOut, phase: 0.2 });
  const rotate = useLoop([-3, 3, -3], { ease: easeInOut, phase: 0.45 });

  return (
    <motion.svg className={styles.ghost} viewBox="0 0 32 36" style={{ y, rotate }}>
      <path className={styles.ghostBody} d={GHOST_PATH} />
      <ellipse className={styles.ghostEye} cx="12" cy="15" rx="1.6" ry="2.2" />
      <ellipse className={styles.ghostEye} cx="20" cy="15" rx="1.6" ry="2.2" />
      <circle className={styles.ghostBlush} cx="9.4" cy="19.4" r="1.6" />
      <circle className={styles.ghostBlush} cx="22.6" cy="19.4" r="1.6" />
      <ellipse className={styles.ghostEye} cx="16" cy="20.4" rx="1.2" ry="1.4" />
    </motion.svg>
  );
}

function DanglingSpider() {
  const y = useLoop(["0cqh", "8cqh", "0cqh"], { ease: easeInOut, phase: 0.1 });

  return (
    <motion.div className={styles.spider} style={{ y }}>
      <span className={styles.silk} />
      <svg className={styles.spiderBody} viewBox="0 0 24 24">
        <path className={styles.spiderLegs} d={SPIDER_LEGS} />
        <circle cx="12" cy="13" r="5" />
        <circle className={styles.spiderEye} cx="10.2" cy="12.4" r="1.2" />
        <circle className={styles.spiderEye} cx="13.8" cy="12.4" r="1.2" />
      </svg>
    </motion.div>
  );
}

function Moon() {
  const glowScale = useLoop([1, 1.08, 1], { ease: easeInOut });

  return (
    <>
      <motion.div className={styles.moonGlow} style={{ scale: glowScale }} />
      <div className={styles.moon} />
    </>
  );
}

type HillProps = { path: string; tone: string };

function Hill({ path, tone }: HillProps) {
  return (
    <svg className={cn(styles.hill, tone)} viewBox="0 0 100 100" preserveAspectRatio="none">
      <path d={path} />
    </svg>
  );
}

function HalloweenScene() {
  return (
    <div className={styles.layer} aria-hidden>
      <div className={styles.horizon} />
      {STARS.map((star) => (
        <TwinkleStar key={star.id} star={star} />
      ))}
      <Moon />
      {BATS.map((bat) => (
        <FlyingBat key={bat.id} bat={bat} />
      ))}
      <DanglingSpider />
      <Hill path={BACK_HILL} tone={styles.hillBack} />
      <PeekingGhost />
      <Hill path={FRONT_HILL} tone={styles.hillFront} />
      {FOG_BACK.map((wisp) => (
        <FogWisp key={wisp.id} wisp={wisp} />
      ))}
      {LANTERNS.map((lantern) => (
        <JackOLantern key={lantern.id} lantern={lantern} />
      ))}
      {FOG_FRONT.map((wisp) => (
        <FogWisp key={wisp.id} wisp={wisp} />
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
