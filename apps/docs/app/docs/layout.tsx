import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { Customizer } from "@/components/customizer";
import { source } from "@/lib/source";

type DocsRootLayoutProps = {
  children: ReactNode;
};

export default function DocsRootLayout({ children }: DocsRootLayoutProps) {
  return (
    <DocsLayout
      links={[
        { text: "Themes", url: "/themes" },
        { type: "custom", children: <Customizer /> },
      ]}
      nav={{ title: "CuteUI" }}
      themeSwitch={{ enabled: false }}
      tree={source.getPageTree()}
    >
      {children}
    </DocsLayout>
  );
}
