"use client";

import { defaultStyleSettings, type StyleSettings } from "@cutecode/ui/provider";
import { useState } from "react";

import { CustomizerControls } from "@/components/customizer/controls";

import { EditThemeDrawer } from "./edit-theme-drawer";
import { ExportActions } from "./export-actions";
import { ExportCode } from "./export-code";
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

  function resetSettings() {
    setSettings(defaultStyleSettings);
  }

  return (
    <div className={styles.root()}>
      <div className={styles.panel()}>
        <ExportActions onReset={resetSettings} settings={settings} />
        <CustomizerControls onSettingsChange={changeSettings} settings={settings} />
      </div>
      <div className={styles.stage()}>
        <PreviewApp settings={settings} />
        <ExportCode settings={settings} />
      </div>
      <EditThemeDrawer onReset={resetSettings} onSettingsChange={changeSettings} settings={settings} />
    </div>
  );
}
