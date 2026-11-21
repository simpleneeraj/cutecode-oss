import { motion, easeInOut } from "motion/react";
import { useLoop } from "../scene";
import { cn } from "@cutecode/ui/lib/cn";
import styles from "./openai.module.css";

type Field = {
  id: string;
  className: string;
  x: string[];
  y: string[];
  phase: number;
};

const FIELDS: Field[] = [
  { id: "blue", className: styles.blue, x: ["0%", "8%", "-4%", "0%"], y: ["0%", "-6%", "6%", "0%"], phase: 0 },
  { id: "cyan", className: styles.cyan, x: ["0%", "-10%", "4%", "0%"], y: ["0%", "4%", "-8%", "0%"], phase: 0.25 },
  { id: "violet", className: styles.violet, x: ["0%", "6%", "10%", "0%"], y: ["0%", "8%", "-4%", "0%"], phase: 0.5 },
  { id: "green", className: styles.green, x: ["0%", "-6%", "-10%", "0%"], y: ["0%", "-8%", "4%", "0%"], phase: 0.75 },
];

function ColorField({ field }: { field: Field }) {
  const x = useLoop(field.x, { ease: easeInOut, phase: field.phase });
  const y = useLoop(field.y, { ease: easeInOut, phase: field.phase });
  const scale = useLoop([1, 1.12, 0.94, 1], { ease: easeInOut, phase: field.phase });

  return <motion.div className={cn(styles.field, field.className)} style={{ x, y, scale }} />;
}

export default function OpenAIScene() {
  return (
    <div className={styles.layer} aria-hidden>
      {FIELDS.map((field) => (
        <ColorField key={field.id} field={field} />
      ))}
      <div className={styles.vignette} />
      <div className={styles.grain} />
    </div>
  );
}
