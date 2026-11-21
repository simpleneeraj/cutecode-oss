"use client";

import { ToggleGroup, ToggleGroupItem } from "@cutecode/ui/components/toggle-group";
import { useTheme } from "fumadocs-ui/provider/base";

import { styleSwitcher, ThemePreference } from "./constants";
import { styleSwitcherStyles } from "./style";

const styles = styleSwitcherStyles();
const themePreferences = Object.values(ThemePreference);

export function ThemePicker() {
  const { theme, setTheme } = useTheme();
  const selectedThemes = themePreferences.filter((preference) => preference === theme);

  function selectTheme(values: string[]) {
    const selected = themePreferences.find((preference) => values.includes(preference));
    if (selected) {
      setTheme(selected);
    }
  }

  return (
    <div className={styles.group()}>
      <span className={styles.caption()}>Appearance</span>
      <ToggleGroup aria-label="Appearance" onValueChange={selectTheme} size="sm" value={selectedThemes}>
        {themePreferences.map((preference) => {
          const ThemeIcon = styleSwitcher.themeIcons[preference];
          return (
            <ToggleGroupItem key={preference} value={preference}>
              <span className={styles.themeLabel()}>
                <ThemeIcon aria-hidden="true" />
                {styleSwitcher.themeLabels[preference]}
              </span>
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>
    </div>
  );
}
