import "./globals.css";

import { readStyleSettings, styleSettingsCookie } from "@cutecode/ui/provider";
import { RootProvider } from "fumadocs-ui/provider/next";
import { cookies } from "next/headers";
import type { ReactNode } from "react";
import { fontPairingCss } from "@/lib/fonts";

type RootLayoutProps = {
  children: ReactNode;
};

export default async function RootLayout({ children }: RootLayoutProps) {
  const cookieStore = await cookies();
  const settings = readStyleSettings(cookieStore.get(styleSettingsCookie.name)?.value);

  return (
    <html
      data-font={settings.font}
      data-palette={settings.palette}
      data-style={settings.style}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <style href="font-pairings" precedence="default">
          {fontPairingCss}
        </style>
      </head>
      <body className="flex min-h-dvh flex-col">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
