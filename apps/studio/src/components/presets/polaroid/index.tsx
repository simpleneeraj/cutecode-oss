import { motion, easeInOut } from "motion/react";
import { cn } from "@cutecode/ui/lib/cn";
import { BaseFrameProps } from "@/typings/presets";
import { SceneFrame, useLoop } from "../scene";
import styles from "./style.module.css";

const LEAKS = [
  { id: "leak-amber", tone: styles.amber, drift: 40, phase: 0 },
  { id: "leak-honey", tone: styles.honey, drift: -34, phase: 0.33 },
  { id: "leak-ember", tone: styles.ember, drift: 28, phase: 0.66 },
];

const SNAPSHOTS = [
  { id: "snapshot-top-left", x: 4, y: 8, tilt: -10, tone: styles.dusk },
  { id: "snapshot-top-right", x: 88, y: 6, tilt: 8, tone: styles.shore },
  { id: "snapshot-bottom-left", x: 7, y: 76, tilt: 6, tone: styles.shore },
  { id: "snapshot-bottom-right", x: 86, y: 78, tilt: -7, tone: styles.dusk },
];

const MOTES = Array.from({ length: 10 }, (_, index) => ({
  id: `mote-${index}`,
  left: `${(index * 37 + 11) % 100}%`,
  top: `${(index * 53 + 17) % 100}%`,
  size: 2 + (index % 3),
  phase: ((index * 3) % 10) / 10,
}));

type Leak = (typeof LEAKS)[number];
type Snapshot = (typeof SNAPSHOTS)[number];
type Mote = (typeof MOTES)[number];

type LightLeakProps = {
  leak: Leak;
};

function LightLeak({ leak }: LightLeakProps) {
  const options = { phase: leak.phase, ease: easeInOut };
  const x = useLoop([0, leak.drift, 0], options);
  const y = useLoop([0, -leak.drift / 2, 0], options);
  const opacity = useLoop([0.55, 1, 0.55], options);

  return <motion.div className={cn(styles.leak, leak.tone)} style={{ x, y, opacity }} />;
}

type FloatingSnapshotProps = {
  snapshot: Snapshot;
  index: number;
};

function FloatingSnapshot({ snapshot, index }: FloatingSnapshotProps) {
  const options = { phase: index / SNAPSHOTS.length, ease: easeInOut };
  const y = useLoop([0, -8, 0], options);
  const rotate = useLoop([snapshot.tilt, snapshot.tilt + 3, snapshot.tilt], options);

  return (
    <motion.span
      className={cn(styles.snapshot, snapshot.tone)}
      style={{ left: `${snapshot.x}%`, top: `${snapshot.y}%`, y, rotate }}
    />
  );
}

type DustMoteProps = {
  mote: Mote;
};

function DustMote({ mote }: DustMoteProps) {
  const options = { phase: mote.phase, ease: easeInOut };
  const y = useLoop([0, -16, 0], options);
  const opacity = useLoop([0.2, 0.8, 0.2], options);

  return (
    <motion.span
      className={styles.mote}
      style={{ left: mote.left, top: mote.top, width: mote.size, height: mote.size, y, opacity }}
    />
  );
}

function InstantFilmScene() {
  const grainX = useLoop([0, -3, 2, -1, 0], { cycles: 6 });
  const grainY = useLoop([0, 2, -2, 1, 0], { cycles: 6 });

  return (
    <div className={styles.layer} aria-hidden>
      {LEAKS.map((leak) => (
        <LightLeak key={leak.id} leak={leak} />
      ))}
      {SNAPSHOTS.map((snapshot, index) => (
        <FloatingSnapshot key={snapshot.id} snapshot={snapshot} index={index} />
      ))}
      {MOTES.map((mote) => (
        <DustMote key={mote.id} mote={mote} />
      ))}
      <motion.div className={styles.grain} style={{ x: grainX, y: grainY }} />
    </div>
  );
}

function DevelopingEdge() {
  const x = useLoop(["-100%", "300%", "300%"]);

  return (
    <div className={styles.topEdge} aria-hidden>
      <motion.div className={styles.sweep} style={{ x }} />
    </div>
  );
}

const background = <InstantFilmScene />;
const accent = <DevelopingEdge />;

export default function InstantFilmFrame(props: BaseFrameProps) {
  return <SceneFrame {...props} themeStyles={styles} background={background} accent={accent} />;
}
