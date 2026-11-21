import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { Customizer } from "@/components/customizer";

export function baseOptions(): BaseLayoutProps {
  return {
    links: [
      { text: "Themes", url: "/themes" },
      { type: "custom", children: <Customizer /> },
    ],
    nav: { title: "CuteUI" },
    themeSwitch: { enabled: false },
  };
}
