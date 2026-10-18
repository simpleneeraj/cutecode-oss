import styles from "@/styles/editor/Frame.module.css";
import { useSubscription } from "@/hooks/use-subscription";

export default function Watermark() {
  const { can, isLoaded } = useSubscription();

  if (isLoaded && can("watermarkRemoval")) return null;

  return (
    <div className={styles.watermark} aria-hidden="true" data-export-overlay>
      <span className={styles.watermarkMark} />
      cutecode.app
    </div>
  );
}
