import { motion, easeInOut } from "motion/react";
import { useLoop } from "../scene";
import { cn } from "@/utils/cn";
import styles from "./claude.module.css";

export type DuneLayer = {
  id: string;
  className: string;
  base: number;
  amplitude: number;
  phase: number;
};

type DuneProps = {
  layer: DuneLayer;
};

function wavePath(base: number, amplitude: number) {
  const crest = base - amplitude;
  const trough = base + amplitude;
  const humps = [0, 200].map(
    (start) =>
      `C${start + 35} ${crest} ${start + 65} ${crest} ${start + 100} ${base}C${start + 135} ${trough} ${start + 165} ${trough} ${start + 200} ${base}`,
  );
  return `M0 ${base}${humps.join("")}L400 100L0 100Z`;
}

export default function Dune({ layer }: DuneProps) {
  const x = useLoop(["0%", "-4%", "0%"], { phase: layer.phase, ease: easeInOut });

  return (
    <motion.svg
      className={cn(styles.dune, layer.className)}
      viewBox="0 0 400 100"
      preserveAspectRatio="none"
      style={{ x }}
    >
      <path d={wavePath(layer.base, layer.amplitude)} fill="currentColor" />
    </motion.svg>
  );
}
