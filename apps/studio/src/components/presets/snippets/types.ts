export type SnippetLanguage = "TypeScript" | "Python" | "Rust" | "Go" | "Java" | "Swift";

export type Mood = "Funny" | "Love" | "Heartbreak" | "Family & Friends" | "Motivation";

export type SnippetVariant = { fileName: string; code: string };

export type Snippet = {
  id: string;
  name: string;
  mood: Mood;
  variants: Record<SnippetLanguage, SnippetVariant>;
};
