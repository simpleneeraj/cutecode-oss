import { DocumentTextIcon } from "@solar-icons/react/bold-duotone/document-text";
import { HomeSmileIcon } from "@solar-icons/react/bold-duotone/home-smile";
import { PaletteIcon } from "@solar-icons/react/bold-duotone/palette";
import { Widget5Icon } from "@solar-icons/react/bold-duotone/widget-5";

const github = "https://github.com/simpleneeraj/cutecode-oss";

export const siteLinks = {
  home: "/",
  github,
  license: `${github}/blob/main/LICENSE`,
  docs: "/docs",
  installation: "/docs/installation",
  components: "/docs/components",
  tactile: "/docs/components#tactile",
  themes: "/themes",
  pricing: "/#pricing",
};

export const navigationLinks = [
  { label: "Components", href: siteLinks.components },
  { label: "Tactile", href: siteLinks.tactile },
  { label: "Themes", href: siteLinks.themes },
  { label: "Docs", href: siteLinks.docs },
  { label: "Pricing", href: siteLinks.pricing },
];

export const dockTabs = [
  { label: "Home", href: siteLinks.home, icon: HomeSmileIcon },
  { label: "Parts", href: siteLinks.components, icon: Widget5Icon },
  { label: "Themes", href: siteLinks.themes, icon: PaletteIcon },
  { label: "Docs", href: siteLinks.docs, icon: DocumentTextIcon },
];
