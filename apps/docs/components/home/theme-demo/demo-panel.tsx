import { Button } from "@cutecode/ui/components/button";
import { ToggleGroup, ToggleGroupItem } from "@cutecode/ui/components/toggle-group";
import type { Palette, Style } from "@cutecode/ui/provider";
import { Notification } from "@cutecode/ui/tactile/notification";

import { demoNotification, demoViews } from "./constants";
import { DemoSettings } from "./demo-settings";
import { themeDemoStyles } from "./style";

type DemoPanelProps = {
  style: Style;
  palette: Palette;
};

const styles = themeDemoStyles();

export function DemoPanel({ style, palette }: DemoPanelProps) {
  return (
    <div className={styles.panel()} data-palette={palette} data-style={style}>
      <div className={styles.panelHead()}>
        <h3 className={styles.greeting()}>Good morning</h3>
        <ToggleGroup aria-label="View" defaultValue={[demoViews[1]]}>
          {demoViews.map((view) => (
            <ToggleGroupItem key={view} value={view}>
              {view}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <div className={styles.panelBody()}>
        <DemoSettings />
        <div className={styles.wall()}>
          <Notification {...demoNotification} />
        </div>
      </div>
      <div className={styles.buttons()}>
        <Button className={styles.button()}>Continue</Button>
        <Button className={styles.button()} variant="gray">
          Not now
        </Button>
      </div>
    </div>
  );
}
