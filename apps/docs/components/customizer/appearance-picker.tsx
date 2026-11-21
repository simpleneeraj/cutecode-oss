"use client";

import { ToggleGroup, ToggleGroupItem } from "@cutecode/ui/components/toggle-group";
import { useTheme } from "fumadocs-ui/provider/base";

import { customizer, ThemePreference } from "./constants";
import { PickerSection } from "./picker-section";
import { customizerStyles } from "./style";

const styles = customizerStyles();
const themePreferences = Object.values(ThemePreference);

export function AppearancePicker() {
  const { theme, setTheme } = useTheme();
  const selectedThemes = themePreferences.filter((preference) => preference === theme);

  function selectTheme(values: string[]) {
    const selected = themePreferences.find((preference) => values.includes(preference));
    if (selected) {
      setTheme(selected);
    }
  }

  return (
    <PickerSection title="Appearance">
      <ToggleGroup aria-label="Appearance" onValueChange={selectTheme} value={selectedThemes}>
        {themePreferences.map((preference) => {
          const ThemeIcon = customizer.themeIcons[preference];
          return (
            <ToggleGroupItem key={preference} value={preference}>
              <span className={styles.themeLabel()}>
                <ThemeIcon aria-hidden="true" />
                {customizer.themeLabels[preference]}
              </span>
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>
    </PickerSection>
  );
}
