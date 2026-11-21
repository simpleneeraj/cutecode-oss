"use client";

import { TabBar, TabBarTab } from "@cutecode/ui/tactile/tab-bar";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { dockTabs } from "@/components/site-header/constants";

import { homeTabBarStyles } from "./style";

const styles = homeTabBarStyles();

export function HomeTabBar() {
  const pathname = usePathname();

  return (
    <span className={styles.root()}>
      <TabBar label="Sections">
        {dockTabs.map((tab) => (
          <TabBarTab
            href={tab.href}
            icon={tab.icon}
            isCurrent={tab.href === pathname}
            key={tab.href}
            render={<Link href={tab.href} />}
          >
            {tab.label}
          </TabBarTab>
        ))}
      </TabBar>
    </span>
  );
}
