import type { ReactNode } from "react";

import { buttonPairStyles, neckPaths } from "./style";

type ButtonPairProps = {
  label: string;
  primary: ReactNode;
  secondary: ReactNode;
  onPrimaryClick: () => void;
  onSecondaryClick: () => void;
};

function ButtonPair({ label, primary, secondary, onPrimaryClick, onSecondaryClick }: ButtonPairProps) {
  const styles = buttonPairStyles();

  return (
    <div aria-label={label} className={styles.root()} data-slot="button-pair" role="group">
      <button className={styles.button({ class: styles.primary() })} onClick={onPrimaryClick} type="button">
        {primary}
      </button>
      <svg aria-hidden="true" className={styles.neck()} focusable="false" viewBox="0 0 24 44">
        <path className={styles.primaryNeck()} d={neckPaths.primary} />
        <path className={styles.secondaryNeck()} d={neckPaths.secondary} />
      </svg>
      <button className={styles.button({ class: styles.secondary() })} onClick={onSecondaryClick} type="button">
        {secondary}
      </button>
    </div>
  );
}

export { ButtonPair };
