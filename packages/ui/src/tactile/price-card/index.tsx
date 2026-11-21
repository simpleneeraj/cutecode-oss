import type { useRender } from "@base-ui/react/use-render";
import { CheckCircleIcon } from "@solar-icons/react/linear/check-circle";
import type { ReactNode } from "react";

import { Button } from "../../components/button";
import { Chip } from "../chip";
import { Tone } from "../tone";
import { priceCardStyles } from "./style";

type PriceCardProps = {
  isFeatured?: boolean;
  children: ReactNode;
};

type PriceCardHeaderProps = {
  name: string;
  badge?: string;
};

type PriceCardAmountProps = {
  price: string;
  period: string;
};

type PriceCardNoteProps = {
  children: ReactNode;
};

type PriceCardActionProps = {
  isFeatured?: boolean;
  render?: useRender.RenderProp;
  children: ReactNode;
};

type PriceCardFeaturesProps = {
  features: string[];
};

const styles = priceCardStyles();

function PriceCard({ isFeatured, children }: PriceCardProps) {
  return (
    <article className={priceCardStyles({ isFeatured }).root()} data-slot="price-card">
      {children}
    </article>
  );
}

function PriceCardHeader({ name, badge }: PriceCardHeaderProps) {
  return (
    <div className={styles.header()} data-slot="price-card-header">
      <h3 className={styles.name()}>{name}</h3>
      {badge ? <Chip tone={Tone.Accent}>{badge}</Chip> : null}
    </div>
  );
}

function PriceCardAmount({ price, period }: PriceCardAmountProps) {
  return (
    <p className={styles.amount()} data-slot="price-card-amount">
      <span className={styles.price()}>{price}</span>
      <span className={styles.period()}>{period}</span>
    </p>
  );
}

function PriceCardNote({ children }: PriceCardNoteProps) {
  return (
    <p className={styles.note()} data-slot="price-card-note">
      {children}
    </p>
  );
}

function PriceCardAction({ isFeatured, render, children }: PriceCardActionProps) {
  return (
    <Button render={render} size="lg" variant={isFeatured ? "filled" : "gray"}>
      {children}
    </Button>
  );
}

function PriceCardFeatures({ features }: PriceCardFeaturesProps) {
  return (
    <ul className={styles.features()} data-slot="price-card-features">
      {features.map((feature) => (
        <li className={styles.feature()} key={feature}>
          <CheckCircleIcon aria-hidden="true" className={styles.featureIcon()} />
          {feature}
        </li>
      ))}
    </ul>
  );
}

export { PriceCard, PriceCardAction, PriceCardAmount, PriceCardFeatures, PriceCardHeader, PriceCardNote };
