import { useEffect, useMemo, useState } from "react";
import { useAtomValue } from "jotai";
import type { HighlighterCore, ThemedToken } from "shiki";
import { elementThemeAtom, themeDarkModeAtom } from "@/store/editor/editor";
import { useEditorContext } from "@/store/editor/context/editor";
import { LANGUAGES, type Language } from "../util/languages";
import { isLanguageLoaded, resolveShikiLanguage, resolveShikiTheme } from "./shiki-options";

export type CodeTokens = { lines: ThemedToken[][]; color?: string };

function toPlainTokens(code: string): CodeTokens {
  let offset = 0;
  const lines = code.split("\n").map((content) => {
    const line = [{ content, offset }];
    offset += content.length + 1;
    return line;
  });
  return { lines };
}

function useLoadedLanguage(language: Language | null) {
  const { highlighter } = useEditorContext();
  const [loadedLanguage, setLoadedLanguage] = useState<Language | null>(null);

  useEffect(() => {
    if (!highlighter || !language) return undefined;
    let isCancelled = false;
    const markLoaded = () => {
      if (!isCancelled) setLoadedLanguage(language);
    };
    if (isLanguageLoaded(highlighter, language)) markLoaded();
    else highlighter.loadLanguage(language.src).then(markLoaded);
    return () => {
      isCancelled = true;
    };
  }, [highlighter, language]);

  if (loadedLanguage !== language) return null;
  return loadedLanguage;
}

function highlightTokens(highlighter: HighlighterCore, code: string, lang: string, theme: string): CodeTokens {
  const { tokens, fg } = highlighter.codeToTokens(code, { lang, theme });
  return { lines: tokens, color: fg };
}

export default function useCodeTokens(language: Language | null) {
  const { highlighter } = useEditorContext();
  const themeId = useAtomValue(elementThemeAtom);
  const isDark = useAtomValue(themeDarkModeAtom);
  const loadedLanguage = useLoadedLanguage(language);
  const theme = resolveShikiTheme(themeId, isDark);

  return useMemo(() => {
    if (!highlighter || !loadedLanguage || loadedLanguage === LANGUAGES.plaintext) return toPlainTokens;
    const cache = new Map<string, CodeTokens>();
    const lang = resolveShikiLanguage(loadedLanguage);
    return (code: string) => {
      const cached = cache.get(code);
      if (cached) return cached;
      const result = highlightTokens(highlighter, code, lang, theme);
      cache.set(code, result);
      return result;
    };
  }, [highlighter, loadedLanguage, theme]);
}
