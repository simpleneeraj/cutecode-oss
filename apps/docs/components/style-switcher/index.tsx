"use client";

import { Button } from "@cutecode/ui/components/button";
import { Popover, PopoverPopup, PopoverTitle, PopoverTrigger } from "@cutecode/ui/components/popover";
import { type Style, suggestedFontPairings } from "@cutecode/ui/provider";
import { useStyleSettings } from "@cutecode/ui/provider/use-style-settings";
import { PaletteIcon } from "@solar-icons/react/linear/palette";

import { styleSwitcher } from "./constants";
import { PalettePicker } from "./palette-picker";
import { SettingSelect } from "./setting-select";
import { styleSwitcherStyles } from "./style";
import { ThemePicker } from "./theme-picker";

const styles = styleSwitcherStyles();

export function StyleSwitcher() {
  const { settings, updateStyleSettings } = useStyleSettings();

  function selectStyle(style: Style) {
    updateStyleSettings({ style, font: suggestedFontPairings[style] });
  }

  return (
    <Popover>
      <PopoverTrigger render={<Button aria-label="Change style" size="icon-sm" variant="ghost" />}>
        <PaletteIcon aria-hidden="true" />
      </PopoverTrigger>
      <PopoverPopup align="end">
        <div className={styles.panel()}>
          <PopoverTitle>Style</PopoverTitle>
          <SettingSelect
            label="Style"
            labels={styleSwitcher.styleLabels}
            onValueChange={selectStyle}
            value={settings.style}
          />
          <PalettePicker onPaletteChange={(palette) => updateStyleSettings({ palette })} palette={settings.palette} />
          <SettingSelect
            label="Font"
            labels={styleSwitcher.fontLabels}
            onValueChange={(font) => updateStyleSettings({ font })}
            value={settings.font}
          />
          <ThemePicker />
        </div>
      </PopoverPopup>
    </Popover>
  );
}
