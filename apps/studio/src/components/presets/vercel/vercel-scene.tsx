import Crosshair, { type Marker } from "./crosshair";
import DispersionFan from "./dispersion-fan";
import LightRay from "./light-ray";
import Prism from "./prism";
import styles from "./vercel.module.css";

const MARKERS: Marker[] = [
  { id: "left-top", column: -7, row: -4, phase: 0 },
  { id: "right-bottom", column: 8, row: 4, phase: 0.33 },
  { id: "left-bottom", column: -6, row: 5, phase: 0.66 },
];

export default function VercelScene() {
  return (
    <div className={styles.layer} aria-hidden>
      <div className={styles.grid} />
      <svg className={styles.optics} viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
        <DispersionFan />
        <LightRay />
        <Prism />
      </svg>
      {MARKERS.map((marker) => (
        <Crosshair key={marker.id} marker={marker} />
      ))}
    </div>
  );
}
