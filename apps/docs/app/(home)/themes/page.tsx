import { pickStyleSettings, readStyleSettings, styleSettingsCookie } from "@cutecode/ui/provider";
import type { Metadata } from "next";
import { cookies } from "next/headers";

import { SiteFooter } from "@/components/home/site-footer";
import { ThemeBuilder } from "@/components/theme-builder";

import { themesPageStyles } from "./style";

type ThemesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata: Metadata = {
  title: "Theme Builder | CuteUI",
  description: "Pick a CuteUI style, palette and font, preview them on a live app, then copy the CSS or share a link.",
};

const styles = themesPageStyles();

export default async function ThemesPage({ searchParams }: ThemesPageProps) {
  const cookieStore = await cookies();
  const siteSettings = readStyleSettings(cookieStore.get(styleSettingsCookie.name)?.value);
  const initialSettings = pickStyleSettings(await searchParams, siteSettings);

  return (
    <div className={styles.root()}>
      <div className={styles.main()}>
        <div className={styles.heading()}>
          <h1 className={styles.title()}>Theme Builder</h1>
          <p className={styles.description()}>
            Pick a style, palette and font. The preview shows them on a small CuteUI app before you apply them.
          </p>
        </div>
        <ThemeBuilder initialSettings={initialSettings} />
      </div>
      <SiteFooter />
    </div>
  );
}
