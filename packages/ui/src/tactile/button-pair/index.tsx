import type { ReactNode } from "react";

import { buttonPairStyles } from "./style";

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
      <button className={styles.button({ class: styles.secondary() })} onClick={onSecondaryClick} type="button">
        {secondary}
      </button>
    </div>
  );
}

export { ButtonPair };
