import { Fragment, type CSSProperties } from "react";
import { useAtomValue } from "jotai";
import type { MotionValue } from "motion/react";
import type { ThemedToken } from "shiki";
import { elementHighlightedLinesAtom } from "@/store/editor/editor";
import { cn } from "@/utils/cn";
import type { TypedLine } from "./slice-tokens";
import TypingCaret from "./typing-caret";

enum FontStyleFlag {
  Italic = 1,
  Bold = 2,
  Underline = 4,
}

function tokenStyle({ color, fontStyle = 0 }: ThemedToken): CSSProperties {
  return {
    color,
    fontStyle: fontStyle & FontStyleFlag.Italic ? "italic" : undefined,
    fontWeight: fontStyle & FontStyleFlag.Bold ? "bold" : undefined,
    textDecoration: fontStyle & FontStyleFlag.Underline ? "underline" : undefined,
  };
}

type TypedLinesProps = {
  lines: TypedLine[];
  caretOpacity: MotionValue<number> | number;
};

export default function TypedLines({ lines, caretOpacity }: TypedLinesProps) {
  const highlightedLines = useAtomValue(elementHighlightedLinesAtom);
  const lastIndex = lines.length - 1;

  return lines.map(({ start, tokens }, index) => (
    <Fragment key={start}>
      <span className={cn("line", highlightedLines.includes(index + 1) && "highlighted-line")} data-line={index + 1}>
        {tokens.map((token) => (
          <span key={token.offset} style={tokenStyle(token)}>
            {token.content}
          </span>
        ))}
        {index === lastIndex && <TypingCaret opacity={caretOpacity} />}
      </span>
      {index !== lastIndex && "\n"}
    </Fragment>
  ));
}
