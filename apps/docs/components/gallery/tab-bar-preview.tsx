"use client";

import { TabBar, TabBarTab } from "@cutecode/ui/tactile/tab-bar";
import { GalleryIcon } from "@solar-icons/react/linear/gallery";
import { Home2Icon } from "@solar-icons/react/linear/home-2";
import { SettingsIcon } from "@solar-icons/react/linear/settings";

export function TabBarPreview() {
  return (
    <TabBar label="Sections">
      <TabBarTab href="/docs" icon={Home2Icon} isCurrent>
        Home
      </TabBarTab>
      <TabBarTab href="/docs/components" icon={GalleryIcon}>
        Gallery
      </TabBarTab>
      <TabBarTab href="/docs/installation" icon={SettingsIcon}>
        Setup
      </TabBarTab>
    </TabBar>
  );
}
