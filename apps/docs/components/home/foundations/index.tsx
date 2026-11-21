import { AppIcon } from "@cutecode/ui/tactile/app-icon";
import { AppIconSize } from "@cutecode/ui/tactile/app-icon/style";

import { foundations } from "./constants";
import { foundationsStyles } from "./style";

const styles = foundationsStyles();

export function Foundations() {
  return (
    <section aria-label="Foundations" className={styles.root()}>
      {foundations.map((foundation) => (
        <article className={styles.card()} key={foundation.id}>
          <AppIcon icon={foundation.icon} size={AppIconSize.Small} tone={foundation.tone} />
          <h3 className={styles.title()}>{foundation.title}</h3>
          <p className={styles.description()}>{foundation.description}</p>
        </article>
      ))}
    </section>
  );
}
