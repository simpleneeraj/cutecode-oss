import { motion, easeInOut } from "motion/react";
import { Icon } from "@/components/ui/icon";
import { BaseFrameProps } from "@/typings/presets";
import { SceneFrame, useLoop } from "../scene";
import styles from "./valentine.module.css";

const KEEPSAKES = [
  { id: "letter-top-left", icon: "solar:letter-bold-duotone", x: 6, y: 9, size: 24, tilt: -10 },
  { id: "gift-top-right", icon: "solar:gift-bold-duotone", x: 88, y: 8, size: 20, tilt: 8 },
  { id: "heart-right", icon: "solar:heart-angle-bold-duotone", x: 91, y: 52, size: 18, tilt: 12 },
  { id: "letter-bottom-right", icon: "solar:letter-bold-duotone", x: 84, y: 84, size: 20, tilt: 14 },
  { id: "heart-left", icon: "solar:heart-shine-bold-duotone", x: 4, y: 56, size: 18, tilt: -12 },
  { id: "stars-bottom-left", icon: "solar:stars-bold-duotone", x: 14, y: 88, size: 16, tilt: 0 },
];

const CONFETTI = Array.from({ length: 20 }, (_, index) => ({
  id: `confetti-${index}`,
  left: `${(index * 29 + 11) % 100}%`,
  size: 6 + ((index * 3) % 6),
  sway: index % 2 === 0 ? 16 : -16,
  spin: index % 2 === 0 ? 180 : -180,
  cycles: 1 + (index % 2),
  phase: ((index * 7) % 20) / 20,
}));

type Keepsake = (typeof KEEPSAKES)[number];
type Confetti = (typeof CONFETTI)[number];

function FloatingKeepsake({ keepsake, index }: { keepsake: Keepsake; index: number }) {
  const phase = index / KEEPSAKES.length;
  const y = useLoop([0, -12, 0], { phase, ease: easeInOut });
  const rotate = useLoop([keepsake.tilt, -keepsake.tilt, keepsake.tilt], { phase, ease: easeInOut });

  return (
    <motion.span className={styles.keepsake} style={{ left: `${keepsake.x}%`, top: `${keepsake.y}%`, y, rotate }}>
      <Icon icon={keepsake.icon} width={keepsake.size} height={keepsake.size} />
    </motion.span>
  );
}

function FallingConfetti({ confetti }: { confetti: Confetti }) {
  const options = { cycles: confetti.cycles, phase: confetti.phase };
  const y = useLoop(["-6cqh", "106cqh"], options);
  const x = useLoop([0, confetti.sway, 0, -confetti.sway, 0], { ...options, ease: easeInOut });
  const rotate = useLoop([0, confetti.spin], options);
  const opacity = useLoop([0, 0.85, 0.85, 0], options);

  return (
    <motion.span className={styles.confetti} style={{ left: confetti.left, top: 0, x, y, rotate, opacity }}>
      <Icon icon="solar:heart-bold" width={confetti.size} height={confetti.size} />
    </motion.span>
  );
}

function ValentineScene() {
  const driftX = useLoop([0, 22, 0], { ease: easeInOut });
  const driftY = useLoop([0, -18, 0], { ease: easeInOut, phase: 0.25 });
  const laceOpacity = useLoop([0.5, 0.85, 0.5], { ease: easeInOut });

  return (
    <div className={styles.layer} aria-hidden>
      <motion.div className={styles.blobA} style={{ x: driftX, y: driftY }} />
      <motion.div className={styles.blobB} style={{ x: driftY, y: driftX }} />
      <motion.div className={styles.lace} style={{ opacity: laceOpacity }} />
      {KEEPSAKES.map((keepsake, index) => (
        <FloatingKeepsake key={keepsake.id} keepsake={keepsake} index={index} />
      ))}
      {CONFETTI.map((confetti) => (
        <FallingConfetti key={confetti.id} confetti={confetti} />
      ))}
    </div>
  );
}

function RibbonEdge() {
  const x = useLoop(["-100%", "300%", "300%"], { phase: 0.5 });

  return (
    <div className={styles.topEdge} aria-hidden>
      <motion.div className={styles.sweep} style={{ x }} />
    </div>
  );
}

const background = <ValentineScene />;
const accent = <RibbonEdge />;

export default function ValentineFrame(props: BaseFrameProps) {
  return <SceneFrame {...props} themeStyles={styles} background={background} accent={accent} />;
}
