"use client";

import type { StyleSettings } from "@cutecode/ui/provider";
import { useState } from "react";

import { CustomizerControls } from "@/components/customizer/controls";

import { ExportActions } from "./export-actions";
import { PreviewApp } from "./preview-app";
import { themeBuilderStyles } from "./style";

type ThemeBuilderProps = {
  initialSettings: StyleSettings;
};

const styles = themeBuilderStyles();

export function ThemeBuilder({ initialSettings }: ThemeBuilderProps) {
  const [settings, setSettings] = useState(initialSettings);

  function changeSettings(changes: Partial<StyleSettings>) {
    setSettings((current) => ({ ...current, ...changes }));
  }

  return (
    <div className={styles.root()}>
      <div className={styles.panel()}>
        <CustomizerControls onSettingsChange={changeSettings} settings={settings} />
        <ExportActions settings={settings} />
      </div>
      <PreviewApp settings={settings} />
    </div>
  );
}
