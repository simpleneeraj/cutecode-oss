import { atom } from "jotai";
import {
  elementDarkModeAtom,
  elementFileNameAtom,
  elementPaddingAtom,
  elementTransparentAtom,
} from "./selectors";
import { themeBackgroundAtom } from "./theme";
import { selectedLanguageAtom } from "./language";
import { windowWidthAtom, exportSizeAtom } from "./ui";
import { backgroundImageAtom } from "./slides";

/*
 * Single composite atom that provides every piece of data the Presets
 * (frame-rendering) component needs.  Consuming it costs exactly ONE
 * subscription instead of the previous ten.
 *
 * Usage:
 *   const frame = useAtomValue(presetsAtom);
 *   const updateElement = useSetAtom(updateSlideElementAtom); // write-only, stays separate
 */
export const presetsAtom = atom((get) => ({
  padding: get(elementPaddingAtom),
  darkMode: get(elementDarkModeAtom),
  transparent: get(elementTransparentAtom),
  fileName: get(elementFileNameAtom),
  themeBackground: get(themeBackgroundAtom),
  backgroundImage: get(backgroundImageAtom),
  selectedLanguage: get(selectedLanguageAtom) ?? null,
  windowWidth: get(windowWidthAtom),
  exportSize: get(exportSizeAtom),
}));
