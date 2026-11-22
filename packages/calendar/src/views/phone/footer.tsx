"use client";

import type { ViewKind } from "../../types";
import { AddButton } from "./add-button";
import { phoneStyles } from "./style";
import { PhoneTabBar } from "./tab-bar";

export type PhoneTabs = {
  views: ViewKind[];
  current: ViewKind;
  onSelect: (view: ViewKind) => void;
};

type PhoneFooterProps = {
  tabs: PhoneTabs;
  onAdd: (anchor: HTMLElement) => void;
};

const styles = phoneStyles();

function PhoneFooter({ tabs, onAdd }: PhoneFooterProps) {
  return (
    <footer className={styles.footer()}>
      <AddButton onAdd={onAdd} />
      {tabs.views.length > 1 && (
        <div className={styles.tabs()}>
          <PhoneTabBar current={tabs.current} onSelect={tabs.onSelect} tabs={tabs.views} />
        </div>
      )}
    </footer>
  );
}

export { PhoneFooter };
