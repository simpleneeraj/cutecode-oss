import MeshBlob, { type Blob } from "./mesh-blob";
import styles from "./stripe.module.css";

const BLOBS: Blob[] = [
  { id: "orange", tone: "toneOrange", left: -10, top: 30, size: 60, drift: 14, phase: 0 },
  { id: "lemon", tone: "toneLemon", left: 18, top: 55, size: 45, drift: 18, phase: 0.2 },
  { id: "magenta", tone: "toneMagenta", left: 38, top: 20, size: 60, drift: 12, phase: 0.45 },
  { id: "blurple", tone: "toneBlurple", left: 62, top: 45, size: 55, drift: 16, phase: 0.7 },
  { id: "cyan", tone: "toneCyan", left: 82, top: 25, size: 50, drift: 14, phase: 0.9 },
];

export default function StripeScene() {
  return (
    <div className={styles.layer} aria-hidden>
      <div className={styles.band}>
        {BLOBS.map((blob) => (
          <MeshBlob key={blob.id} blob={blob} />
        ))}
      </div>
    </div>
  );
}
