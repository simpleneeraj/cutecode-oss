"use client";

import { Button } from "@cutecode/ui/components/button";
import { defaultStyleSettings, serializeStyleSettings } from "@cutecode/ui/provider";
import { useStyleSettings } from "@cutecode/ui/provider/use-style-settings";
import { RestartIcon } from "@solar-icons/react/linear/restart";
import { useTheme } from "fumadocs-ui/provider/base";
import Link from "next/link";
import { Fragment } from "react";

import { customizer, ThemePreference } from "./constants";

type CustomizerActionsProps = {
  onNavigate: () => void;
};

const defaultSettingsValue = serializeStyleSettings(defaultStyleSettings);

export function CustomizerActions({ onNavigate }: CustomizerActionsProps) {
  const { settings, updateStyleSettings } = useStyleSettings();
  const { theme, setTheme } = useTheme();
  const isDefault = serializeStyleSettings(settings) === defaultSettingsValue && theme === ThemePreference.System;

  function resetSettings() {
    if (isDefault) {
      return;
    }
    updateStyleSettings(defaultStyleSettings);
    setTheme(ThemePreference.System);
  }

  return (
    <Fragment>
      <Button aria-disabled={isDefault} onClick={resetSettings} variant="ghost">
        <RestartIcon aria-hidden="true" />
        Reset
      </Button>
      <Button onClick={onNavigate} render={<Link href={customizer.themeBuilderHref} />}>
        Open Theme Builder
      </Button>
    </Fragment>
  );
}
