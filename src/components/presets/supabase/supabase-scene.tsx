import Aurora, { type AuroraRibbon } from "./aurora";
import Bolt from "./bolt";
import EnergyLine, { type Streak } from "./energy-line";
import Spark, { type Ember } from "./spark";
import styles from "./supabase.module.css";

const RIBBONS: AuroraRibbon[] = [
  { id: "north", className: styles.auroraNorth, phase: 0 },
  { id: "south", className: styles.auroraSouth, phase: 0.5 },
];

const STREAKS: Streak[] = [
  { id: "north-near", x1: 1500, y1: -60, x2: 1060, y2: 350, phase: 0 },
  { id: "north-mid", x1: 1600, y1: 120, x2: 1240, y2: 456, phase: 0.35 },
  { id: "north-far", x1: 1640, y1: 420, x2: 1380, y2: 663, phase: 0.7 },
  { id: "south-near", x1: 400, y1: 560, x2: 40, y2: 896, phase: 0.2 },
  { id: "south-mid", x1: 560, y1: 700, x2: 200, y2: 1036, phase: 0.55 },
  { id: "south-far", x1: 220, y1: 380, x2: -80, y2: 660, phase: 0.85 },
];

const EMBERS: Ember[] = [
  { id: "inner-left", x: 560, y: 560, phase: 0 },
  { id: "inner-right", x: 1040, y: 420, phase: 0.25 },
  { id: "far-right", x: 1320, y: 820, phase: 0.5 },
  { id: "far-left", x: 260, y: 180, phase: 0.75 },
  { id: "top", x: 1420, y: 220, phase: 0.4 },
];

export default function SupabaseScene() {
  return (
    <div className={styles.layer} aria-hidden>
      {RIBBONS.map((ribbon) => (
        <Aurora key={ribbon.id} ribbon={ribbon} />
      ))}
      <div className={styles.dotGrid} />
      <svg className={styles.energy} viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
        {STREAKS.map((streak) => (
          <EnergyLine key={streak.id} streak={streak} />
        ))}
        <Bolt />
        {EMBERS.map((ember) => (
          <Spark key={ember.id} ember={ember} />
        ))}
      </svg>
    </div>
  );
}
