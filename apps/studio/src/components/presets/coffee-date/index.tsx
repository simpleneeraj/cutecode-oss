import { motion, easeInOut } from "motion/react";
import { BaseFrameProps } from "@/typings/presets";
import { SceneFrame, useLoop } from "../scene";
import styles from "./style.module.css";

const WISPS = Array.from({ length: 9 }, (_, index) => ({
  id: `wisp-${index}`,
  left: `${8 + ((index * 37) % 84)}%`,
  width: 26 + ((index * 9) % 22),
  sway: index % 2 === 0 ? 18 : -18,
  cycles: 1 + (index % 2),
  phase: index / 9,
}));

const BEANS = [
  { id: "bean-top-left", x: 7, y: 12, size: 16, tilt: -30 },
  { id: "bean-top-right", x: 89, y: 10, size: 14, tilt: 40 },
  { id: "bean-right", x: 93, y: 50, size: 12, tilt: 110 },
  { id: "bean-bottom-right", x: 82, y: 86, size: 17, tilt: -60 },
  { id: "bean-bottom-left", x: 12, y: 84, size: 14, tilt: 20 },
  { id: "bean-left", x: 4, y: 46, size: 11, tilt: 75 },
  { id: "bean-bottom", x: 48, y: 93, size: 12, tilt: -15 },
];

type Wisp = (typeof WISPS)[number];
type Bean = (typeof BEANS)[number];

function SteamWisp({ wisp }: { wisp: Wisp }) {
  const options = { cycles: wisp.cycles, phase: wisp.phase };
  const y = useLoop(["100cqh", "-20cqh"], options);
  const x = useLoop([0, wisp.sway, 0, -wisp.sway, 0], { ...options, ease: easeInOut });
  const scaleX = useLoop([0.6, 1, 1.4], options);
  const opacity = useLoop([0, 0.55, 0.35, 0], options);

  return (
    <motion.span
      className={styles.wisp}
      style={{ left: wisp.left, width: wisp.width, height: wisp.width * 2.4, top: 0, x, y, scaleX, opacity }}
    />
  );
}

function FloatingBean({ bean, index }: { bean: Bean; index: number }) {
  const phase = index / BEANS.length;
  const y = useLoop([0, -8, 0], { phase, ease: easeInOut });
  const rotate = useLoop([bean.tilt, bean.tilt + 16, bean.tilt], { phase, ease: easeInOut });

  return (
    <motion.span
      className={styles.bean}
      style={{ left: `${bean.x}%`, top: `${bean.y}%`, width: bean.size, height: bean.size * 1.35, y, rotate }}
    />
  );
}

function CoffeeDateScene() {
  const lampScale = useLoop([1, 1.06, 1], { ease: easeInOut });
  const lampOpacity = useLoop([0.85, 1, 0.85], { cycles: 2, ease: easeInOut });
  const driftX = useLoop([0, 18, 0], { ease: easeInOut, phase: 0.25 });

  return (
    <div className={styles.layer} aria-hidden>
      <motion.div className={styles.lamp} style={{ scale: lampScale, opacity: lampOpacity }} />
      <motion.div className={styles.blobCaramel} style={{ x: driftX }} />
      <div className={styles.grain} />
      {WISPS.map((wisp) => (
        <SteamWisp key={wisp.id} wisp={wisp} />
      ))}
      {BEANS.map((bean, index) => (
        <FloatingBean key={bean.id} bean={bean} index={index} />
      ))}
    </div>
  );
}

function CremaEdge() {
  const x = useLoop(["-100%", "300%", "300%"]);

  return (
    <div className={styles.topEdge} aria-hidden>
      <motion.div className={styles.sweep} style={{ x }} />
    </div>
  );
}

const background = <CoffeeDateScene />;
const accent = <CremaEdge />;

export default function CoffeeDateFrame(props: BaseFrameProps) {
  return <SceneFrame {...props} themeStyles={styles} background={background} accent={accent} />;
}
