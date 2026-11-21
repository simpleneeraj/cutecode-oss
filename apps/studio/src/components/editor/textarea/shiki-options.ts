import type { Highlighter } from "shiki";
import { themes } from "@/components/presets/themes";
import type { Language } from "../util/languages";

export function resolveShikiTheme(themeId: string, isDark: boolean) {
  if (themeId === "tailwind") return isDark ? "tailwind-dark" : "tailwind-light";
  if (themes[themeId]?.group === "Shiki") return themeId;
  return "cutecode-theme";
}

export function resolveShikiLanguage(language: Language) {
  const name = language.name.toLowerCase();
  if (name === "typescript") return "tsx";
  return name;
}

export function isLanguageLoaded(highlighter: Highlighter, language: Language) {
  return highlighter.getLoadedLanguages().includes(language.name.toLowerCase());
}
