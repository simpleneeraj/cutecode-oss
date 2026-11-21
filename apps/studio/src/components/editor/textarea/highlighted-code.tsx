import { cn as classNames } from "@/utils/cn";
import React, { useEffect, useState } from "react";
import { Language, LANGUAGES } from "../util/languages";

import styles from "@/styles/editor/Editor.module.css";
import { useAtomValue, useSetAtom } from "jotai";
import {
  elementThemeAtom,
  themeDarkModeAtom,
  loadingLanguageAtom,
  highlightReadyAtom,
  elementHighlightedLinesAtom,
} from "@/store/editor/editor";
import { useEditorContext } from "@/store/editor/context/editor";
import { isLanguageLoaded, resolveShikiLanguage, resolveShikiTheme } from "./shiki-options";

type PropTypes = {
  selectedLanguage: Language | null;
  code: string;
  previewData?: any;
};

const HighlightedCode: React.FC<PropTypes> = ({ selectedLanguage, code, previewData }) => {
  const [highlightedHtml, setHighlightedHtml] = useState("");
  const { highlighter } = useEditorContext();
  const setIsLoadingLanguage = useSetAtom(loadingLanguageAtom);
  const setHighlightReady = useSetAtom(highlightReadyAtom);

  // Use preview data if available, else Jotai
  const jotaiHighlightedLines = useAtomValue(elementHighlightedLinesAtom);
  const jotaiDarkMode = useAtomValue(themeDarkModeAtom);
  const jotaiThemeId = useAtomValue(elementThemeAtom);

  const highlightedLines = previewData ? previewData.properties?.highlightedLines || [] : jotaiHighlightedLines;
  const darkMode = previewData ? (previewData.properties?.darkMode ?? true) : jotaiDarkMode;
  const themeId = previewData ? previewData.properties?.theme || "default" : jotaiThemeId;

  const themeName = resolveShikiTheme(themeId, darkMode);
  const isPreview = !!previewData;

  useEffect(() => {
    const generateHighlightedHtml = async () => {
      if (!highlighter || !selectedLanguage || selectedLanguage === LANGUAGES.plaintext) {
        return code?.replace(/[\u00A0-\u9999<>\&]/g, (i) => `&#${i.charCodeAt(0)};`);
      }

      if (!isLanguageLoaded(highlighter, selectedLanguage)) {
        setIsLoadingLanguage(true);
        await highlighter.loadLanguage(selectedLanguage.src);
        setIsLoadingLanguage(false);
      }

      return highlighter.codeToHtml(code, {
        lang: resolveShikiLanguage(selectedLanguage),
        theme: themeName,
        transformers: [
          {
            line(node, line) {
              node.properties["data-line"] = line;
              if (highlightedLines.includes(line)) this.addClassToHast(node, "highlighted-line");
            },
          },
        ],
      });
    };

    const isFinal = selectedLanguage === LANGUAGES.plaintext || !!highlighter;

    generateHighlightedHtml().then((newHtml) => {
      setHighlightedHtml(newHtml);
      if (isFinal && !isPreview) setHighlightReady(true);
    });
  }, [
    code,
    selectedLanguage,
    highlighter,
    setIsLoadingLanguage,
    setHighlightedHtml,
    setHighlightReady,
    highlightedLines,
    themeName,
    isPreview,
  ]);

  return (
    <div
      className={classNames(styles.formatted, selectedLanguage === LANGUAGES.plaintext && styles.plainText)}
      dangerouslySetInnerHTML={{
        __html: highlightedHtml,
      }}
    />
  );
};

export default HighlightedCode;
