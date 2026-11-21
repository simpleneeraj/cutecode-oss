"use client";

import { Button } from "@cutecode/ui/components/button";
import { defaultStyleSettings, serializeStyleSettings, type StyleSettings } from "@cutecode/ui/provider";
import { useStyleSettings } from "@cutecode/ui/provider/use-style-settings";
import { CheckCircleIcon } from "@solar-icons/react/linear/check-circle";
import { LinkIcon } from "@solar-icons/react/linear/link";
import { RestartIcon } from "@solar-icons/react/linear/restart";

import { CopyTextButton } from "@/components/customizer/copy-text-button";
import { SwapLabel } from "@/components/customizer/swap-label";

import { themeBuilder } from "./constants";
import { themeBuilderStyles } from "./style";

type ExportActionsProps = {
  settings: StyleSettings;
  onReset: () => void;
};

const styles = themeBuilderStyles();
const defaultSettingsValue = serializeStyleSettings(defaultStyleSettings);

function readShareLink(settings: StyleSettings) {
  const query = new URLSearchParams(settings);
  return `${window.location.origin}${themeBuilder.path}?${query}`;
}

export function ExportActions({ settings, onReset }: ExportActionsProps) {
  const { settings: siteSettings, updateStyleSettings } = useStyleSettings();
  const settingsValue = serializeStyleSettings(settings);
  const isApplied = serializeStyleSettings(siteSettings) === settingsValue;
  const isDefault = settingsValue === defaultSettingsValue;
  const applyLabel = isApplied ? "Applied to Site" : "Apply to Site";

  function applySettings() {
    if (isApplied) {
      return;
    }
    updateStyleSettings(settings);
  }

  function resetSettings() {
    if (isDefault) {
      return;
    }
    onReset();
  }

  return (
    <div className={styles.actionsArea()}>
      <div className={styles.actions()}>
        <Button aria-disabled={isApplied} className={styles.applyButton()} onClick={applySettings}>
          <SwapLabel swapKey={applyLabel}>
            {isApplied ? <CheckCircleIcon aria-hidden="true" /> : null}
            {applyLabel}
          </SwapLabel>
        </Button>
        <CopyTextButton copiedLabel="Link copied" icon={LinkIcon} label="Share" readText={() => readShareLink(settings)} />
        <Button aria-disabled={isDefault} aria-label="Reset" onClick={resetSettings} size="icon" variant="ghost">
          <RestartIcon aria-hidden="true" />
        </Button>
      </div>
      <p className={styles.actionsHint()}>{themeBuilder.actionsHint}</p>
    </div>
  );
}
