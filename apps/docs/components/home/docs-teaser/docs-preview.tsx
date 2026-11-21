"use client";

import { ToggleGroup, ToggleGroupItem } from "@cutecode/ui/components/toggle-group";
import { Window } from "@cutecode/ui/tactile/window";
import { useState } from "react";

import { PreviewTab, previewTabs } from "./constants";
import { PreviewStage } from "./preview-stage";
import { docsTeaserStyles } from "./style";

const styles = docsTeaserStyles();

export function DocsPreview() {
  const [tab, setTab] = useState(PreviewTab.Preview);

  function selectTab(values: string[]) {
    const selected = previewTabs.find((option) => values.includes(option.value));
    if (selected) {
      setTab(selected.value);
    }
  }

  return (
    <Window title="Folder">
      <div className={styles.preview()}>
        <h3 className={styles.previewTitle()}>Folder</h3>
        <p className={styles.previewLead()}>A folder that opens when you hover or tap it.</p>
        <ToggleGroup aria-label="Preview or code" onValueChange={selectTab} value={[tab]}>
          {previewTabs.map((option) => (
            <ToggleGroupItem key={option.value} value={option.value}>
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <PreviewStage tab={tab} />
      </div>
    </Window>
  );
}
