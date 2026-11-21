"use client";

import { Button } from "@cutecode/ui/components/button";
import { renderThemeCss, serializeStyleSettings, type StyleSettings } from "@cutecode/ui/provider";
import { useStyleSettings } from "@cutecode/ui/provider/use-style-settings";
import { CheckCircleIcon } from "@solar-icons/react/linear/check-circle";
import { CopyIcon } from "@solar-icons/react/linear/copy";
import { LinkIcon } from "@solar-icons/react/linear/link";

import { CopyTextButton } from "@/components/customizer/copy-text-button";
import { PickerSection } from "@/components/customizer/picker-section";

import { themeBuilder } from "./constants";
import { themeBuilderStyles } from "./style";

type ExportActionsProps = {
  settings: StyleSettings;
};

const styles = themeBuilderStyles();

function readShareLink(settings: StyleSettings) {
  const query = new URLSearchParams(settings);
  return `${window.location.origin}${themeBuilder.path}?${query}`;
}

export function ExportActions({ settings }: ExportActionsProps) {
  const { settings: siteSettings, updateStyleSettings } = useStyleSettings();
  const isApplied = serializeStyleSettings(siteSettings) === serializeStyleSettings(settings);

  return (
    <PickerSection title="Export">
      <div className={styles.actions()}>
        <Button disabled={isApplied} onClick={() => updateStyleSettings(settings)}>
          {isApplied ? <CheckCircleIcon aria-hidden="true" /> : null}
          {isApplied ? "Applied to Site" : "Apply to Site"}
        </Button>
        <CopyTextButton copiedLabel="Copied" icon={CopyIcon} label="Copy CSS" readText={() => renderThemeCss(settings)} />
        <CopyTextButton copiedLabel="Link copied" icon={LinkIcon} label="Share" readText={() => readShareLink(settings)} />
      </div>
      <p className={styles.actionsHint()}>
        The preview changes only here. Apply to Site saves it for every CuteUI page you visit.
      </p>
    </PickerSection>
  );
}
