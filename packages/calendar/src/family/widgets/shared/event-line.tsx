import { toneStyles } from "../../../parts/tone/style";
import type { WidgetLine } from "./model";
import { widgetLineStyles } from "./style";

type EventLineProps = {
  line: WidgetLine;
};

const styles = widgetLineStyles();

function EventLine({ line }: EventLineProps) {
  const tone = toneStyles({ tone: line.tone });

  return (
    <div className={styles.root()} data-slot="widget-line">
      <span aria-hidden="true" className={`${styles.bar()} ${tone.bar()}`} />
      <div className={styles.text()}>
        <strong className={styles.title()}>{line.title}</strong>
        <span className={styles.detail()}>{line.detail}</span>
      </div>
    </div>
  );
}

export { EventLine };
