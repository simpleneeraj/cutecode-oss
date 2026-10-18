import { ElementType } from "@/typings/editor";
import { familySnippets } from "./family";
import { funnySnippets } from "./funny";
import { heartbreakSnippets } from "./heartbreak";
import { loveSnippets } from "./love";
import { motivationSnippets } from "./motivation";
import { Mood, Snippet, SnippetLanguage } from "./types";

export type { Mood, Snippet, SnippetLanguage };

export const MOODS: Mood[] = ["Funny", "Love", "Family & Friends", "Motivation", "Heartbreak"];

export const SNIPPETS: Snippet[] = [
  ...funnySnippets,
  ...loveSnippets,
  ...familySnippets,
  ...motivationSnippets,
  ...heartbreakSnippets,
];

const LANGUAGE_ICONS: Record<SnippetLanguage, string> = {
  TypeScript: "typescript",
  Python: "python",
  Rust: "rust",
  Go: "go",
  Java: "java",
  Swift: "swift",
};

const DEFAULT_LANGUAGE: SnippetLanguage = "TypeScript";

export function isSnippetLanguage(language: unknown): language is SnippetLanguage {
  return typeof language === "string" && language in LANGUAGE_ICONS;
}

export function snippetPatch(snippet: Snippet, language: unknown): Partial<ElementType> {
  const resolved = isSnippetLanguage(language) ? language : DEFAULT_LANGUAGE;
  const { fileName, code } = snippet.variants[resolved];
  const icon = `https://raw.githubusercontent.com/simpleneeraj/vscode-material-icon-theme/main/icons/${LANGUAGE_ICONS[resolved]}.svg`;
  return {
    content: code,
    properties: { language: resolved, isSampleCode: false },
    header: { properties: { title: { text: fileName, icon } } },
  };
}

const SNIPPET_BY_CODE = new Map(
  SNIPPETS.flatMap((snippet) => Object.values(snippet.variants).map(({ code }): [string, Snippet] => [code, snippet])),
);

export function findSnippet(content: unknown) {
  return typeof content === "string" ? SNIPPET_BY_CODE.get(content) : undefined;
}
