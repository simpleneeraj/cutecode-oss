import { Window } from "@cutecode/ui/tactile/window";

import { noteLines } from "./constants";
import { objectsBentoStyles } from "./style";

const styles = objectsBentoStyles();

export function WindowDemo() {
  return (
    <div className={styles.window()}>
      <Window title="Notes">
        <div aria-hidden="true" className={styles.noteBody()}>
          {noteLines.map((line) => (
            <span className={styles.noteLine()} key={line} />
          ))}
        </div>
      </Window>
    </div>
  );
}
