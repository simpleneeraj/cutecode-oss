"use client";

import { type ReactNode, useState } from "react";

import { StateSwitch } from "../../../parts/family-options/state-switch";
import { WidgetExampleState, widgetExampleCopy, widgetExampleProps, widgetExampleChoices } from "./example-data";
import type { WidgetProps } from "./props";
import { widgetExampleStyles } from "./style";

type WidgetExampleProps = {
  children: (props: WidgetProps) => ReactNode;
};

const styles = widgetExampleStyles();

function WidgetExample({ children }: WidgetExampleProps) {
  const [state, setState] = useState(WidgetExampleState.Ready);

  return (
    <div className={styles.root()}>
      <StateSwitch
        choices={widgetExampleChoices}
        label={widgetExampleCopy.states}
        onValueChange={setState}
        value={state}
      />
      <div className={styles.stage()}>{children(widgetExampleProps(state))}</div>
    </div>
  );
}

export { WidgetExample };
