import { CloudCrossIcon } from "@solar-icons/react/linear/cloud-cross";

import { stateCopy } from "./copy";
import { bannerStyles } from "./style";

const styles = bannerStyles();

function OfflineBanner() {
  return (
    <div className={styles.root()} data-slot="offline-banner" role="status">
      <CloudCrossIcon aria-hidden="true" className={styles.icon()} />
      <span className={styles.text()}>
        <strong className={styles.title()}>{stateCopy.offlineTitle}</strong>
        <span className={styles.description()}>{stateCopy.offlineDescription}</span>
      </span>
    </div>
  );
}

export { OfflineBanner };
