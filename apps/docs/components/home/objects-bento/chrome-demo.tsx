"use client";

import { PageControl } from "@cutecode/ui/tactile/page-control";
import { TabBar, TabBarTab } from "@cutecode/ui/tactile/tab-bar";

import { siteLinks } from "@/components/site-header/constants";

import { demoTabs } from "./constants";
import { objectsBentoStyles } from "./style";

export function ChromeDemo() {
  return (
    <div aria-hidden="true" className={objectsBentoStyles().chrome()} inert>
      <TabBar label="Demo tabs">
        {demoTabs.map((tab) => (
          <TabBarTab href={siteLinks.tactile} icon={tab.icon} isCurrent={tab.isCurrent} key={tab.id}>
            {tab.label}
          </TabBarTab>
        ))}
      </TabBar>
      <PageControl count={3} current={0} />
    </div>
  );
}
