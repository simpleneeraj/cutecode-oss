"use client";

import { useRender } from "@base-ui/react/use-render";
import type { Icon } from "@solar-icons/react/lib/types";
import { Fragment, type ReactNode } from "react";

import { tabBarStyles } from "./style";

type TabBarProps = {
  label: string;
  children: ReactNode;
};

type TabBarTabProps = {
  href: string;
  icon: Icon;
  isCurrent?: boolean;
  render?: useRender.RenderProp;
  children: ReactNode;
};

const styles = tabBarStyles();

function TabBar({ label, children }: TabBarProps) {
  return (
    <nav aria-label={label} className={styles.root()} data-slot="tab-bar">
      {children}
    </nav>
  );
}

function TabBarTab({ href, icon: Glyph, isCurrent, render, children }: TabBarTabProps) {
  return useRender({
    defaultTagName: "a",
    render,
    props: {
      "aria-current": isCurrent ? "page" : undefined,
      className: styles.tab(),
      "data-current": isCurrent ? "" : undefined,
      "data-slot": "tab-bar-tab",
      href,
      children: (
        <Fragment>
          <Glyph aria-hidden="true" className={styles.icon()} />
          <span className={styles.label()}>{children}</span>
        </Fragment>
      ),
    },
  });
}

export { TabBar, TabBarTab };
