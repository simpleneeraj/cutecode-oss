import { motion, easeInOut } from "motion/react";
import { cn } from "@/utils/cn";
import { useLoop } from "../scene";
import styles from "./stripe.module.css";

export type Blob = {
  id: string;
  tone: string;
  left: number;
  top: number;
  size: number;
  drift: number;
  phase: number;
};

type MeshBlobProps = {
  blob: Blob;
};

export default function MeshBlob({ blob }: MeshBlobProps) {
  const orbit = ["0%", `${blob.drift}%`, "0%", `${-blob.drift}%`, "0%"];
  const x = useLoop(orbit, { phase: blob.phase, ease: easeInOut });
  const y = useLoop(orbit, { phase: (blob.phase + 0.25) % 1, ease: easeInOut });

  return (
    <motion.div
      className={cn(styles.blob, styles[blob.tone])}
      style={{ left: `${blob.left}%`, top: `${blob.top}%`, width: `${blob.size}%`, x, y }}
    />
  );
}
