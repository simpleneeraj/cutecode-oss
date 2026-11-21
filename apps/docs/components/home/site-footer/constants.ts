import { siteLinks } from "@/components/site-header/constants";

export const footerColumns = [
  {
    id: "product",
    title: "Product",
    links: [
      { label: "Components", href: siteLinks.components },
      { label: "Tactile", href: siteLinks.tactile },
      { label: "Themes", href: siteLinks.themes },
      { label: "Pricing", href: siteLinks.pricing },
    ],
  },
  {
    id: "docs",
    title: "Docs",
    links: [
      { label: "Installation", href: siteLinks.installation },
      { label: "Theming", href: siteLinks.themes },
      { label: "Theme Builder", href: siteLinks.themes },
    ],
  },
  {
    id: "project",
    title: "Project",
    links: [
      { label: "GitHub", href: siteLinks.github },
      { label: "MIT license", href: siteLinks.license },
    ],
  },
];
