import { renderThemeCss, type StyleSettings } from "@cutecode/ui/provider";
import { CodeBlock } from "@cutecode/ui/tactile/code-block";

import { themeBuilder } from "./constants";
import { themeBuilderStyles } from "./style";

type PreviewCodeProps = {
  settings: StyleSettings;
};

const styles = themeBuilderStyles();

function readCodeLines(settings: StyleSettings) {
  const [rootBlock = ""] = renderThemeCss(settings).split("\n\n");
  const tokenLines = rootBlock
    .split("\n")
    .filter((line) => themeBuilder.codeTokens.some((token) => line.includes(token)));
  return [":root {", ...tokenLines, "}"];
}

export function PreviewCode({ settings }: PreviewCodeProps) {
  return (
    <div className={styles.code()}>
      <CodeBlock highlightedLine={2} isSaved lines={readCodeLines(settings)} />
    </div>
  );
}
