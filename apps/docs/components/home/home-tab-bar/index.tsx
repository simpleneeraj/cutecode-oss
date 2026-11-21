"use client";

import { TabBar, TabBarTab } from "@cutecode/ui/tactile/tab-bar";
import Link from "next/link";

import { homeTabs } from "./constants";

export function HomeTabBar() {
  return (
    <TabBar label="Sections">
      {homeTabs.map((tab) => (
        <TabBarTab
          href={tab.href}
          icon={tab.icon}
          isCurrent={tab.isCurrent}
          key={tab.href}
          render={<Link href={tab.href} />}
        >
          {tab.label}
        </TabBarTab>
      ))}
    </TabBar>
  );
}
