import { useAtomValue } from "jotai";
import styles from "@/styles/editor/Frame.module.css";
import { useSubscription } from "@/hooks/use-subscription";
import { elementThemeAtom } from "@/store/editor/editor";
import { sponsorForTheme } from "@/lib/sponsors";

export default function Watermark() {
  const { can, isLoaded } = useSubscription();
  const sponsor = sponsorForTheme(useAtomValue(elementThemeAtom));

  if (isLoaded && can("watermarkRemoval")) return null;

  return (
    <div className={styles.watermark} aria-hidden="true" data-export-overlay>
      <span className={styles.watermarkMark} />
      cutecode.app
      {sponsor && <span className={styles.watermarkCredit}>Theme by {sponsor.name}</span>}
    </div>
  );
}
