import { Card } from "@cutecode/ui/components/card";

import { previewStats } from "./constants";
import { themeBuilderStyles } from "./style";

const styles = themeBuilderStyles();

export function PreviewStats() {
  return (
    <div className={styles.stats()}>
      {previewStats.map((stat) => (
        <Card key={stat.id}>
          <div className={styles.stat()}>
            <span className={styles.statLabel()}>{stat.label}</span>
            <span className={styles.statValue()}>{stat.value}</span>
            <span className={styles.statChange()}>{stat.change}</span>
          </div>
        </Card>
      ))}
    </div>
  );
}
