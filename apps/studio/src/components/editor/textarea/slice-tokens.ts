import type { ThemedToken } from "shiki";

export type TypedLine = { start: number; tokens: ThemedToken[] };

function clipTokens(tokens: ThemedToken[], length: number) {
  return tokens
    .filter((token) => token.offset < length)
    .map((token) => ({ ...token, content: token.content.slice(0, length - token.offset) }));
}

export function sliceTokens(lines: ThemedToken[][], typedCode: string): TypedLine[] {
  let start = 0;
  return typedCode.split("\n").map((text, index) => {
    const line = { start, tokens: clipTokens(lines[index] ?? [], typedCode.length) };
    start += text.length + 1;
    return line;
  });
}
