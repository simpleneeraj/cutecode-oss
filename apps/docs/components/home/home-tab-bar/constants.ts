import { HomeSmileIcon } from "@solar-icons/react/linear/home-smile";
import { MagicWandIcon } from "@solar-icons/react/linear/magic-wand";
import { Widget5Icon } from "@solar-icons/react/linear/widget-5";

import { siteLinks } from "@/components/site-header/constants";

export const homeTabs = [
  { label: "Home", href: "/", icon: HomeSmileIcon, isCurrent: true },
  { label: "Components", href: siteLinks.components, icon: Widget5Icon, isCurrent: false },
  { label: "Studio", href: siteLinks.studio, icon: MagicWandIcon, isCurrent: false },
];
