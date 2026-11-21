import { BoltIcon } from "@solar-icons/react/bold-duotone/bolt";
import { PaletteIcon } from "@solar-icons/react/bold-duotone/palette";
import { Widget5Icon } from "@solar-icons/react/bold-duotone/widget-5";

import { siteLinks } from "@/components/site-header/constants";

export enum PreviewTab {
  Preview = "preview",
  Code = "code",
}

export const previewTabs = [
  { value: PreviewTab.Preview, label: "Preview" },
  { value: PreviewTab.Code, label: "Code" },
];

export const docLinks = [
  {
    id: "installation",
    title: "Installation",
    line: "Set up in two minutes",
    href: siteLinks.installation,
    icon: BoltIcon,
  },
  { id: "theming", title: "Theming", line: "Styles, colors and fonts", href: siteLinks.themes, icon: PaletteIcon },
  {
    id: "components",
    title: "Components",
    line: "Every part, with props",
    href: siteLinks.components,
    icon: Widget5Icon,
  },
];
