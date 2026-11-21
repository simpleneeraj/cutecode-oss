import type { ReactNode } from "react";

import { codeBlockStyles } from "./style";

type CodeBlockProps = {
  lines?: ReactNode[];
  highlightedLine?: number;
  isSaved?: boolean;
  children?: ReactNode;
};

function CodeBlock({ lines = [], highlightedLine, isSaved = false, children }: CodeBlockProps) {
  const styles = codeBlockStyles();
  const hasLines = lines.length > 0;

  return (
    <div className={styles.root()} data-slot="code-block">
      <span aria-hidden="true" className={styles.backSheet()} />
      <span aria-hidden="true" className={styles.middleSheet()} />
      <div className={styles.sheet()}>
        <span aria-hidden="true" className={styles.edge()} />
        {isSaved ? <span aria-label="Saved" className={styles.saved()} role="img" /> : null}
        <pre className={styles.code()}>
          {hasLines ? (
            lines.map((line, index) => {
              const lineNumber = index + 1;
              const isHighlighted = lineNumber === highlightedLine;
              return (
                <span
                  className={codeBlockStyles({ isHighlighted }).line()}
                  data-highlighted={isHighlighted || undefined}
                  key={lineNumber}
                >
                  <span aria-hidden="true" className={styles.number()}>
                    {lineNumber}
                  </span>
                  <span>{line}</span>
                </span>
              );
            })
          ) : (
            <span className={styles.children()}>{children}</span>
          )}
        </pre>
      </div>
    </div>
  );
}

export { CodeBlock };
