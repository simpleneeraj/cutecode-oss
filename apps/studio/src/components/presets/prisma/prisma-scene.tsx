import { motion, easeInOut } from "motion/react";
import { useLoop } from "../scene";
import RefractedBeam, { type Beam } from "./refracted-beam";
import Spark, { type SparkPoint } from "./spark";
import styles from "./prisma.module.css";

const BEAMS: Beam[] = [
  { id: "indigo", angle: 5, color: "#7f9cf5", phase: 0 },
  { id: "iris", angle: 11, color: "#a5b4fc", phase: 0.18 },
  { id: "violet", angle: 17, color: "#8b7cf6", phase: 0.36 },
  { id: "blue", angle: 23, color: "#5a67d8", phase: 0.54 },
  { id: "teal", angle: 29, color: "#31baaf", phase: 0.72 },
  { id: "aqua", angle: 35, color: "#71e8df", phase: 0.9 },
];

const SPARKS: SparkPoint[] = Array.from({ length: 12 }, (_, index) => ({
  id: `spark-${index}`,
  x: (index * 29 + 11) % 96,
  y: (index * 43 + 17) % 94,
  size: 4 + (index % 3) * 2,
  phase: ((index * 5) % 12) / 12,
  isTeal: index % 2 === 0,
}));

export default function PrismaScene() {
  const fanRotate = useLoop([0, 4, 0], { ease: easeInOut });
  const sourceScale = useLoop([1, 1.12, 1], { ease: easeInOut, cycles: 2 });
  const driftX = useLoop([0, -22, 0], { ease: easeInOut });
  const driftY = useLoop([0, 16, 0], { ease: easeInOut, phase: 0.25 });

  return (
    <div className={styles.layer} aria-hidden>
      <div className={styles.facets} />
      <motion.div className={styles.causticTeal} style={{ x: driftX, y: driftY }} />
      <motion.div className={styles.causticIndigo} style={{ x: driftY, y: driftX }} />
      <div className={styles.origin}>
        <motion.div className={styles.fan} style={{ rotate: fanRotate }} />
        {BEAMS.map((beam) => (
          <RefractedBeam key={beam.id} beam={beam} />
        ))}
        <motion.div className={styles.source} style={{ scale: sourceScale }} />
      </div>
      {SPARKS.map((spark) => (
        <Spark key={spark.id} spark={spark} />
      ))}
    </div>
  );
}
