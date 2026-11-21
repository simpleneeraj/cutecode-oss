import { useMemo, useRef, useState } from "react";
import { useAtomValue } from "jotai";
import { useMotionValueEvent, useTransform } from "motion/react";
import styles from "@/styles/editor/Editor.module.css";
import { sceneExportTimeAtom } from "@/components/presets/scene";
import type { TypingTimeline } from "@/lib/typing-timeline";
import { cn } from "@cutecode/ui/lib/cn";
import type { Language } from "../util/languages";
import { sliceTokens } from "./slice-tokens";
import TypedLines from "./typed-lines";
import useCodeTokens from "./use-code-tokens";
import useTypingClock from "./use-typing-clock";

const caretBlinkMs = 530;

function caretOpacityAt(timeMs: number): number {
  return Math.floor(timeMs / caretBlinkMs) % 2 === 0 ? 1 : 0;
}

type TypedCodeProps = {
  timeline: TypingTimeline;
  language: Language | null;
};

export default function TypedCode({ timeline, language }: TypedCodeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const exportTime = useAtomValue(sceneExportTimeAtom);
  const time = useTypingClock(containerRef, timeline.durationMs);
  const [played, setPlayed] = useState(() => ({ timeline, code: timeline.codeAt(time.get()) }));
  const playedCode = played.timeline === timeline ? played.code : timeline.codeAt(time.get());
  const playedCaretOpacity = useTransform(time, caretOpacityAt);
  const tokenize = useCodeTokens(language);
  const finalCode = useMemo(() => timeline.codeAt(timeline.durationMs), [timeline]);

  useMotionValueEvent(time, "change", (timeMs) => setPlayed({ timeline, code: timeline.codeAt(timeMs) }));

  const isExporting = exportTime !== null;
  const typedCode = isExporting ? timeline.codeAt(exportTime) : playedCode;
  const caretOpacity = isExporting ? caretOpacityAt(exportTime) : playedCaretOpacity;
  const { lines, color } = tokenize(finalCode.startsWith(typedCode) ? finalCode : typedCode);
  const typedLines = useMemo(() => sliceTokens(lines, typedCode), [lines, typedCode]);

  return (
    <>
      <div aria-hidden="true" className={cn(styles.formatted, "invisible")}>
        {`${finalCode} `}
      </div>
      <div ref={containerRef} className={cn(styles.formatted, styles.plainText)}>
        <pre style={{ color }}>
          <code>
            <TypedLines lines={typedLines} caretOpacity={caretOpacity} />
          </code>
        </pre>
      </div>
    </>
  );
}
