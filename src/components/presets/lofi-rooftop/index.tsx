import { motion, easeInOut } from "motion/react";
import { BaseFrameProps } from "@/typings/presets";
import { SceneFrame, useLoop } from "../scene";
import styles from "./style.module.css";

const SKYLINE = [
  { id: "tower-a", left: 0, width: 70, height: 120 },
  { id: "tower-b", left: 9, width: 54, height: 170 },
  { id: "tower-c", left: 17, width: 80, height: 95 },
  { id: "tower-d", left: 30, width: 60, height: 140 },
  { id: "tower-e", left: 44, width: 90, height: 82 },
  { id: "tower-f", left: 58, width: 56, height: 160 },
  { id: "tower-g", left: 68, width: 76, height: 110 },
  { id: "tower-h", left: 80, width: 52, height: 185 },
  { id: "tower-i", left: 89, width: 80, height: 130 },
];

const TOWERS = SKYLINE.map((tower, towerIndex) => ({
  ...tower,
  windows: Array.from({ length: 2 + (towerIndex % 2) }, (_, index) => ({
    id: `${tower.id}-window-${index}`,
    left: 8 + ((index * 2 + towerIndex) % 3) * 14,
    top: 14 + index * 22,
    cycles: 1 + ((towerIndex + index) % 2),
    phase: ((towerIndex * 3 + index * 5) % 10) / 10,
  })),
}));

const CLOUDS = [
  { id: "cloud-a", x: 4, y: 10, width: 180, drift: 36 },
  { id: "cloud-b", x: 58, y: 6, width: 220, drift: -30 },
  { id: "cloud-c", x: 30, y: 26, width: 140, drift: 24 },
  { id: "cloud-d", x: 78, y: 30, width: 160, drift: -22 },
];

const STARS = [
  { id: "star-a", x: 8, y: 6 },
  { id: "star-b", x: 22, y: 18 },
  { id: "star-c", x: 47, y: 4 },
  { id: "star-d", x: 66, y: 16 },
  { id: "star-e", x: 84, y: 5 },
  { id: "star-f", x: 95, y: 20 },
];

const FAR_SKYLINE_PATH =
  "M0 80V50h10V38h8v12h12V30h6v-6h4v6h6v26h10V44h14v36zM80 80V40h12v-8h10v8h8v18h14V26h4v-8h2v8h4v54zM134 80V48h16V36h12v12h10V30h14v20h14v30z";

type Tower = (typeof TOWERS)[number];
type TowerWindow = Tower["windows"][number];
type Cloud = (typeof CLOUDS)[number];
type Star = (typeof STARS)[number];

function LitWindow({ pane }: { pane: TowerWindow }) {
  const opacity = useLoop([0.95, 0.95, 0.2, 0.95], { cycles: pane.cycles, phase: pane.phase, ease: easeInOut });

  return <motion.span className={styles.litWindow} style={{ left: pane.left, top: pane.top, opacity }} />;
}

function Building({ tower }: { tower: Tower }) {
  return (
    <div className={styles.tower} style={{ left: `${tower.left}%`, width: tower.width, height: tower.height }}>
      {tower.windows.map((pane) => (
        <LitWindow key={pane.id} pane={pane} />
      ))}
    </div>
  );
}

function DriftingCloud({ cloud, index }: { cloud: Cloud; index: number }) {
  const x = useLoop([0, cloud.drift, 0], { phase: index / CLOUDS.length, ease: easeInOut });

  return (
    <motion.div
      className={styles.cloud}
      style={{ left: `${cloud.x}%`, top: `${cloud.y}%`, width: cloud.width, height: cloud.width * 0.28, x }}
    />
  );
}

function TwinkleStar({ star, index }: { star: Star; index: number }) {
  const opacity = useLoop([0.2, 0.9, 0.2], { cycles: 1 + (index % 2), phase: index / STARS.length, ease: easeInOut });

  return <motion.span className={styles.star} style={{ left: `${star.x}%`, top: `${star.y}%`, opacity }} />;
}

function LofiRooftopScene() {
  const sunScale = useLoop([1, 1.05, 1], { ease: easeInOut });

  return (
    <div className={styles.layer} aria-hidden>
      {STARS.map((star, index) => (
        <TwinkleStar key={star.id} star={star} index={index} />
      ))}
      <motion.div className={styles.sun} style={{ scale: sunScale }} />
      {CLOUDS.map((cloud, index) => (
        <DriftingCloud key={cloud.id} cloud={cloud} index={index} />
      ))}
      <svg className={styles.farSkyline} viewBox="0 0 200 80" preserveAspectRatio="none">
        <path d={FAR_SKYLINE_PATH} />
      </svg>
      {TOWERS.map((tower) => (
        <Building key={tower.id} tower={tower} />
      ))}
    </div>
  );
}

function DuskEdge() {
  const x = useLoop(["-100%", "300%", "300%"]);

  return (
    <div className={styles.topEdge} aria-hidden>
      <motion.div className={styles.sweep} style={{ x }} />
    </div>
  );
}

const background = <LofiRooftopScene />;
const accent = <DuskEdge />;

export default function LofiRooftopFrame(props: BaseFrameProps) {
  return <SceneFrame {...props} themeStyles={styles} background={background} accent={accent} />;
}
