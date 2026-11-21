import { useId } from "react";
import { motion, easeInOut } from "motion/react";
import { useLoop } from "../scene";
import styles from "./vercel.module.css";

const BANDS = [
  { id: "band-upper", points: "1140,305 1600,240 1600,380", phase: 0 },
  { id: "band-middle", points: "1140,305 1600,380 1600,500", phase: 1 / 3 },
  { id: "band-lower", points: "1140,305 1600,500 1600,640", phase: 2 / 3 },
];

type BandProps = {
  points: string;
  phase: number;
  fill: string;
};

function Band({ points, phase, fill }: BandProps) {
  const opacity = useLoop([0.35, 0.8, 0.35], { phase, ease: easeInOut });

  return <motion.polygon points={points} fill={fill} style={{ opacity }} />;
}

export default function DispersionFan() {
  const gradientId = useId();
  const fill = `url(#${gradientId})`;

  return (
    <g>
      <defs>
        <linearGradient id={gradientId} gradientUnits="userSpaceOnUse" x1="1140" y1="0" x2="1600" y2="0">
          <stop offset="0" className={styles.stopFan} />
          <stop offset="1" className={styles.stopFan} stopOpacity="0" />
        </linearGradient>
      </defs>
      {BANDS.map((band) => (
        <Band key={band.id} points={band.points} phase={band.phase} fill={fill} />
      ))}
    </g>
  );
}
