import { motion, easeInOut } from "motion/react";
import { BaseFrameProps } from "@/typings/presets";
import { SceneFrame, useLoop } from "../scene";
import styles from "./style.module.css";

const NOTE_PATHS = {
  single: "M9 3v11.3A3 3 0 1 0 11 17V7h5V3z",
  double: "M8 4l10-2v12.3A3 3 0 1 0 20 17V5.5l-10 2v9.8A3 3 0 1 0 12 20V7.8z",
};

const NOTES = [
  { id: "note-a", x: 6, y: 78, size: 18, path: NOTE_PATHS.single, sway: 10 },
  { id: "note-b", x: 16, y: 88, size: 22, path: NOTE_PATHS.double, sway: -12 },
  { id: "note-c", x: 28, y: 82, size: 16, path: NOTE_PATHS.single, sway: 8 },
  { id: "note-d", x: 42, y: 92, size: 20, path: NOTE_PATHS.double, sway: -10 },
  { id: "note-e", x: 4, y: 40, size: 14, path: NOTE_PATHS.single, sway: 12 },
  { id: "note-f", x: 92, y: 18, size: 16, path: NOTE_PATHS.single, sway: -8 },
];

const MOTES = Array.from({ length: 16 }, (_, index) => ({
  id: `mote-${index}`,
  left: `${(index * 23 + 4) % 60}%`,
  top: `${(index * 31 + 8) % 70}%`,
  size: 2 + (index % 3),
  drift: index % 2 === 0 ? 14 : -14,
  phase: ((index * 5) % 16) / 16,
}));

type Note = (typeof NOTES)[number];
type Mote = (typeof MOTES)[number];

function FloatingNote({ note, index }: { note: Note; index: number }) {
  const options = { phase: index / NOTES.length };
  const y = useLoop([0, -90], options);
  const x = useLoop([0, note.sway, 0], { ...options, ease: easeInOut });
  const rotate = useLoop([-8, 8, -8], { ...options, ease: easeInOut });
  const opacity = useLoop([0, 0.6, 0.6, 0], options);

  return (
    <motion.svg
      className={styles.note}
      viewBox="0 0 24 24"
      width={note.size}
      height={note.size}
      style={{ left: `${note.x}%`, top: `${note.y}%`, x, y, rotate, opacity }}
    >
      <path d={note.path} />
    </motion.svg>
  );
}

function DustMote({ mote }: { mote: Mote }) {
  const options = { phase: mote.phase, ease: easeInOut };
  const x = useLoop([0, mote.drift, 0], options);
  const y = useLoop([0, -10, 6, 0], options);
  const opacity = useLoop([0.1, 0.7, 0.1], options);

  return (
    <motion.span
      className={styles.mote}
      style={{ left: mote.left, top: mote.top, width: mote.size, height: mote.size, x, y, opacity }}
    />
  );
}

function SpinningRecord() {
  const rotate = useLoop([0, 360]);

  return (
    <div className={styles.turntable}>
      <motion.div className={styles.record} style={{ rotate }}>
        <div className={styles.label}>
          <span className={styles.labelMark} />
        </div>
      </motion.div>
      <div className={styles.sheen} />
      <svg className={styles.tonearm} viewBox="0 0 120 160">
        <circle cx="96" cy="20" r="12" />
        <path d="M96 20L80 110L52 138" />
        <rect x="40" y="132" width="18" height="12" rx="3" transform="rotate(-45 49 138)" />
      </svg>
    </div>
  );
}

function VinylScene() {
  const lampScale = useLoop([1, 1.05, 1], { ease: easeInOut });

  return (
    <div className={styles.layer} aria-hidden>
      <motion.div className={styles.lamp} style={{ scale: lampScale }} />
      <div className={styles.beam} />
      {MOTES.map((mote) => (
        <DustMote key={mote.id} mote={mote} />
      ))}
      <SpinningRecord />
      {NOTES.map((note, index) => (
        <FloatingNote key={note.id} note={note} index={index} />
      ))}
    </div>
  );
}

function GrooveEdge() {
  const x = useLoop(["-100%", "300%", "300%"]);

  return (
    <div className={styles.topEdge} aria-hidden>
      <motion.div className={styles.sweep} style={{ x }} />
    </div>
  );
}

const background = <VinylScene />;
const accent = <GrooveEdge />;

export default function VinylFrame(props: BaseFrameProps) {
  return <SceneFrame {...props} themeStyles={styles} background={background} accent={accent} />;
}
