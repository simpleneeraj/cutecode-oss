import { CheckCircleIcon } from "@solar-icons/react/linear/check-circle";

import { featureListStyles } from "./style";

type FeatureListProps = {
  points: string[];
};

const styles = featureListStyles();

export function FeatureList({ points }: FeatureListProps) {
  return (
    <ul className={styles.root()}>
      {points.map((point) => (
        <li className={styles.point()} key={point}>
          <CheckCircleIcon aria-hidden="true" className={styles.icon()} />
          {point}
        </li>
      ))}
    </ul>
  );
}
