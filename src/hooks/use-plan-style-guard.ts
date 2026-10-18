"use client";

import { useEffect } from "react";
import { useAtom, useAtomValue } from "jotai";
import { produce } from "immer";
import { editorAtom } from "@/store/editor/editor/core";
import { previewThemeAtom } from "@/store/editor/editor/theme";
import { themes } from "@/components/presets/themes";
import fonts from "@/fonts/editor/fonts";
import { BadgeVariant } from "@/typings/editor";
import { useSubscription } from "@/hooks/use-subscription";

const isPremium = (tags?: string[]) => tags?.includes(BadgeVariant.PREMIUM) ?? false;

const premiumThemeIds = new Set(
  Object.values(themes)
    .filter((theme) => isPremium(theme.tags))
    .map((theme) => theme.id),
);

const premiumFontNames = new Set(fonts.filter((font) => isPremium(font.tags)).map((font) => font.name));

const DEFAULT_THEME = themes.mono.id;
const DEFAULT_FONT = "DM Mono";

export function usePlanStyleGuard() {
  const [editor, setEditor] = useAtom(editorAtom);
  const previewTheme = useAtomValue(previewThemeAtom);
  const { can, isLoaded } = useSubscription();
  const allowsThemes = can("premiumThemes");
  const allowsFonts = can("premiumFonts");

  useEffect(() => {
    if (!isLoaded) return;
    const isPreview = (elementId: string, theme?: string) =>
      previewTheme?.elementId === elementId && previewTheme.themeId === theme;
    const isLockedTheme = (elementId: string, theme?: string) =>
      !allowsThemes && !!theme && !isPreview(elementId, theme) && premiumThemeIds.has(theme);
    const isLockedFont = (font?: string) => !allowsFonts && !!font && premiumFontNames.has(font);
    const hasLocked = Object.entries(editor.elements).some(
      ([id, element]) => isLockedTheme(id, element.properties?.theme) || isLockedFont(element.style?.fontFamily),
    );
    if (!hasLocked) return;
    setEditor(
      produce(editor, (draft) => {
        for (const [id, element] of Object.entries(draft.elements)) {
          if (element.properties && isLockedTheme(id, element.properties.theme)) element.properties.theme = DEFAULT_THEME;
          if (element.style && isLockedFont(element.style.fontFamily)) element.style.fontFamily = DEFAULT_FONT;
        }
      }),
    );
  }, [editor, setEditor, isLoaded, allowsThemes, allowsFonts, previewTheme]);
}
